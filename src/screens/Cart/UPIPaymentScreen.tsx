import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import { buildRazorpayOptions } from '../../config/razorpay.config';
import { updateWooOrderAfterPayment, createRazorpayOrder } from '../../api/razorpayApi';
import { useShop } from '../../store/shopStore';

const STEPS = [
  'Creating your order...',
  'Initializing payment gateway...',
  'Waiting for payment...',
];

const UPIPaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, createOrder } = useShop();
  const { shippingAddress, finalAmount } = route.params as any;

  const [stepIndex, setStepIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const cycleStep = (index: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setStepIndex(index);
  };

  useEffect(() => {
    processPayment();
  }, []);

  const processPayment = async () => {
    let wooOrderId: number | null = null;

    try {
      // ── Step 1: Create WooCommerce Order (status: pending) ──────────────
      cycleStep(0);
      // set_paid: false so WC creates order as "pending payment"
      // The WooCommerce Razorpay plugin auto-generates a Razorpay order_id
      const wooOrder = await createOrder('razorpay', shippingAddress);

      if (!wooOrder?.id) {
        throw new Error('Failed to create order. Please try again.');
      }
      wooOrderId = wooOrder.id;

      // ── Step 2: Create Razorpay Order Client-Side (Fallback) ───────────
      cycleStep(1);
      const amountPaise = finalAmount * 100; // convert ₹ → paise
      
      const razorpayOrderId = await createRazorpayOrder(amountPaise, `woo_receipt_${wooOrderId}`);

      // ── Step 3: Build options and open Razorpay SDK ──────────────────────
      cycleStep(2);
      const options = buildRazorpayOptions(
        Math.round(amountPaise),
        {
          name: `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim(),
          email: user?.email || '',
          phone: shippingAddress.phone || '',
        },
        razorpayOrderId
      );

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // Payment success — update WC order in background (non-blocking)
          updateWooOrderAfterPayment(
            wooOrderId!,
            data.razorpay_payment_id,
            data.razorpay_order_id,
            data.razorpay_signature
          ).catch(() => {}); // best-effort, not critical

          (navigation as any).navigate('PaymentResult', {
            success: true,
            orderId: wooOrderId,
            paymentId: data.razorpay_payment_id,
            amount: finalAmount,
          });
        })
        .catch((error: any) => {
          // User cancelled or payment failed
          const reason = error?.description || error?.reason || 'Payment was cancelled.';
          (navigation as any).navigate('PaymentResult', {
            success: false,
            error: reason,
            orderId: wooOrderId,
          });
        });

    } catch (err: any) {
      Alert.alert(
        'Order Error',
        err.message || 'Something went wrong. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Pulse ring animation */}
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
      <Animated.Text style={[styles.statusText, { opacity: fadeAnim }]}>
        {STEPS[stepIndex]}
      </Animated.Text>
      <Text style={styles.subText}>Please do not press back</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loaderWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#7C3AED20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    color: '#A0A0B8',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default UPIPaymentScreen;
