import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { Product } from '../types/product';

export type CartItem = {
  product: Product;
  qty: number;
};

type State = {
  wishlist: Product[];
  cart: CartItem[];
};

type Action =
  | { type: 'TOGGLE_WISHLIST'; product: Product }
  | { type: 'REMOVE_WISHLIST'; productId: number }
  | { type: 'ADD_TO_CART'; product: Product; qty?: number }
  | { type: 'REMOVE_FROM_CART'; productId: number }
  | { type: 'SET_QTY'; productId: number; qty: number }
  | { type: 'CLEAR_CART' };

const initialState: State = {
  wishlist: [],
  cart: [],
};

const toNumber = (v: any) => {
  if (v === undefined || v === null) return NaN;
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const getProductPrice = (p: Product) => {
  // Woo product.price is string
  const n = toNumber((p as any)?.price);
  return Number.isFinite(n) ? n : 0;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.some((p) => p.id === action.product.id);
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter((p) => p.id !== action.product.id)
          : [action.product, ...state.wishlist],
      };
    }
    case 'REMOVE_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter((p) => p.id !== action.productId) };

    case 'ADD_TO_CART': {
      const qty = action.qty ?? 1;
      const idx = state.cart.findIndex((c) => c.product.id === action.product.id);
      if (idx >= 0) {
        const updated = [...state.cart];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
        return { ...state, cart: updated };
      }
      return { ...state, cart: [{ product: action.product, qty }, ...state.cart] };
    }

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((c) => c.product.id !== action.productId) };

    case 'SET_QTY': {
      const updated = state.cart
        .map((c) => (c.product.id === action.productId ? { ...c, qty: action.qty } : c))
        .filter((c) => c.qty > 0);
      return { ...state, cart: updated };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    default:
      return state;
  }
}

type ShopContextValue = {
  wishlist: Product[];
  cart: CartItem[];

  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  removeWishlist: (productId: number) => void;

  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  setQty: (productId: number, qty: number) => void;
  clearCart: () => void;

  cartCount: number;
  cartTotal: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: ShopContextValue = useMemo(() => {
    const cartCount = state.cart.reduce((sum, it) => sum + it.qty, 0);
    const cartTotal = state.cart.reduce((sum, it) => sum + it.qty * getProductPrice(it.product), 0);

    return {
      wishlist: state.wishlist,
      cart: state.cart,

      isWishlisted: (id) => state.wishlist.some((p) => p.id === id),
      toggleWishlist: (product) => dispatch({ type: 'TOGGLE_WISHLIST', product }),
      removeWishlist: (productId) => dispatch({ type: 'REMOVE_WISHLIST', productId }),

      addToCart: (product, qty) => dispatch({ type: 'ADD_TO_CART', product, qty }),
      removeFromCart: (productId) => dispatch({ type: 'REMOVE_FROM_CART', productId }),
      setQty: (productId, qty) => dispatch({ type: 'SET_QTY', productId, qty }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),

      cartCount,
      cartTotal,
    };
  }, [state]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}
