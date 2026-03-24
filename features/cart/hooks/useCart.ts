"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addToCart, clearCart, readCart, removeFromCart } from "@/lib/cart";
import type { CartItem } from "@/shared/types";

export const useCart = () => {
  const [cart, setCart] = useState(() => readCart());

  const refresh = useCallback(() => setCart(readCart()), []);

  useEffect(() => {
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const count = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items],
  );

  const totalInKobo = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.priceInKobo * item.quantity, 0),
    [cart.items],
  );

  return {
    cart,
    count,
    totalInKobo,
    hasItem: (listingId: string) => cart.items.some((item) => item.listingId === listingId),
    addItem: (item: CartItem) => {
      const result = addToCart(item);
      refresh();
      return result;
    },
    removeItem: (listingId: string) => {
      const result = removeFromCart(listingId);
      refresh();
      return result;
    },
    clear: () => {
      clearCart();
      refresh();
    },
  };
};
