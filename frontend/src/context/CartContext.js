import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext(null);
const CART_KEY = "grocery_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_KEY);
        if (stored) setItems(JSON.parse(stored));
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          unit: product.unit,
          image_url: product.image_url,
          lowest_price: product.lowest_price,
          qty,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product_id === productId ? { ...item, qty } : item))
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      totalItems,
    }),
    [items, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
