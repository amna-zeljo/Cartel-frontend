import React, { useState } from 'react';
import { CartProvider } from './src/context/CartContext';
import { useCart } from './src/context/CartContext';
import CartScreen from './src/screens/CartScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import HistoryScreen from './src/screens/HistoryScreen';

function AppContent() {
  const { placeOrder, orders } = useCart();
  const [currentView, setCurrentView] = useState('cart');
  const [latestOrder, setLatestOrder] = useState(null);

  const handlePlaceOrder = () => {
    const createdOrder = placeOrder('Market A');
    if (!createdOrder) {
      return;
    }
    setLatestOrder(createdOrder);
    setCurrentView('confirmation');
  };

  if (currentView === 'confirmation') {
    return (
      <OrderConfirmationScreen
        order={latestOrder}
        onViewHistory={() => setCurrentView('history')}
        onBackToCart={() => setCurrentView('cart')}
      />
    );
  }

  if (currentView === 'history') {
    return <HistoryScreen orders={orders} onBackToCart={() => setCurrentView('cart')} />;
  }

  return <CartScreen onPlaceOrder={handlePlaceOrder} onViewHistory={() => setCurrentView('history')} />;
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
