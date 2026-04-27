import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { CartProvider } from './src/context/CartContext';
import { ShoppingProvider } from './src/context/ShoppingContext';
import CartScreen from './src/screens/CartScreen';
import ProductViewScreen from './src/screens/ProductViewScreen';
import ChooseMarketScreen from './src/screens/ChooseMarketScreen';

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
      <ShoppingProvider>{renderScreen()}</ShoppingProvider>
    </CartProvider>
  );
}
