"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { readCart, writeCart } from "@/lib/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Le panier vit dans localStorage, indisponible côté serveur : on le
    // charge après le montage pour éviter tout mismatch d'hydratation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCart());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) writeCart(items);
  }, [items, isLoaded]);

  function addItem(productId, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { productId, quantity }];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }

  function removeItem(productId) {
    setItems((current) =>
      current.filter((item) => item.productId !== productId)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider.");
  }
  return context;
}
