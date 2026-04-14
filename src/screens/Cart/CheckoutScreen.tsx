import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useShop } from '../../store/shopStore';
import { usePopup } from '../../context/PopupContext';
import { CustomerService } from '../../api/wooApi2';

const DARK_BLUE = '#0F0F1A';
const ACCENT_PURPLE = '#7C3AED';
const CARD_BG = '#16162A';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { cart, cartTotal, appliedCoupon, user, createOrder } = useShop();
  const { showAlert } = usePopup();
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!user?.id) return;
    try {
      const profile = await CustomerService.getCustomer(user.id);
      setShippingAddress(profile.shipping);
    } catch (err) {
      console.error('Fetch user failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount_type === 'percent') {
      return (cartTotal * parseFloat(appliedCoupon.amount)) / 100;
    }
    return parseFloat(appliedCoupon.amount);
  };

  const discountAmount = calculateDiscount();
  const deliveryCharge = 0; // Free for now
  const finalTotal = cartTotal - discountAmount + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (!shippingAddress?.address_1) {
      showAlert('Address Required', 'Please add a shipping address in your profile.', 'warning');
      return;
    }

    if (paymentMethod === 'razorpay') {
      // Navigate to UPIPayment orchestration screen
      navigation.navigate('UPIPayment' as never, {
        shippingAddress,
        finalAmount: finalTotal,
      } as never);
      return;
    }

    // Handle COD
    setIsProcessing(true);
    try {
      const order = await createOrder('cod', shippingAddress);
      if (order?.id) {
        navigation.navigate('PaymentResult' as never, {
          success: true,
          orderId: order.id,
          amount: finalTotal,
        } as never);
      }
    } catch (err) {
      showAlert('Error', 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={ACCENT_PURPLE} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ShippingAddress' as never)}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {shippingAddress?.address_1 ? (
              <>
                <Text style={styles.addressName}>{shippingAddress.first_name} {shippingAddress.last_name}</Text>
                <Text style={styles.addressText}>{shippingAddress.address_1}, {shippingAddress.city}</Text>
                <Text style={styles.addressText}>{shippingAddress.state}, {shippingAddress.postcode}</Text>
                <Text style={styles.addressPhone}>{shippingAddress.phone}</Text>
              </>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('ShippingAddress' as never)}>
                <Text style={styles.addAddressText}>+ Add Shipping Address</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity 
            style={[styles.card, styles.paymentItem, paymentMethod === 'razorpay' && styles.selectedCard]}
            onPress={() => setPaymentMethod('razorpay')}
          >
            <View style={styles.radioContainer}>
              <View style={[styles.radio, paymentMethod === 'razorpay' && styles.radioActive]}>
                {paymentMethod === 'razorpay' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.paymentName}>UPI, Cards, NetBanking</Text>
                <Text style={styles.paymentDesc}>Secure payment via Razorpay</Text>
              </View>
            </View>
            <Image source={{ uri: 'https://i.imgur.com/3g7nmJC.png' }} style={styles.payIcon} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.paymentItem, paymentMethod === 'cod' && styles.selectedCard]}
            onPress={() => setPaymentMethod('cod')}
          >
            <View style={styles.radioContainer}>
              <View style={[styles.radio, paymentMethod === 'cod' && styles.radioActive]}>
                {paymentMethod === 'cod' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.paymentName}>Cash on Delivery (COD)</Text>
                <Text style={styles.paymentDesc}>Pay when you receive the order</Text>
              </View>
            </View>
            <Ionicons name="cash-outline" size={24} color={ACCENT_PURPLE} />
          </TouchableOpacity>
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.card}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{Math.round(cartTotal)}</Text>
            </View>
            {discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: '#10B981' }]}>Discount</Text>
                <Text style={[styles.summaryValue, { color: '#10B981' }]}>-₹{Math.round(discountAmount)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charge</Text>
              <Text style={styles.summaryValue}>{deliveryCharge > 0 ? `₹${deliveryCharge}` : 'Free'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{Math.round(finalTotal)}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total Amount</Text>
          <Text style={styles.bottomTotalValue}>₹{Math.round(finalTotal)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.payBtnContainer} 
          disabled={isProcessing}
          onPress={handlePlaceOrder}
        >
          <LinearGradient
            colors={[ACCENT_PURPLE, '#6D28D9']}
            style={styles.payBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payBtnText}>Proceed to Pay</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_BLUE },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  backBtn: { backgroundColor: CARD_BG, padding: 8, borderRadius: 12 },
  scroll: { padding: 20 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', opacity: 0.9 },
  changeText: { color: ACCENT_PURPLE, fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: CARD_BG, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#2D2D44' },
  selectedCard: { borderColor: ACCENT_PURPLE + '80', backgroundColor: ACCENT_PURPLE + '10' },
  addressName: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 6 },
  addressText: { fontSize: 13, color: '#A0A0B8', lineHeight: 20 },
  addressPhone: { fontSize: 13, color: '#A0A0B8', marginTop: 4 },
  addAddressText: { color: ACCENT_PURPLE, fontWeight: '600', textAlign: 'center' },
  paymentItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  radioContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#4A4A6A', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: ACCENT_PURPLE },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: ACCENT_PURPLE },
  paymentName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  paymentDesc: { color: '#A0A0B8', fontSize: 12, marginTop: 2 },
  payIcon: { width: 24, height: 24, resizeMode: 'contain' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: '#A0A0B8', fontSize: 14 },
  summaryValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#2D2D44', marginVertical: 12 },
  totalLabel: { color: '#fff', fontSize: 16, fontWeight: '700' },
  totalValue: { color: ACCENT_PURPLE, fontSize: 18, fontWeight: '800' },
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: CARD_BG, 
    padding: 20, 
    paddingBottom: 30,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  bottomTotalLabel: { color: '#A0A0B8', fontSize: 12, fontWeight: '600' },
  bottomTotalValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  payBtnContainer: { flex: 1, marginLeft: 20 },
  payBtn: { height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: ACCENT_PURPLE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default CheckoutScreen;
