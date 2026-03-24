import type { Cart, CartItem } from "@/shared/types";

const CART_STORAGE_KEY = "agrihub_cart_v1";

const emptyCart: Cart = { farmerId: null, items: [] };

export const readCart = (): Cart => {
  if (typeof window === "undefined") return emptyCart;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return emptyCart;
    const parsed = JSON.parse(raw) as Cart;
    return parsed?.items ? parsed : emptyCart;
  } catch {
    return emptyCart;
  }
};

export const writeCart = (cart: Cart) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const clearCart = () => writeCart(emptyCart);

export const addToCart = (
  item: CartItem,
): { cart: Cart; replacedDifferentSeller: boolean } => {
  const current = readCart();
  const hasDifferentSeller =
    current.farmerId !== null && current.farmerId !== item.farmerId && current.items.length > 0;

  const baseCart: Cart = hasDifferentSeller
    ? { farmerId: item.farmerId, items: [] }
    : { farmerId: current.farmerId ?? item.farmerId, items: [...current.items] };

  const existing = baseCart.items.find((entry) => entry.listingId === item.listingId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + item.quantity, existing.availableQuantity);
  } else {
    baseCart.items.push({ ...item, quantity: Math.min(item.quantity, item.availableQuantity) });
  }

  writeCart(baseCart);
  return { cart: baseCart, replacedDifferentSeller: hasDifferentSeller };
};

export const removeFromCart = (listingId: string) => {
  const current = readCart();
  const items = current.items.filter((item) => item.listingId !== listingId);
  const next: Cart = { farmerId: items.length ? current.farmerId : null, items };
  writeCart(next);
  return next;
};
