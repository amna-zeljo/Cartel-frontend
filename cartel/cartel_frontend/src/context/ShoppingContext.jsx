import React, { createContext, useContext, useMemo } from 'react';
import { mockProduct } from '../data/mockProduct';
import { marketAdjustments } from '../data/mockMarkets';

const ShoppingContext = createContext();

export function ShoppingProvider({ children }) {
  const product = useMemo(() => mockProduct, []);

  const cheapestProductMarket = useMemo(() => {
    return product.prices.reduce((min, item) => (item.price < min.price ? item : min), product.prices[0]);
  }, [product]);

  const value = useMemo(
    () => ({
      product,
      marketAdjustments,
      cheapestProductMarket,
    }),
    [product, cheapestProductMarket]
  );

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
}

export function useShopping() {
  const context = useContext(ShoppingContext);

  if (!context) {
    throw new Error('useShopping must be used within ShoppingProvider');
  }

  return context;
}
