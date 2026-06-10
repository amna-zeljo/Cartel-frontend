from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2)
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class MarketOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    color: str

    class Config:
        from_attributes = True


class MarketBranchOut(BaseModel):
    id: int
    market_id: int
    name: str
    address: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = True


class ProductPriceOut(BaseModel):
    market_id: int
    market_name: str
    price: float
    sale_price: Optional[float] = None
    on_sale: bool
    effective_price: float

    class Config:
        from_attributes = True


class ProductListItem(BaseModel):
    id: int
    name: str
    category: str
    unit: str
    image_url: Optional[str] = None
    lowest_price: float
    on_sale: bool

    class Config:
        from_attributes = True


class ProductDetail(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: str
    unit: str
    image_url: Optional[str] = None
    prices: list[ProductPriceOut]
    lowest_price: float

    class Config:
        from_attributes = True


class CartItemIn(BaseModel):
    product_id: int
    qty: int = Field(ge=1)


class MarketTotalOut(BaseModel):
    market_id: int
    market_name: str
    total: float
    available_items: int
    missing_products: list[str]
    is_complete: bool
    is_cheapest: bool = False


class OrderCalculation(BaseModel):
    per_market: list[MarketTotalOut]
    cheapest_per_product_total: float
    cheapest_single_market: MarketTotalOut
    max_savings: float


class OrderItemOut(BaseModel):
    product_id: int
    product_name: str
    qty: int
    unit_price: float

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    market_id: int
    items: list[CartItemIn]


class OrderOut(BaseModel):
    id: int
    market_id: int
    market_name: str
    total: float
    cheapest_per_product_total: float
    cheapest_single_market_total: float
    savings: float
    created_at: datetime
    items: list[OrderItemOut]

    class Config:
        from_attributes = True


class SavingsSummary(BaseModel):
    total_savings: float
    purchase_count: int
    message: str
