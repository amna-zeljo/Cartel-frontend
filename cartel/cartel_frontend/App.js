import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { CartProvider, useCart } from './src/context/CartContext';
import { ShoppingProvider } from './src/context/ShoppingContext';
import CartScreen from './src/screens/CartScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProductViewScreen from './src/screens/ProductViewScreen';
import ChooseMarketScreen from './src/screens/ChooseMarketScreen';

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

function pathToScreen(pathname) {
  if (pathname === '/product') {
    return 'product';
  }

  if (pathname === '/chooseMarket') {
    return 'chooseMarket';
  }

  return 'cart';
}

function screenToPath(screen) {
  if (screen === 'product') {
    return '/product';
  }

  if (screen === 'chooseMarket') {
    return '/chooseMarket';
  }

  return '/';
}

export default function App() {
  const [screen, setScreen] = useState(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return 'cart';
    }

    return pathToScreen(window.location.pathname);
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }

    const handlePopState = () => {
      setScreen(pathToScreen(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateTo = (nextScreen) => {
    setScreen(nextScreen);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const nextPath = screenToPath(nextScreen);

      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
    }
  };

  const renderScreen = () => {
    if (screen === 'product') {
      return (
        <ProductViewScreen
          onBack={() => navigateTo('cart')}
          onChooseMarket={() => navigateTo('chooseMarket')}
        />
      );
    }

    if (screen === 'chooseMarket') {
      return (
        <ChooseMarketScreen
          onBack={() => navigateTo('product')}
          onSelectMarket={() => navigateTo('cart')}
        />
      );
    }

    return (
      <CartScreen
        onPlaceOrder={() => navigateTo('chooseMarket')}
        onContinueShopping={() => navigateTo('product')}
      />
    );
  };

  return (
    <CartProvider>
      <AppContent />
      <ShoppingProvider>{renderScreen()}</ShoppingProvider>
    </CartProvider>
  );
}