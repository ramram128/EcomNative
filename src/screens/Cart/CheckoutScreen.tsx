import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import { useShop } from '../../store/shopStore';
import { COLORS, JOY_COLORS } from '../../constants/theme';
import { CustomerService } from '../../api/wooApi2';
import { RAZORPAY_KEY_ID } from '@env';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { cart, cartTotal, appliedCoupon, user, createOrder } = useShop();
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
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
  const finalTotal = cartTotal - discountAmount;

  const handlePlaceOrder = async () => {
    if (!shippingAddress?.address_1) {
      Alert.alert('Address Required', 'Please add a shipping address in your profile.');
      return;
    }

    setIsProcessing(true);
    try {
      if (paymentMethod === 'razorpay') {
        const options = {
          description: 'Payment for your order',
          image: 'https://i.imgur.com/3g7nmJC.png',
          currency: 'INR',
          key: RAZORPAY_KEY_ID,
          amount: Math.round(finalTotal * 100), // In paise
          name: 'EcomNative Store',
          prefill: {
            email: user?.email || '',
            contact: shippingAddress?.phone || '',
            name: `${shippingAddress?.first_name} ${shippingAddress?.last_name}`,
          },
          theme: { color: JOY_COLORS.primary }
        };

        const razorData = await RazorpayCheckout.open(options);
        // On success, razorData will have razorpay_payment_id
        console.log('Razorpay Success:', razorData);
      }

      const order = await createOrder(paymentMethod, shippingAddress);
      if (order?.id) {
        Alert.alert('Success', `Order #${order.id} placed successfully!`, [
          { text: 'OK', onPress: () => navigation.navigate('Tabs' as never) }
        ]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={JOY_COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={JOY_COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Shipping Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ShippingAddress' as never)}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>
          {shippingAddress?.address_1 ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressName}>{shippingAddress.first_name} {shippingAddress.last_name}</Text>
              <Text style={styles.addressText}>{shippingAddress.address_1}, {shippingAddress.city}</Text>
              <Text style={styles.addressText}>{shippingAddress.state}, {shippingAddress.postcode}</Text>
              <Text style={styles.addressText}>{shippingAddress.country}</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addAddressBtn}
              onPress={() => navigation.navigate('ShippingAddress' as never)}
            >
              <Text style={styles.addAddressText}>+ Add Shipping Address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'cod' && styles.selectedOption]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons 
              name={paymentMethod === 'cod' ? "radio-button-on" : "radio-button-off"} 
              size={20} 
              color={paymentMethod === 'cod' ? JOY_COLORS.primary : '#ccc'} 
            />
            <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'razorpay' && styles.selectedOption]}
            onPress={() => setPaymentMethod('razorpay')}
          >
            <Ionicons 
              name={paymentMethod === 'razorpay' ? "radio-button-on" : "radio-button-off"} 
              size={20} 
              color={paymentMethod === 'razorpay' ? JOY_COLORS.primary : '#ccc'} 
            />
            <Text style={styles.paymentText}>UPI / Cards / NetBanking (Razorpay)</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{Math.round(cartTotal)}</Text>
            </View>
            {appliedCoupon && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: JOY_COLORS.primary }]}>Discount ({appliedCoupon.code})</Text>
                <Text style={[styles.summaryValue, { color: JOY_COLORS.primary }]}>-₹{Math.round(discountAmount)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{Math.round(finalTotal)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.placeOrderBtnContainer} 
          disabled={isProcessing}
          onPress={handlePlaceOrder}
        >
          <LinearGradient
            colors={[JOY_COLORS.primary, JOY_COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.placeOrderBtn}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.placeOrderText}>Place Order</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8f6' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: JOY_COLORS.text },
  scroll: { padding: 20 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: JOY_COLORS.text, marginBottom: 12 },
  editBtn: { color: JOY_COLORS.primary, fontWeight: '700' },
  addressCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  addressName: { fontSize: 16, fontWeight: '800', color: JOY_COLORS.text, marginBottom: 4 },
  addressText: { fontSize: 14, color: '#5d4036', opacity: 0.7, lineHeight: 20 },
  addAddressBtn: { backgroundColor: '#fff', padding: 20, borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  addAddressText: { color: JOY_COLORS.primary, fontWeight: '700' },
  paymentOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedOption: { borderColor: JOY_COLORS.primary + '30', backgroundColor: JOY_COLORS.primary + '05' },
  paymentText: { fontSize: 15, fontWeight: '700', color: JOY_COLORS.text },
  summaryCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#926f64', fontWeight: '600' },
  summaryValue: { fontSize: 14, color: JOY_COLORS.text, fontWeight: '800' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '900', color: JOY_COLORS.text },
  totalValue: { fontSize: 20, fontWeight: '900', color: JOY_COLORS.primary },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  placeOrderBtnContainer: {},
  placeOrderBtn: { height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  placeOrderText: { color: '#fff', fontSize: 18, fontWeight: '900' },
});

export default CheckoutScreen;
