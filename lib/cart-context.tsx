"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type {
  AccessoryCartItem,
  Cart,
  CartItem,
  ConfiguredCartItem,
} from "@/lib/cart-types";
import { getCartItemCount, getCartTotal } from "@/lib/cart-types";

const STORAGE_KEY = "festivemotion-cart";
const CART_VERSION = 1;

// --- Actions ---

type CartAction =
  | { type: "ADD_CONFIGURED"; item: Omit<ConfiguredCartItem, "id" | "kind" | "quantity"> }
  | { type: "ADD_ACCESSORY"; item: Omit<AccessoryCartItem, "id" | "kind"> }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; items: CartItem[] };

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_CONFIGURED":
      return [
        ...items,
        { ...action.item, kind: "configured", id: generateId(), quantity: 1 },
      ];

    case "ADD_ACCESSORY": {
      const existing = items.find(
        (i) => i.kind === "accessory" && i.accessorySlug === action.item.accessorySlug,
      ) as AccessoryCartItem | undefined;

      if (existing) {
        const newQty = Math.min(existing.quantity + action.item.quantity, 10);
        return items.map((i) =>
          i.id === existing.id ? { ...existing, quantity: newQty } : i,
        );
      }

      return [
        ...items,
        { ...action.item, kind: "accessory", id: generateId() },
      ];
    }

    case "REMOVE_ITEM":
      return items.filter((i) => i.id !== action.id);

    case "UPDATE_QUANTITY":
      return items
        .map((i) => {
          if (i.id !== action.id) return i;
          if (i.kind === "configured") return i;
          const quantity = Math.max(0, Math.min(10, action.quantity));
          if (quantity === 0) return null;
          return { ...i, quantity };
        })
        .filter((i): i is CartItem => i !== null);

    case "CLEAR_CART":
      return [];

    case "HYDRATE":
      return action.items;

    default:
      return items;
  }
}

// --- Context ---

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  totalCents: number;
  hydrated: boolean;
  isCartOpen: boolean;
  addConfiguredItem: (item: Omit<ConfiguredCartItem, "id" | "kind" | "quantity">) => void;
  addAccessory: (item: Omit<AccessoryCartItem, "id" | "kind">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Cart;
    if (parsed.version !== CART_VERSION) return [];
    return parsed.items ?? [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    const cart: Cart = { version: CART_VERSION, items };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // localStorage unavailable
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    dispatch({ type: "HYDRATE", items: loadCart() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveCart(items);
    }
  }, [items, hydrated]);

  const addConfiguredItem = useCallback(
    (item: Omit<ConfiguredCartItem, "id" | "kind" | "quantity">) => {
      dispatch({ type: "ADD_CONFIGURED", item });
    },
    [],
  );

  const addAccessory = useCallback(
    (item: Omit<AccessoryCartItem, "id" | "kind">) => {
      dispatch({ type: "ADD_ACCESSORY", item });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", id, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const value: CartContextValue = {
    items,
    itemCount: hydrated ? getCartItemCount(items) : 0,
    totalCents: getCartTotal(items),
    hydrated,
    isCartOpen,
    addConfiguredItem,
    addAccessory,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
  };

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
