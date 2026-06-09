import React, { createContext, useContext, useMemo, useReducer } from 'react';

const CartContext = createContext(null);

const initialCart = [
  { id: 'cart-1', name: 'Whole Milk (1L)', price: 2.49, quantity: 2 },
  { id: 'cart-2', name: 'Sourdough Bread', price: 3.99, quantity: 1 },
  { id: 'cart-3', name: 'Free-range Eggs (12)', price: 4.5, quantity: 1 },
  { id: 'cart-4', name: 'Bananas (1kg)', price: 1.29, quantity: 3 },
];

function cartReducer(state, action) {
  switch (action.type) {
    case 'increase':
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    case 'decrease':
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0),
      };
    case 'remove':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.id),
      };
    case 'placeOrder':
      return {
        cart: [],
        orders: [action.order, ...state.orders],
      };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: initialCart,
    orders: [],
  });

  const value = useMemo(() => {
    const total = state.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

    return {
      cart: state.cart,
      orders: state.orders,
      total,
      itemCount,
      increase: (id) => dispatch({ type: 'increase', id }),
      decrease: (id) => dispatch({ type: 'decrease', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      placeOrder: (selectedMarket = 'Selected market') => {
        if (state.cart.length === 0) {
          return null;
        }

        const order = {
          id: `ORD-${Date.now()}`,
          items: state.cart.map((item) => ({ ...item })),
          totalAmount: total,
          selectedMarket,
          savings: total * 0.1,
          createdAt: new Date().toISOString(),
        };

        dispatch({ type: 'placeOrder', order });
        return order;
      },
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
