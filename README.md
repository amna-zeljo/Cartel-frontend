# 🛒 Cartel – Frontend (React Native)

## 📌 Overview

**Cartel** is a mobile application that allows users to:

* Search for grocery products
* Compare prices across multiple markets
* Add products to a cart
* Choose the most cost-effective market
* View nearby market locations
* Track purchase history and savings

This repository contains the **frontend implementation** built with **React Native (Expo)**.

The app is designed to be:

* 📱 Mobile-first
* 🧠 Easy to use for everyday users
* 💸 Focused on saving money through price comparison

---

## 🎯 Core Features

Based on the project specification, the app includes the following views:

### 🔐 1. Login / Register

* User authentication interface
* Allows account creation and login
* Enables cross-device data access

---

### 🔎 2. Search View

* Search for:

  * Products
  * Markets
* Toggle between:

  * Product search
  * Market search
* Selecting a market filters product results

---

### 📦 3. Product View

* Displays:

  * Product details
  * Image
  * Price comparison across markets
  * Sale/discount information (if available)

---

### 🛒 4. Cart View

* Displays selected products
* Allows:

  * Quantity adjustment (+ / -)
  * Item removal
  * Viewing total price
* Includes:

  * **Place Order**
  * **Continue Shopping**

---

### 🏪 5. Choose Market View

* Shows total cart price per market
* Highlights:

  * Cheapest option
* Allows user to:

  * Select cheapest market
  * Choose a preferred market

---

### 🗺️ 6. Map View (Optional Feature)

* Displays nearby market locations
* Uses map interface
* Helps users locate stores physically

---

### 📊 7. History / Home View

* Shows:

  * Previous orders
  * Savings per order
  * Total savings summary

Example:

> “You have saved X KM across Y purchases”

---

## 🧱 Project Structure

```bash
cartel/
└── cartel_frontend/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── screens/           # App screens (views)
    │   │   ├── LoginScreen.jsx
    │   │   ├── SearchScreen.jsx
    │   │   ├── ProductScreen.jsx
    │   │   ├── CartScreen.jsx
    │   │   ├── MarketScreen.jsx
    │   │   ├── MapScreen.jsx
    │   │   └── HistoryScreen.jsx
    │   ├── navigation/        # Navigation setup
    │   ├── context/           # State management (Cart, Auth)
    │   ├── data/              # Mock data (for development)
    │   ├── theme/             # Colors, spacing, styles
    │   └── utils/             # Helper functions
    ├── App.js
    └── package.json
```

---

## 🎨 UI & Design

The frontend is based on the provided mockups and follows:

* Clean mobile UI
* Card-based layouts
* Rounded corners
* Blue accent color theme
* Simple and readable typography

Design principles:

* Minimalistic
* Functional
* User-friendly
* Fast interaction

---

## ⚙️ Tech Stack

* **React Native**
* **Expo**
* React Hooks (`useState`, `useContext`)
* Context API (for state management)

---

## 🚀 Getting Started

### 1. Navigate to project

```bash
cd cartel
```

### 2. Start the app

```bash
npx expo start
```

### 3. Run on device

* Scan QR code using **Expo Go**

---

## ⚠️ Important Development Rules

### ❗ Do NOT modify dependencies

* Do not change `package.json`
* Do not upgrade/downgrade Expo
* Do not install new libraries without approval

Reason:
This project must remain compatible with **Expo Go QR scanning**

---

## 🧪 Data Handling

Current implementation uses:

* Mock data (for development)

Planned:

* Firebase backend
* API-based product and cart handling

---

## 🔄 State Management

Managed using:

* React Context API

Includes:

* Cart state
* User state (planned)
* Product data (planned)

---

## 🧩 Backend Integration (Planned)

The frontend is designed to integrate with:

* Firebase Authentication
* Firestore database
* Product & Market APIs

Planned features:

* Real-time cart sync
* User-specific data
* Order storage
* Price comparison logic

---

## 📈 Future Improvements

* 🔐 Full authentication flow
* 🔗 API integration
* 🗺️ Enhanced map features
* 📊 Advanced savings analytics
* ⚡ Offline caching
* 🛠️ Admin/product management tools

---

## 📍 Development Workflow

Each feature is developed in its own branch:

Example:

```bash
feature/cart
feature/map
feature/search
```

