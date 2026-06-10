from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

import models
import schemas
from auth import hash_password, verify_password


def effective_price(price_row: models.ProductPrice) -> float:
    if price_row.on_sale and price_row.sale_price is not None:
        return price_row.sale_price
    return price_row.price


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        email=user.email.lower(),
        name=user.name.strip(),
        password_hash=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email.lower())
    if not user or not verify_password(password, user.password_hash):
        return None
    return user


def get_markets(db: Session, search: str | None = None):
    query = db.query(models.Market)
    if search:
        query = query.filter(models.Market.name.ilike(f"%{search}%"))
    return query.order_by(models.Market.name).all()


def get_market(db: Session, market_id: int):
    return db.query(models.Market).filter(models.Market.id == market_id).first()


def get_market_branches(db: Session, market_id: int):
    return (
        db.query(models.MarketBranch)
        .filter(models.MarketBranch.market_id == market_id)
        .order_by(models.MarketBranch.name)
        .all()
    )


def _product_lowest_price(prices: list[models.ProductPrice]) -> tuple[float, bool]:
    if not prices:
        return 0.0, False
    lowest = min(effective_price(p) for p in prices)
    on_sale = any(p.on_sale for p in prices)
    return lowest, on_sale


def _price_to_schema(price_row: models.ProductPrice) -> schemas.ProductPriceOut:
    return schemas.ProductPriceOut(
        market_id=price_row.market_id,
        market_name=price_row.market.name,
        price=price_row.price,
        sale_price=price_row.sale_price,
        on_sale=price_row.on_sale,
        effective_price=effective_price(price_row),
    )


def search_products(db: Session, search: str | None = None, market_id: int | None = None):
    query = db.query(models.Product).options(
        joinedload(models.Product.prices).joinedload(models.ProductPrice.market)
    )
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(models.Product.name.ilike(term), models.Product.category.ilike(term))
        )
    products = query.order_by(models.Product.name).all()
    results = []
    for product in products:
        prices = product.prices
        if market_id:
            prices = [p for p in prices if p.market_id == market_id]
        if market_id and not prices:
            continue
        lowest, on_sale = _product_lowest_price(prices)
        results.append(
            schemas.ProductListItem(
                id=product.id,
                name=product.name,
                category=product.category,
                unit=product.unit,
                image_url=product.image_url,
                lowest_price=lowest,
                on_sale=on_sale,
            )
        )
    return results


def get_product_detail(db: Session, product_id: int):
    product = (
        db.query(models.Product)
        .options(joinedload(models.Product.prices).joinedload(models.ProductPrice.market))
        .filter(models.Product.id == product_id)
        .first()
    )
    if not product:
        return None
    price_rows = sorted(product.prices, key=lambda p: effective_price(p))
    prices = [_price_to_schema(p) for p in price_rows]
    lowest = prices[0].effective_price if prices else 0.0
    return schemas.ProductDetail(
        id=product.id,
        name=product.name,
        description=product.description,
        category=product.category,
        unit=product.unit,
        image_url=product.image_url,
        prices=prices,
        lowest_price=lowest,
    )


def _get_price_for_market(db: Session, product_id: int, market_id: int):
    return (
        db.query(models.ProductPrice)
        .options(joinedload(models.ProductPrice.market))
        .filter(
            models.ProductPrice.product_id == product_id,
            models.ProductPrice.market_id == market_id,
        )
        .first()
    )


