const axios = require('axios');
const base64 = require('base-64');

const WOO_BASE_URL = 'https://infinitroot.com';
const WOO_CONSUMER_KEY = 'ck_5eb120aa68503c748a6a7cefdbd48eff9f6d41cf';
const WOO_CONSUMER_SECRET = 'cs_8268cd5613be2da117e94a9b9a1e0bf5a8c10b9a';

async function testOrder() {
  const auth = base64.encode(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`);
  const { data: wcOrder } = await axios.post(
    `${WOO_BASE_URL}/wp-json/wc/v3/orders`,
    {
      payment_method: 'razorpay',
      payment_method_title: 'UPI / Cards / NetBanking',
      set_paid: false,
      line_items: [{ product_id: 110, quantity: 1, subtotal: "100", total: "100" }] // A dummy item
    },
    { headers: { Authorization: `Basic ${auth}` } }
  );

  console.log("Order ID:", wcOrder.id);
  console.log("Meta Data:", JSON.stringify(wcOrder.meta_data, null, 2));
}
testOrder().catch(err => console.error(err.response?.data || err.message));
