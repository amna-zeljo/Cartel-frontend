import React, { createContext, useContext, useReducer } from 'react';
import { initialCart } from '../data/mockCart';

const CartContext = createContext();

const ACTIONS = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  REMOVE: 'remove',
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INCREASE: {
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    case ACTIONS.DECREASE: {
      return state
        .map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((i) => i.quantity > 0);
    }
    case ACTIONS.REMOVE: {
      return state.filter((i) => i.id !== action.payload);
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  const increase = (id) => dispatch({ type: ACTIONS.INCREASE, payload: id });
  const decrease = (id) => dispatch({ type: ACTIONS.DECREASE, payload: id });
  const remove = (id) => dispatch({ type: ACTIONS.REMOVE, payload: id });

  const total = cart.reduce((s, item) => s + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, increase, decrease, remove, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
