"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem, Product } from "@/types";
import { useI18n } from "@/components/layout/locale-provider";

type AddOptions = { quantity?: number; optionName?: string; optionValue?: string; color?: string; openDrawer?: boolean };
type ShopStore = {
  items: CartItem[];
  wishlist: string[];
  cartCount: number;
  subtotal: number;
  drawerOpen: boolean;
  addItem: (product: Product, options?: AddOptions) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setDrawerOpen: (open: boolean) => void;
  notify: (message: string) => void;
};

const StoreContext = createContext<ShopStore | null>(null);
const CART_KEY = "joshop:cart:v2";
const WISHLIST_KEY = "joshop:wishlist:v2";

function safeReadArray(key: string): unknown[] {
  try {
    const value = window.localStorage.getItem(key);
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readCart() {
  return safeReadArray(CART_KEY).filter((value): value is CartItem => {
    if (!value || typeof value !== "object") return false;
    const item = value as Partial<CartItem>;
    return typeof item.key === "string" && typeof item.productId === "string" && typeof item.slug === "string" && typeof item.name === "string" && typeof item.price === "number" && typeof item.quantity === "number" && typeof item.stock === "number";
  });
}

function readWishlist() {
  return [...new Set(safeReadArray(WISHLIST_KEY).filter((value): value is string => typeof value === "string" && value.length > 0))];
}

function safeWrite(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // State still works for this session if browser storage is unavailable.
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setItems(readCart());
      setWishlist(readWishlist());
      hydrated.current = true;
    });
    const syncStorage = (event: StorageEvent) => {
      if (event.key === CART_KEY) setItems(readCart());
      if (event.key === WISHLIST_KEY) setWishlist(readWishlist());
    };
    window.addEventListener("storage", syncStorage);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("storage", syncStorage); };
  }, []);

  useEffect(() => {
    if (hydrated.current) safeWrite(CART_KEY, items);
  }, [items]);

  useEffect(() => {
    if (hydrated.current) safeWrite(WISHLIST_KEY, wishlist);
  }, [wishlist]);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }, []);

  const addItem = useCallback((product: Product, options: AddOptions = {}) => {
    const quantity = Math.max(1, Math.min(options.quantity ?? 1, 10));
    const key = [product.id, options.color, options.optionValue].filter(Boolean).join(":");
    setItems((current) => {
      const source = hydrated.current ? current : readCart();
      const existing = source.find((item) => item.key === key);
      const next = existing ? source.map((item) => item.key === key ? { ...item, quantity: Math.min(item.quantity + quantity, 10, item.stock) } : item) : [...source, {
        key,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? "",
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        quantity,
        stock: product.stock,
        optionName: options.optionName,
        optionValue: options.optionValue,
        color: options.color,
      }];
      safeWrite(CART_KEY, next);
      return next;
    });
    if (options.openDrawer !== false) setDrawerOpen(true);
    notify(`${product.name} — ${t("product.added")}`);
  }, [notify, t]);

  const removeItem = useCallback((key: string) => setItems((current) => current.filter((item) => item.key !== key)), []);
  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) => current.map((item) => item.key === key ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock, 10)) } : item));
  }, []);
  const clearCart = useCallback(() => { safeWrite(CART_KEY, []); setItems([]); }, []);
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((current) => {
      const source = hydrated.current ? current : readWishlist();
      const next = source.includes(productId) ? source.filter((id) => id !== productId) : [...source, productId];
      safeWrite(WISHLIST_KEY, next);
      return next;
    });
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const value = useMemo(() => ({
    items, wishlist, cartCount, subtotal, drawerOpen, addItem, removeItem, updateQuantity, clearCart,
    toggleWishlist, setDrawerOpen, notify,
  }), [items, wishlist, cartCount, subtotal, drawerOpen, addItem, removeItem, updateQuantity, clearCart, toggleWishlist, notify]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed bottom-5 left-1/2 z-[100] -translate-x-1/2">
        {toast ? <div className="rounded-md bg-[#0a0a0a] px-5 py-3 text-sm font-bold text-white shadow-2xl">{toast}</div> : null}
      </div>
    </StoreContext.Provider>
  );
}

export function useShopStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useShopStore must be used within StoreProvider");
  return context;
}
