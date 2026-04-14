import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

import { useShop } from '../../store/shopStore';
import { COLORS } from '../../constants/theme';
import { SelectedCartLayout } from '../../layouts/cart';

const TAB_HEIGHT = 65;

const CartScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { 
    cart, 
    cartTotal, 
    setQty, 
    removeFromCart, 
    clearCart, 
    isAuthenticated, 
    fetchCart, 
    isLoadingCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useShop();

  // Refresh cart on focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCart();
    }, [fetchCart])
  );

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to proceed with checkout.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Auth' as never) },
        ]
      );
      return;
    }
    navigation.navigate('Checkout' as never);
  };

  if (isLoadingCart && cart.length === 0) {
    return (
      <View style={[styles.loading, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingTitle}>Loading your cart...</Text>
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: COLORS.background }]}>
        <Ionicons name="cart-outline" size={80} color={COLORS.text + '20'} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Add products to see them here.</Text>
        <TouchableOpacity 
          style={styles.shopNowBtn}
          onPress={() => navigation.navigate('Shop' as never)}
        >
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SelectedCartLayout
      cart={cart}
      cartTotal={cartTotal}
      setQty={setQty}
      removeFromCart={removeFromCart}
      clearCart={clearCart}
      isAuthenticated={isAuthenticated}
      onCheckout={handleCheckout}
      isLoading={isLoadingCart}
      appliedCoupon={appliedCoupon}
      applyCoupon={applyCoupon}
      removeCoupon={removeCoupon}
    />
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingTitle: { marginTop: 10, fontSize: 16, fontWeight: '900', color: COLORS.text },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyTitle: { marginTop: 10, fontSize: 20, fontWeight: '900', color: COLORS.text },
  emptySub: { marginTop: 8, fontSize: 14, color: COLORS.text + '80', textAlign: 'center' },
  shopNowBtn: { marginTop: 30, backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 },
  shopNowText: { color: COLORS.white, fontWeight: '900', fontSize: 16 },
});
