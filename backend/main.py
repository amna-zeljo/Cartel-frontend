from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import crud
import models
import schemas
from auth import create_access_token, get_current_user
from database import get_db
from seed_data import init_db

init_db()

app = FastAPI(title="Grocery Order App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Grocery Order App API", "docs": "/docs"}


@app.post("/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = crud.create_user(db, user)
    token = create_access_token(db_user.id)
    return schemas.Token(access_token=token, user=db_user)


@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user.id)
    return schemas.Token(access_token=token, user=user)


@app.post("/auth/login-json", response_model=schemas.Token)
def login_json(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user.id)
    return schemas.Token(access_token=token, user=user)


@app.get("/auth/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.get("/markets", response_model=list[schemas.MarketOut])
def list_markets(search: str | None = None, db: Session = Depends(get_db)):
    return crud.get_markets(db, search)


@app.get("/markets/{market_id}", response_model=schemas.MarketOut)
def get_market(market_id: int, db: Session = Depends(get_db)):
    market = crud.get_market(db, market_id)
    if not market:
        raise HTTPException(status_code=404, detail="Market not found")
    return market


@app.get("/markets/{market_id}/branches", response_model=list[schemas.MarketBranchOut])
def list_market_branches(market_id: int, db: Session = Depends(get_db)):
    if not crud.get_market(db, market_id):
        raise HTTPException(status_code=404, detail="Market not found")
    return crud.get_market_branches(db, market_id)


@app.get("/products", response_model=list[schemas.ProductListItem])
def list_products(
    search: str | None = None,
    market_id: int | None = None,
    db: Session = Depends(get_db),
):
    return crud.search_products(db, search, market_id)


@app.get("/products/{product_id}", response_model=schemas.ProductDetail)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product_detail(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/orders/calculate", response_model=schemas.OrderCalculation)
def calculate_order(items: list[schemas.CartItemIn], db: Session = Depends(get_db)):
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    return crud.calculate_order(db, items)


@app.post("/orders", response_model=schemas.OrderOut)
def place_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not order.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    try:
        db_order = crud.create_order(db, current_user.id, order)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return crud.order_to_schema(db_order)


@app.get("/orders/history", response_model=list[schemas.OrderOut])
def order_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    orders = crud.get_user_orders(db, current_user.id)
    return [crud.order_to_schema(order) for order in orders]


@app.get("/orders/savings", response_model=schemas.SavingsSummary)
def savings_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_savings_summary(db, current_user.id)
