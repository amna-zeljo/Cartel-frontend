import React from 'react';
import { CartProvider } from './src/context/CartContext';
import CartScreen from './src/screens/CartScreen';

export default function App() {
  return (
    <CartProvider>
      <CartScreen />
    </CartProvider>
  );
}
