import axios from 'axios';
import { WOO_BASE_URL, WOO_CONSUMER_KEY, WOO_CONSUMER_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@env';

/**
 * Updates a WooCommerce order status and payment details after Razorpay payment success.
 * No Razorpay Secret Key required here — the WC Razorpay plugin handles verification.
 */
export const updateWooOrderAfterPayment = async (
  orderId: number,
  paymentId: string,
  razorpayOrderId: string,
  signature: string
) => {
  try {
    const response = await axios.put(
      `${WOO_BASE_URL}/wp-json/wc/v3/orders/${orderId}`,
      {
        status: 'processing',
        transaction_id: paymentId,
        meta_data: [
          { key: 'razorpay_payment_id', value: paymentId },
          { key: 'razorpay_order_id', value: razorpayOrderId },
          { key: 'razorpay_signature', value: signature },
        ],
      },
      {
        params: {
          consumer_key: WOO_CONSUMER_KEY,
          consumer_secret: WOO_CONSUMER_SECRET,
        },
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('[WooAPI] Update order failed:', error?.response?.data || error.message);
    // Non-fatal — order is paid, just metadata update failed
  }
};

/**
 * Creates a Razorpay Order directly from the client side using the Key ID and Secret.
 */
export const createRazorpayOrder = async (
  amountPaise: number,
  receiptId: string
): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: Math.round(amountPaise),
        currency: 'INR',
        receipt: receiptId,
      },
      {
        auth: {
          username: RAZORPAY_KEY_ID,
          password: RAZORPAY_KEY_SECRET,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.id;
  } catch (error: any) {
    console.error('[RazorpayAPI] Create order failed:', error?.response?.data || error.message);
    throw new Error('Failed to create Razorpay Order. Authentication failed.');
  }
};

