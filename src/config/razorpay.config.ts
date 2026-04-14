import { RAZORPAY_KEY_ID } from '@env';

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  description: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
}

/**
 * Builds the options object for RazorpayCheckout.open().
 * Uses only the KEY_ID — the Razorpay Order was already created 
 * by the WooCommerce Razorpay plugin on the server side.
 *
 * @param razorpayOrderId  - The order_id from WC meta_data (format: order_xxx)
 * @param amountInPaise    - Total amount in paise (₹ × 100)
 * @param userInfo         - User prefill details
 */
export const buildRazorpayOptions = (
  amountInPaise: number,
  userInfo: { name: string; email: string; phone: string },
  razorpayOrderId: string
): RazorpayOptions => {
  const prefill: any = {};
  if (userInfo.name?.trim()) prefill.name = userInfo.name.trim();
  if (userInfo.email?.trim()) prefill.email = userInfo.email.trim();
  if (userInfo.phone?.trim()) prefill.contact = userInfo.phone.trim();

  const options: RazorpayOptions = {
    key: RAZORPAY_KEY_ID,
    amount: amountInPaise,
    currency: 'INR',
    order_id: razorpayOrderId,
    name: 'EcomNative Store',
    description: 'Secure Payment via Razorpay',
    image: 'https://i.imgur.com/3g7nmJC.png',
    theme: {
      color: '#7C3AED',
    },
  };

  if (Object.keys(prefill).length > 0) {
    options.prefill = prefill;
  }

  return options;
};
