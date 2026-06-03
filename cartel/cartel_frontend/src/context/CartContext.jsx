import React, { createContext, useContext, useReducer } from 'react';
import { initialCart } from '../data/mockCart';

const CartContext = createContext();

const ACTIONS = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  REMOVE: 'remove',
  PLACE_ORDER: 'place_order',
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INCREASE: {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    case ACTIONS.DECREASE: {
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: Math.max(0, item.quantity - 1) }
              : item
          )
          .filter((i) => i.quantity > 0),
      };
    }
    case ACTIONS.REMOVE: {
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.payload),
      };
    }
    case ACTIONS.PLACE_ORDER: {
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        cart: [],
      };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: initialCart,
    orders: [],
  });

  const increase = (id) => dispatch({ type: ACTIONS.INCREASE, payload: id });
  const decrease = (id) => dispatch({ type: ACTIONS.DECREASE, payload: id });
  const remove = (id) => dispatch({ type: ACTIONS.REMOVE, payload: id });

  const placeOrder = (selectedMarket = 'Market A') => {
    if (state.cart.length === 0) {
      return null;
    }

    const items = state.cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Mock savings: with no real market comparison data, use a simple 10% estimate.
    const savings = totalAmount * 0.1;
    const order = {
      id: `ORD-${Date.now()}`,
      items,
      totalAmount,
      selectedMarket,
      savings,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: ACTIONS.PLACE_ORDER, payload: order });
    return order;
  };

  const cart = state.cart;
  const orders = state.orders;
  const total = cart.reduce((s, item) => s + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, orders, increase, decrease, remove, placeOrder, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
