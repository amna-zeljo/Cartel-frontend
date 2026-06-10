from sqlalchemy.orm import Session

import models
from auth import hash_password
from database import Base, SessionLocal, engine


def seed_database(db: Session):
    if db.query(models.Market).count() > 0:
        return

    markets = [
        models.Market(name="Bingo", description="Popular Bosnian supermarket chain", color="#E53935"),
        models.Market(name="Konzum", description="Everyday groceries at fair prices", color="#1565C0"),
        models.Market(name="Mercator", description="Wide selection of fresh products", color="#F9A825"),
        models.Market(name="Amko", description="Neighborhood market with local goods", color="#2E7D32"),
    ]
    db.add_all(markets)
    db.flush()

    branches = [
        models.MarketBranch(market_id=1, name="Bingo Ilidža", address="Butmirska cesta 14, Sarajevo", latitude=43.8284, longitude=18.3102),
        models.MarketBranch(market_id=1, name="Bingo Marijin Dvor", address="Maršala Tita 9, Sarajevo", latitude=43.8563, longitude=18.4131),
        models.MarketBranch(market_id=2, name="Konzum Centar", address="Ferhadija 12, Sarajevo", latitude=43.8590, longitude=18.4250),
        models.MarketBranch(market_id=2, name="Konzum Dobrinja", address="Butmirska cesta 1, Sarajevo", latitude=43.8231, longitude=18.3365),
        models.MarketBranch(market_id=3, name="Mercator Stup", address="Stupska 1, Sarajevo", latitude=43.8498, longitude=18.3341),
        models.MarketBranch(market_id=3, name="Mercator Grbavica", address="Vrbanja 1, Sarajevo", latitude=43.8491, longitude=18.3887),
        models.MarketBranch(market_id=4, name="Amko Vogošća", address="Kralja Tvrtka 55, Vogošća", latitude=43.9025, longitude=18.3492),
        models.MarketBranch(market_id=4, name="Amko Hrasno", address="Hrasnička cesta 15, Sarajevo", latitude=43.8217, longitude=18.3254),
    ]
    db.add_all(branches)

    products = [
        models.Product(name="Mlijeko 1L", description="Svježe punomasno mlijeko", category="Mliječni proizvodi", unit="kom", image_url="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400"),
        models.Product(name="Hljeb bijeli", description="Svježe pečen hljeb", category="Pekara", unit="kom", image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"),
        models.Product(name="Jaja M", description="10 komada, domaća jaja", category="Mliječni proizvodi", unit="pak", image_url="https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400"),
        models.Product(name="Jabuke", description="Crvene jabuke, kg", category="Voće", unit="kg", image_url="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"),
        models.Product(name="Banane", description="Zrele banane, kg", category="Voće", unit="kg", image_url="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400"),
        models.Product(name="Pileći file", description="Svježi pileći file, kg", category="Meso", unit="kg", image_url="https://images.unsplash.com/photo-1604503468506-a8da45d7800b?w=400"),
        models.Product(name="Riža 1kg", description="Dugog zrna riža", category="Osnovne namirnice", unit="kom", image_url="https://images.unsplash.com/photo-1586201375766-838a02e3180a?w=400"),
        models.Product(name="Tjestenina 500g", description="Špageti tjestenina", category="Osnovne namirnice", unit="kom", image_url="https://images.unsplash.com/photo-1551462147-ff29053b360c?w=400"),
        models.Product(name="Kafa 200g", description="Mljevena kafa", category="Piće", unit="kom", image_url="https://images.unsplash.com/photo-1559056199-641a0ac8b55c?w=400"),
        models.Product(name="Jogurt 500g", description="Prirodni jogurt", category="Mliječni proizvodi", unit="kom", image_url="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400"),
        models.Product(name="Sir Gauda", description="Blagi sir, kg", category="Mliječni proizvodi", unit="kg", image_url="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400"),
        models.Product(name="Paradajz", description="Svježi paradajz, kg", category="Povrće", unit="kg", image_url="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400"),
        models.Product(name="Krompir", description="Mladi krompir, kg", category="Povrće", unit="kg", image_url="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"),
        models.Product(name="Maslinovo ulje", description="Extra virgin 1L", category="Osnovne namirnice", unit="kom", image_url="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"),
        models.Product(name="Šećer 1kg", description="Bijeli kristal šećer", category="Osnovne namirnice", unit="kom", image_url="https://images.unsplash.com/photo-1581441363687-1e3b3b5d1f8a?w=400"),
    ]
    db.add_all(products)
    db.flush()

    # Prices vary per market; some items on sale
    price_data = [
        (1, 1, 2.10, None, False), (1, 2, 2.05, 1.79, True), (1, 3, 2.20, None, False), (1, 4, 1.95, None, False),
        (2, 1, 1.20, None, False), (2, 2, 1.15, None, False), (2, 3, 1.30, 0.99, True), (2, 4, 1.10, None, False),
        (3, 1, 3.50, None, False), (3, 2, 3.40, 2.99, True), (3, 3, 3.60, None, False), (3, 4, 3.30, None, False),
        (4, 1, 2.80, None, False), (4, 2, 2.60, None, False), (4, 3, 2.90, 2.49, True), (4, 4, 2.50, None, False),
        (5, 1, 2.40, None, False), (5, 2, 2.20, 1.99, True), (5, 3, 2.50, None, False), (5, 4, 2.10, None, False),
        (6, 1, 9.90, None, False), (6, 2, 10.50, 8.99, True), (6, 3, 9.50, None, False), (6, 4, 9.20, None, False),
        (7, 1, 2.30, None, False), (7, 2, 2.10, None, False), (7, 3, 2.40, 1.89, True), (7, 4, 2.00, None, False),
        (8, 1, 1.80, None, False), (8, 2, 1.70, None, False), (8, 3, 1.90, None, False), (8, 4, 1.60, 1.39, True),
        (9, 1, 5.50, None, False), (9, 2, 5.20, 4.79, True), (9, 3, 5.80, None, False), (9, 4, 5.00, None, False),
        (10, 1, 1.40, None, False), (10, 2, 1.35, None, False), (10, 3, 1.50, None, False), (10, 4, 1.25, 0.99, True),
        (11, 1, 12.00, None, False), (11, 2, 11.50, 9.99, True), (11, 3, 12.50, None, False), (11, 4, 11.00, None, False),
        (12, 1, 3.20, None, False), (12, 2, 2.90, None, False), (12, 3, 3.40, 2.69, True), (12, 4, 2.80, None, False),
        (13, 1, 1.50, None, False), (13, 2, 1.40, 1.19, True), (13, 3, 1.60, None, False), (13, 4, 1.30, None, False),
        (14, 1, 14.50, None, False), (14, 2, 13.90, 12.50, True), (14, 3, 15.00, None, False), (14, 4, 13.50, None, False),
        (15, 1, 1.90, None, False), (15, 2, 1.80, None, False), (15, 3, 2.00, None, False), (15, 4, 1.70, 1.49, True),
    ]

    prices = [
        models.ProductPrice(
            product_id=product_id,
            market_id=market_id,
            price=price,
            sale_price=sale,
            on_sale=on_sale,
        )
        for product_id, market_id, price, sale, on_sale in price_data
    ]
    db.add_all(prices)

    demo_user = models.User(
        email="demo@grocery.ba",
        name="Demo Korisnik",
        password_hash=hash_password("demo123"),
    )
    db.add(demo_user)
    db.commit()


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    print("Database seeded successfully.")
