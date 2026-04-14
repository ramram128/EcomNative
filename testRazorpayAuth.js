const axios = require('axios');

async function testAuth() {
  const keyId = 'rzp_test_SWblbmXaw3ZCRE';
  const keySecret = 'xdd3qr4E4ollixf8ZAemojqU';
  
  const authMsg = Buffer.from(keyId + ':' + keySecret).toString('base64');
  
  try {
    const { data } = await axios.post('https://api.razorpay.com/v1/orders', {
      amount: 1000,
      currency: "INR",
      receipt: "receipt_1"
    }, {
      headers: { Authorization: `Basic ${authMsg}` }
    });
    console.log("SUCCESS. Order ID:", data.id);
  } catch(e) {
    console.error("FAIL:", e.response?.data || e.message);
  }
}
testAuth();
