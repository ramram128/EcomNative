import React, { createContext, useContext, useMemo, useReducer, useEffect, useCallback, useRef } from 'react';
import type { Product, Variation } from '../types/product';
import { CartService, ProductService } from '../api/wooApi2';

export type CartItem = {
  product: Product;
  qty: number;
  variation?: Variation;
  key?: string; // cart_item_key from API
};

type State = {
  wishlist: Product[];
  cart: CartItem[];
  isLoadingCart: boolean;
  isAuthenticated: boolean;
  user: any; // TODO: define user type
  appliedCoupon: any | null;
};

type Action =
  | { type: 'TOGGLE_WISHLIST'; product: Product }
  | { type: 'REMOVE_WISHLIST'; productId: number }
  | { type: 'SET_CART'; cart: CartItem[] }
  | { type: 'SET_CART_LOADING'; isLoading: boolean }
  | { type: 'ADD_TO_CART_LOCAL'; product: Product; qty?: number; variation?: Variation }
  | { type: 'REMOVE_FROM_CART_LOCAL'; productId: number; variationId?: number }
  | { type: 'SET_QTY_LOCAL'; productId: number; qty: number; variationId?: number }
  | { type: 'CLEAR_CART_LOCAL' }
  | { type: 'SET_AUTH'; isAuthenticated: boolean; user?: any }
  | { type: 'SET_COUPON'; coupon: any | null };

const initialState: State = {
  wishlist: [],
  cart: [],
  isLoadingCart: false,
  isAuthenticated: false,
  user: null,
  appliedCoupon: null,
};

const toNumber = (v: any) => {
  if (v === undefined || v === null) return NaN;
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const getProductPrice = (p: Product) => {
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

    case 'SET_CART':
      return { ...state, cart: action.cart, isLoadingCart: false };

    case 'SET_CART_LOADING':
      return { ...state, isLoadingCart: action.isLoading };

    case 'ADD_TO_CART_LOCAL': {
      const qty = action.qty ?? 1;
      const idx = state.cart.findIndex(
        (c) => c.product.id === action.product.id && c.variation?.id === action.variation?.id
      );
      if (idx >= 0) {
        const updated = [...state.cart];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
        return { ...state, cart: updated };
      }
      return { ...state, cart: [{ product: action.product, qty, variation: action.variation }, ...state.cart] };
    }

    case 'REMOVE_FROM_CART_LOCAL':
      return {
        ...state,
        cart: state.cart.filter(
          (c) => !(c.product.id === action.productId && c.variation?.id === action.variationId)
        ),
      };

    case 'SET_QTY_LOCAL': {
      const updated = state.cart
        .map((c) =>
          c.product.id === action.productId && c.variation?.id === action.variationId
            ? { ...c, qty: action.qty }
            : c
        )
        .filter((c) => c.qty > 0);
      return { ...state, cart: updated };
    }

    case 'CLEAR_CART_LOCAL':
      return { ...state, cart: [] };

    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.isAuthenticated, user: action.user };

    case 'SET_COUPON':
      return { ...state, appliedCoupon: action.coupon };

    default:
      return state;
  }
}

