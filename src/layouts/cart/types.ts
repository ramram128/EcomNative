import { CartItem } from '../../store/shopStore';

export interface CartLayoutProps {
  cart: CartItem[];
  cartTotal: number;
  setQty: (productId: number, qty: number, variationId?: number) => void;
  removeFromCart: (productId: number, variationId?: number, key?: string) => void;
  clearCart: () => void;
  isAuthenticated: boolean;
  onCheckout: () => void;
  isLoading: boolean;
  appliedCoupon: any | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}