def calculate_order(db: Session, items: list[schemas.CartItemIn]) -> schemas.OrderCalculation:
    product_ids = [item.product_id for item in items]
    products = (
        db.query(models.Product)
        .options(joinedload(models.Product.prices).joinedload(models.ProductPrice.market))
        .filter(models.Product.id.in_(product_ids))
        .all()
    )
    product_map = {p.id: p for p in products}
    markets = db.query(models.Market).order_by(models.Market.name).all()

    cheapest_per_product_total = 0.0
    for item in items:
        product = product_map.get(item.product_id)
        if not product or not product.prices:
            continue
        cheapest = min(effective_price(p) for p in product.prices)
        cheapest_per_product_total += cheapest * item.qty

    per_market = []
    for market in markets:
        total = 0.0
        available = 0
        missing = []
        for item in items:
            product = product_map.get(item.product_id)
            if not product:
                missing.append(f"Product #{item.product_id}")
                continue
            price_row = next((p for p in product.prices if p.market_id == market.id), None)
            if not price_row:
                missing.append(product.name)
                continue
            total += effective_price(price_row) * item.qty
            available += 1
        per_market.append(
            schemas.MarketTotalOut(
                market_id=market.id,
                market_name=market.name,
                total=round(total, 2),
                available_items=available,
                missing_products=missing,
                is_complete=len(missing) == 0,
            )
        )

    complete_markets = [m for m in per_market if m.is_complete]
    if complete_markets:
        cheapest_single = min(complete_markets, key=lambda m: m.total)
    else:
        cheapest_single = min(per_market, key=lambda m: m.total) if per_market else None

    for market_total in per_market:
        if cheapest_single and market_total.market_id == cheapest_single.market_id:
            market_total.is_cheapest = True

    max_savings = round(cheapest_per_product_total - cheapest_single.total, 2) if cheapest_single else 0.0

    return schemas.OrderCalculation(
        per_market=per_market,
        cheapest_per_product_total=round(cheapest_per_product_total, 2),
        cheapest_single_market=cheapest_single,
        max_savings=max(max_savings, 0.0),
    )


def create_order(db: Session, user_id: int, order_in: schemas.OrderCreate):
    calculation = calculate_order(db, order_in.items)
    market = get_market(db, order_in.market_id)
    if not market:
        raise ValueError("Market not found")

    market_total = next(
        (m for m in calculation.per_market if m.market_id == order_in.market_id), None
    )
    if not market_total:
        raise ValueError("Invalid market")

    db_order = models.Order(
        user_id=user_id,
        market_id=order_in.market_id,
        total=market_total.total,
        cheapest_per_product_total=calculation.cheapest_per_product_total,
        cheapest_single_market_total=calculation.cheapest_single_market.total,
        savings=round(calculation.cheapest_per_product_total - market_total.total, 2),
    )
    db.add(db_order)
    db.flush()

    for item in order_in.items:
        price_row = _get_price_for_market(db, item.product_id, order_in.market_id)
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        unit_price = effective_price(price_row) if price_row else 0.0
        db.add(
            models.OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                product_name=product.name if product else f"Product {item.product_id}",
                qty=item.qty,
                unit_price=unit_price,
            )
        )

    db.commit()
    db.refresh(db_order)
    return db_order


def get_user_orders(db: Session, user_id: int):
    return (
        db.query(models.Order)
        .options(
            joinedload(models.Order.items),
            joinedload(models.Order.market),
        )
        .filter(models.Order.user_id == user_id)
        .order_by(models.Order.created_at.desc())
        .all()
    )


def order_to_schema(order: models.Order) -> schemas.OrderOut:
    return schemas.OrderOut(
        id=order.id,
        market_id=order.market_id,
        market_name=order.market.name if order.market else "",
        total=order.total,
        cheapest_per_product_total=order.cheapest_per_product_total,
        cheapest_single_market_total=order.cheapest_single_market_total,
        savings=order.savings,
        created_at=order.created_at,
        items=[
            schemas.OrderItemOut(
                product_id=item.product_id,
                product_name=item.product_name,
                qty=item.qty,
                unit_price=item.unit_price,
            )
            for item in order.items
        ],
    )


def get_savings_summary(db: Session, user_id: int) -> schemas.SavingsSummary:
    orders = get_user_orders(db, user_id)
    total_savings = round(sum(max(o.savings, 0) for o in orders), 2)
    count = len(orders)
    if count == 0:
        message = "Start shopping to track your savings!"
    else:
        message = f"You have saved {total_savings:.2f} KM with the last {count} purchases."
    return schemas.SavingsSummary(
        total_savings=total_savings,
        purchase_count=count,
        message=message,
    )