type ShopContextValue = {
  wishlist: Product[];
  cart: CartItem[];
  isLoadingCart: boolean;

  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  removeWishlist: (productId: number) => void;

  fetchCart: () => Promise<void>;
  addToCart: (product: Product, qty?: number, variation?: Variation) => Promise<void>;
  removeFromCart: (productId: number, variationId?: number, key?: string) => Promise<void>;
  setQty: (productId: number, qty: number, variationId?: number) => Promise<void>;
  clearCart: () => Promise<void>;

  cartCount: number;
  cartTotal: number;
  isAuthenticated: boolean;
  user: any;
  setAuth: (isAuthenticated: boolean, user?: any) => void;

  appliedCoupon: any | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  createOrder: (paymentMethod: string, customerDetails: any) => Promise<any>;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Sync cart when user ID is available
  const userId = state.user?.id || state.user?.user_id;

  const cartRef = useRef<CartItem[]>(state.cart);
  useEffect(() => {
    cartRef.current = state.cart;
  }, [state.cart]);

  const fetchCart = useCallback(async () => {
    if (!userId) return;
    dispatch({ type: 'SET_CART_LOADING', isLoading: true });
    try {
      const remoteCart = await CartService.getCart(userId);
      const items = Array.isArray(remoteCart) ? remoteCart : (remoteCart.items || []);

      // NEW: Collect all unique potential parent product IDs
      const productIds: number[] = Array.from(new Set(items.flatMap((item: any) => {
        const prodData = item.product_data || item;
        const pid = Number(item.product_id);
        const vid = Number(item.variation_id);
        const parentIdInProd = Number(prodData.parent_id);
        const candidateIds = [parentIdInProd, pid].filter(id => !isNaN(id) && id > 0);
        if (candidateIds.length === 0) {
          const simpleId = Number(prodData.id || item.product_id);
          if (!isNaN(simpleId) && simpleId > 0) candidateIds.push(simpleId);
        }
        return candidateIds;
      })));

      const fullProducts = productIds.length > 0 
        ? await ProductService.getMultipleProducts(productIds) 
        : [];
      
      const variableParentIds: number[] = Array.from(new Set(items
        .map((item: any) => {
          const prodRaw = item.product_data || item;
          const pid = Number(item.product_id);
          const vid = Number(item.variation_id);
          const parentIdInProd = Number(prodRaw.parent_id);
          const baseId = parentIdInProd > 0 ? parentIdInProd : (pid > 0 ? pid : Number(prodRaw.id));
          const p = fullProducts.find(fp => fp.id === baseId) || prodRaw;
          return p.type === 'variable' ? (baseId as number) : null;
        })
        .filter((id: any): id is number => typeof id === 'number' && id > 0)
      ));

      const variationsMap: Record<number, any[]> = {};
      await Promise.all(variableParentIds.map(async (parentId: number) => {
        try {
          variationsMap[parentId] = await ProductService.getVariations(parentId);
        } catch (e) {
          console.error(`[Enrichment] Failed to fetch variations for ${parentId}:`, e);
        }
      }));
      
      const formattedItems: CartItem[] = items.map((item: any) => {
        const prodData = item.product_data || item;
        const key = item.cart_item_key || item.key;
        const pid = Number(item.product_id);
        const vid = Number(item.variation_id);
        const parentIdInProd = Number(prodData.parent_id);
        
        let baseId = 0;
        if (parentIdInProd > 0) baseId = parentIdInProd;
        else if (pid > 0 && vid > 0) baseId = pid;
        else if (pid > 0) baseId = pid;
        else if (Number(prodData.id) > 0) baseId = Number(prodData.id);

        // Defensive Merge: check if we already have this enriched item locally
        const existingItem = cartRef.current.find(c => c.key === key);

        let fullProduct = fullProducts.find(p => Number(p.id) === baseId);
        if (!fullProduct && existingItem && Number(existingItem.product.id) === baseId) {
          fullProduct = existingItem.product;
        }
        fullProduct = fullProduct || prodData;
        
        let variation = item.variation_data || (item.variation_id ? { id: item.variation_id } : undefined);
        const variationsForProduct = variationsMap[baseId];
        const vidToFind = Number(variation?.id || item.variation_id || existingItem?.variation?.id);

        if (vidToFind > 0 && variationsForProduct) {
           const foundVar = variationsForProduct.find((v: any) => Number(v.id) === vidToFind);
           if (foundVar) variation = foundVar;
        }
        
        if ((!variation || !variation.price) && existingItem && existingItem.variation && Number(existingItem.variation.id) === vidToFind) {
          variation = existingItem.variation;
        }

        return {
          product: { ...fullProduct, id: baseId > 0 ? baseId : (fullProduct?.id || 0) },
          qty: parseInt(item.quantity || item.qty || '1'),
          variation,
          key,
        };
      });

      dispatch({ type: 'SET_CART', cart: formattedItems });
    } catch (err) {
      console.error('Fetch cart failed:', err);
      dispatch({ type: 'SET_CART_LOADING', isLoading: false });
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId, fetchCart]);

  const addToCart = async (product: Product, qty: number = 1, variation?: Variation) => {
    // 1. Optimistic local update
    dispatch({ type: 'ADD_TO_CART_LOCAL', product, qty, variation });

    // 2. Remote sync if logged in
    if (userId) {
      try {
        await CartService.updateCartItem({
          user_id: userId,
          product_id: product.id,
          variation_id: variation?.id,
          quantity: qty, // Add current qty to the cart
        });
        // Success: Potentially re-fetch to ensure sync (optional)
        // await fetchCart();
      } catch (err) {
        console.error('Sync AddToCart failed:', err);
        // Rollback or notify user
        fetchCart(); // Re-fetch from server to correct discrepancy
      }
    }
  };

  // Helper to sync remote cart by clearing and rebuilding it to bypass 
  // backend bugs with deletion and quantity decrementation natively.
  const syncCartWithRebuild = async (expectedCart: CartItem[]) => {
    if (!userId) return;
    try {
      console.log('[DEBUG] Starting cart rebuild sync...');
      await CartService.clearCart(userId);
      for (const item of expectedCart) {
        await CartService.updateCartItem({
          user_id: userId,
          product_id: item.product.id,
          variation_id: item.variation?.id,
          quantity: item.qty,
        });
      }
      console.log('[DEBUG] Cart rebuild sync finished.');
      await fetchCart();
    } catch (err) {
      console.error('Rebuild sync failed:', err);
      fetchCart();
    }
  };

  const removeFromCart = async (productId: number, variationId?: number, key?: string) => {
    console.log('[DEBUG] removeFromCart:', { productId, variationId, key, userId });
    // 1. Optimistic local update
    dispatch({ type: 'REMOVE_FROM_CART_LOCAL', productId, variationId });

    // 2. Remote sync via rebuild strategy
    if (userId) {
      const newCart = state.cart.filter(c => !(c.product.id === productId && c.variation?.id === variationId));
      syncCartWithRebuild(newCart);
    }
  };

  const setQty = async (productId: number, qty: number, variationId?: number) => {
    // 1. Optimistic local update
    dispatch({ type: 'SET_QTY_LOCAL', productId, qty, variationId });

    // 2. Remote sync via rebuild strategy
    if (userId) {
      const newCart = state.cart.map(c => 
        (c.product.id === productId && c.variation?.id === variationId) 
          ? { ...c, qty } 
          : c
      ).filter(c => c.qty > 0);
      syncCartWithRebuild(newCart);
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART_LOCAL' });
    if (userId) {
      try {
        await CartService.clearCart(userId);
      } catch (err) {
        console.error('Sync ClearCart failed:', err);
        fetchCart();
      }
    }
  };

  const value: ShopContextValue = useMemo(() => {
    const cartCount = state.cart.reduce((sum, it) => sum + it.qty, 0);
    const cartTotal = state.cart.reduce((sum, it) => sum + it.qty * getProductPrice(it.product), 0);

    return {
      wishlist: state.wishlist,
      cart: state.cart,
      isLoadingCart: state.isLoadingCart,

      isWishlisted: (id) => state.wishlist.some((p) => p.id === id),
      toggleWishlist: (product) => dispatch({ type: 'TOGGLE_WISHLIST', product }),
      removeWishlist: (productId) => dispatch({ type: 'REMOVE_WISHLIST', productId }),

      fetchCart,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,

      cartCount,
      cartTotal,

      isAuthenticated: state.isAuthenticated,
      user: state.user,
      setAuth: (isAuthenticated, user) => dispatch({ type: 'SET_AUTH', isAuthenticated, user }),

      appliedCoupon: state.appliedCoupon,
      applyCoupon: async (code: string) => {
        try {
          const { CouponService } = require('../api/wooApi2');
          const coupon = await CouponService.getCoupon(code);
          if (coupon) {
            dispatch({ type: 'SET_COUPON', coupon });
            return true;
          }
          return false;
        } catch (err) {
          console.error('Apply coupon failed:', err);
          return false;
        }
      },
      removeCoupon: () => dispatch({ type: 'SET_COUPON', coupon: null }),

      createOrder: async (paymentMethod: string, customerDetails: any) => {
        try {
          const { OrderService } = require('../api/wooApi2');
          
          const line_items = state.cart.map(item => ({
            product_id: item.product.id,
            variation_id: item.variation?.id,
            quantity: item.qty,
          }));

          const coupon_lines = state.appliedCoupon ? [{ code: state.appliedCoupon.code }] : [];

          const orderData = {
            payment_method: paymentMethod,
            payment_method_title: paymentMethod === 'cod' ? 'Cash on delivery' : 'Razorpay',
            set_paid: paymentMethod !== 'cod', // Pay via Razorpay would mark it as paid later or now depending on flow
            customer_id: state.user?.id || 0,
            billing: customerDetails,
            shipping: customerDetails,
            line_items,
            coupon_lines,
          };

          const order = await OrderService.createOrder(orderData);
          if (order && order.id) {
            await clearCart();
            dispatch({ type: 'SET_COUPON', coupon: null });
          }
          return order;
        } catch (err) {
          console.error('Create order failed:', err);
          throw err;
        }
      },
    };
  }, [state, fetchCart, clearCart]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}
