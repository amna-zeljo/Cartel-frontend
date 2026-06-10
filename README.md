# Grocery Order App

A full-stack grocery ordering application where users can search products across multiple supermarkets, compare prices, build a cart, choose the best market for their order, and track savings over time.

The frontend is a **React Native** app built with **Expo** (works on web, iOS, and Android). The backend is a **Python FastAPI** REST API backed by **SQLite**, with dummy data seeded automatically on first startup.

---

## Table of Contents

- [What the app does](#what-the-app-does)
- [Screens & user flow](#screens--user-flow)
- [How savings are calculated](#how-savings-are-calculated)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Running on web](#running-on-web)
- [Running on a phone (Expo Go)](#running-on-a-phone-expo-go)
- [Demo account](#demo-account)
- [API reference](#api-reference)
- [Database](#database)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## What the app does

Users can:

1. **Register / log in** — accounts are stored in the backend so order history syncs across sessions.
2. **Search products and markets** — browse groceries or filter products by a specific supermarket.
3. **View product details** — see prices at every market, including sale prices.
4. **Manage a cart** — add items, change quantities, remove products (cart is saved locally on the device).
5. **Compare markets at checkout** — see the total cost at each supermarket and which single market is cheapest.
6. **Place an order** — confirm a market and save the order to the database.
7. **View store locations** — interactive map on mobile, OpenStreetMap embed on web.
8. **Track savings** — home screen shows total savings across all past orders.

---

## Screens & user flow

```
Login / Register
       │
       ▼
┌──────────────────────────────────────────┐
│  Main app (bottom tabs)                  │
│                                          │
│  🏠 Početna    🔍 Pretraga    🛒 Korpa   │
│  (history &    (search         (cart &   │
│   savings)      products &      checkout)│
│                 markets)                 │
└──────────────────────────────────────────┘
       │                    │
       │ tap product        │ tap "Naruči"
       ▼                    ▼
  Product Details      Choose Market
  (prices per          (compare totals,
   market)              pick supermarket)
                            │
                            ▼
                       Map (store branches)
```

### 1. Login / Register
- Email + password authentication.
- JWT token stored in AsyncStorage for persistent sessions.
- Demo credentials are pre-filled on the login screen.

### 2. Pretraga (Search)
Two tabs:
- **Proizvodi** — search groceries by name or category. Shows lowest available price and sale badges.
- **Marketi** — browse supermarkets. Tapping a market filters product search to that store only.

### 3. Product Details
- Product image, description, category, and unit.
- Price list for every market (regular price, sale price, effective price).
- "Dodaj u korpu" adds the item to the local cart.

### 4. Korpa (Cart)
- List of cart items with quantity controls (+/−).
- Remove individual items.
- Estimated total using the cheapest price per product.
- "Naruči" proceeds to market selection.

### 5. Choose Market
- Backend calculates the total at **each** supermarket for the current cart.
- Highlights the cheapest single-market option.
- Shows which products are missing at each store.
- Displays maximum possible savings vs. buying each item at its individually cheapest price.
- "Potvrdi narudžbu" saves the order.

### 6. Map (Lokacije)
- **Mobile:** native map (`react-native-maps`) with pins for each store branch.
- **Web:** OpenStreetMap embed with links to open locations in Google Maps.
- Branch list with addresses shown below the map.

### 7. Početna (Home)
- Savings summary: *"You have saved X KM with the last Y purchases."*
- Order history with market name, date, total, and per-order savings.
- Logout button.

---

## How savings are calculated

For each order the backend computes:

| Value | Meaning |
|---|---|
| **Cheapest per product total** | Sum of (lowest price for each cart item × quantity), possibly across different markets |
| **Cheapest single market total** | Lowest total if everything is bought from one supermarket |
| **Order savings** | `cheapest_per_product_total − actual_order_total` |

**Example:** If milk is cheapest at Konzum (1.79 KM) and bread is cheapest at Amko (1.10 KM), the per-product total is 2.89 KM. If you order everything from Bingo for 3.30 KM, your savings for that order is 0.41 KM.

The home screen aggregates savings across all completed orders.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React Native 0.81, Expo 54, React Navigation 7 |
| Local storage | AsyncStorage (auth token, cart) |
| Maps (mobile) | react-native-maps |
| Maps (web) | OpenStreetMap embed |
| Backend | FastAPI, SQLAlchemy, SQLite |
| Auth | JWT (python-jose) + bcrypt password hashing |
| API docs | Swagger UI at `/docs` |

---

## Project structure

```
OrderApp/
├── README.md
├── backend/
│   ├── main.py           # FastAPI app & routes
│   ├── models.py         # SQLAlchemy database models
│   ├── schemas.py        # Pydantic request/response models
│   ├── crud.py           # Database queries & business logic
│   ├── auth.py           # JWT & password utilities
│   ├── database.py       # SQLite connection
│   ├── seed_data.py      # Dummy data (runs on startup)
│   ├── requirements.txt
│   ├── start.bat         # Quick start script (Windows)
│   └── grocery.db        # SQLite database (auto-created)
│
└── frontend/
    ├── App.js
    ├── app.json
    ├── package.json
    ├── config/
    │   ├── colors.js
    │   └── styles.js
    └── src/
        ├── api/client.js         # HTTP client for backend
        ├── config/backend.js     # Auto-detects backend URL
        ├── context/
        │   ├── AuthContext.js    # Login state & token
        │   └── CartContext.js    # Cart state (AsyncStorage)
        ├── navigation/
        │   └── AppNavigator.js   # Auth stack + tabs + modals
        ├── screens/
        │   ├── LoginScreen.js
        │   ├── RegisterScreen.js
        │   ├── HomeScreen.js
        │   ├── SearchScreen.js
        │   ├── ProductDetailsScreen.js
        │   ├── CartScreen.js
        │   ├── ChooseMarketScreen.js
        │   ├── MapScreen.native.js   # Mobile map
        │   └── MapScreen.web.js      # Web map
        ├── components/
        └── hooks/
```

---

## Getting started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Expo Go** app on your phone (for mobile testing)

### 1. Backend setup

```powershell
cd OrderApp\backend

# Create virtual environment (first time only)
python -m venv .venv

# Activate & install dependencies
.\.venv\Scripts\pip install -r requirements.txt

# Start the API (listens on all interfaces for phone access)
.\start.bat
```

The API runs at **http://localhost:8000**. Interactive docs: **http://localhost:8000/docs**.

On first start, `grocery.db` is created and populated with markets, products, prices, and a demo user.

### 2. Frontend setup

```powershell
cd OrderApp\frontend

# Install dependencies (first time only)
npm install

# Start Expo
npx expo start
```

---

## Running on web

With the backend running, open a second terminal:

```powershell
cd OrderApp\frontend
npm run web
```

The app opens in your browser. The backend URL defaults to `http://localhost:8000`.

---

## Running on a phone (Expo Go)

Both your PC and phone must be on the **same Wi-Fi network**.

### Step 1 — Start the backend

```powershell
cd OrderApp\backend
.\start.bat
```

`start.bat` binds to `0.0.0.0:8000` so your phone can reach it over the network.

### Step 2 — Start Expo

```powershell
cd OrderApp\frontend
npx expo start
```

This uses `--lan` mode so the QR code points to your PC's local IP.

### Step 3 — Scan the QR code

- **Android:** open Expo Go → scan QR code from the terminal.
- **iOS:** open the Camera app → scan QR code → open in Expo Go.

### Step 4 — Verify the connection

In the Metro terminal you should see:

```
[Grocery App] Backend URL: http://192.168.x.x:8000
```

The app auto-detects your PC's LAN IP from Expo's dev server — no manual configuration needed in most cases.

### Finding your PC's LAN IP

```powershell
ipconfig
```

Look for **IPv4 Address** under your **Wi-Fi** adapter (e.g. `192.168.0.34`).

### Manual backend URL override

If auto-detection fails, set your IP in `frontend/app.json`:

```json
"extra": {
  "backendUrl": "http://192.168.0.34:8000"
}
```

### Important notes for phone testing

| Do | Don't |
|---|---|
| Use `npx expo start` (LAN mode) | Use `--tunnel` — it only tunnels the JS bundle, not the Python API |
| Run backend with `--host 0.0.0.0` | Bind backend to `127.0.0.1` only |
| Keep phone and PC on same Wi-Fi | Expect it to work over mobile data |
| Allow port 8000 through Windows Firewall if prompted | — |

Test the backend from your phone's browser: `http://YOUR_PC_IP:8000` — you should see a JSON response.

---

## Demo account

| Field | Value |
|---|---|
| Email | `demo@grocery.ba` |
| Password | `demo123` |

### Seeded data

| Data | Count |
|---|---|
| Markets | 4 (Bingo, Konzum, Mercator, Amko) |
| Store branches | 8 (Sarajevo area) |
| Products | 15 groceries |
| Product prices | Different per market, some on sale |

To reset the database, delete `backend/grocery.db` and restart the backend.

---

## API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Create account |
| `POST` | `/auth/login-json` | — | Login (JSON body) |
| `POST` | `/auth/login` | — | Login (form-urlencoded) |
| `GET` | `/auth/me` | ✓ | Current user |
| `GET` | `/markets` | — | List markets (`?search=`) |
| `GET` | `/markets/{id}` | — | Market details |
| `GET` | `/markets/{id}/branches` | — | Store locations |
| `GET` | `/products` | — | Search products (`?search=&market_id=`) |
| `GET` | `/products/{id}` | — | Product with all market prices |
| `POST` | `/orders/calculate` | — | Compare cart totals per market |
| `POST` | `/orders` | ✓ | Place order |
| `GET` | `/orders/history` | ✓ | User's past orders |
| `GET` | `/orders/savings` | ✓ | Aggregated savings summary |

Authenticated requests require the header:

```
Authorization: Bearer <token>
```

Full interactive documentation: **http://localhost:8000/docs**

---

## Database

SQLite file: `backend/grocery.db`

| Table | Purpose |
|---|---|
| `users` | Accounts (email, hashed password) |
| `markets` | Supermarket chains |
| `market_branches` | Physical store locations with GPS coordinates |
| `products` | Grocery items |
| `product_prices` | Price per product per market (with optional sale price) |
| `orders` | Completed orders with savings metadata |
| `order_items` | Line items within each order |

The cart is **not** stored server-side — it lives in AsyncStorage on the device for offline persistence.

---

## Configuration

| File | Purpose |
|---|---|
| `frontend/src/config/backend.js` | Auto-detects backend URL per platform |
| `frontend/app.json` → `extra.backendUrl` | Manual backend URL override |
| `backend/database.py` | SQLite connection string |
| `backend/auth.py` | JWT secret key (`GROCERY_SECRET_KEY` env var) |

---

## Troubleshooting

### "Network request failed" on phone
- Backend must run with `--host 0.0.0.0`.
- Phone and PC must be on the same Wi-Fi.
- Check Windows Firewall allows Python on port 8000.
- Verify in phone browser: `http://YOUR_PC_IP:8000`.

### Web build fails with `react-native-maps` error
- The map screen uses platform-specific files (`MapScreen.web.js` / `MapScreen.native.js`). Web never imports `react-native-maps`.

### Login fails with "Invalid email or password"
- Use demo credentials: `demo@grocery.ba` / `demo123`.
- If you deleted `grocery.db`, restart the backend to re-seed.

### Products show no images
- Images load from Unsplash URLs and require an internet connection.

### Backend won't start — port in use
```powershell
# Find and stop the process using port 8000
netstat -ano | findstr :8000
```

---

## Development commands (quick reference)

```powershell
# Backend
cd OrderApp\backend
.\start.bat

# Frontend — all platforms
cd OrderApp\frontend
npx expo start

# Frontend — web only
npm run web

# Frontend — Android emulator
npm run android

# Reset database
del OrderApp\backend\grocery.db
# then restart backend
```
