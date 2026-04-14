import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants/theme';
import { CartLayoutProps } from './types';
import { getCartItemPriceDetails } from '../../components/utils/priceHelpers';

const TAB_HEIGHT = 65;

const CartModern: React.FC<CartLayoutProps> = ({
  cart,
  cartTotal,
  setQty,
  removeFromCart,
  clearCart,
  onCheckout,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
        <TouchableOpacity onPress={clearCart} activeOpacity={0.9}>
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.key || `${item.product.id}-${item.variation?.id || '0'}`}
        contentContainerStyle={{ padding: 12, paddingBottom: TAB_HEIGHT + insets.bottom + 100 }}
        renderItem={({ item }) => {
          const priceDetails = getCartItemPriceDetails(item.product, item.variation);
          return (
            <View style={styles.card}>
              <Image
                source={{ uri: item.variation?.image?.src || item.product.images?.[0]?.src }}
                style={styles.img}
              />

              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.name}>
                  {item.product.name}
                </Text>

                {item.variation && (
                  <Text style={styles.variationText}>
                    {item.variation.attributes?.map((a: any) => a.option).join(', ')}
                  </Text>
                )}

                <View style={styles.priceContainer}>
                  <Text style={styles.price}>₹ {priceDetails.finalPrice}</Text>
                  {priceDetails.showBoth && (
                    <View style={styles.discountRow}>
                      <Text style={styles.regularPrice}>₹ {priceDetails.inrRegular}</Text>
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{priceDetails.discountPercent}%</Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.row}>
                  <View style={styles.qtyBox}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => setQty(item.product.id, item.qty - 1, item.variation?.id)}
                    >
                      <Ionicons name="remove" size={16} color={COLORS.text} />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.qty}</Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => setQty(item.product.id, item.qty + 1, item.variation?.id)}
                    >
                      <Ionicons name="add" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.trashBtn}
                    onPress={() => removeFromCart(item.product.id, item.variation?.id, item.key)}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.expense} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Bottom total + checkout */}
      <View style={[styles.bottomBar, { bottom: TAB_HEIGHT + insets.bottom + -50 }]}>
        <LinearGradient
            colors={[COLORS.background + 'CC', COLORS.background + 'EE']}
            style={StyleSheet.absoluteFill}
          />
        <View style={styles.floatingContent}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹ {Math.round(cartTotal)}</Text>
          </View>

          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.9} onPress={onCheckout}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900', color: COLORS.text },
  clear: { fontSize: 12, fontWeight: '900', color: COLORS.primary },

  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  img: { width: 84, height: 84, borderRadius: 12, backgroundColor: COLORS.background },
  name: { fontSize: 14, fontWeight: '900', color: COLORS.text },
  variationText: { fontSize: 11, color: COLORS.text + '60', marginTop: 2 },
  priceContainer: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  regularPrice: { fontSize: 11, color: COLORS.text + '40', textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: '#e6f4ea', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  discountText: { color: '#1e8e3e', fontSize: 10, fontWeight: '800' },

  row: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontWeight: '900', color: COLORS.text, minWidth: 18, textAlign: 'center' },

  trashBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  floatingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: '100%',
  },
  totalLabel: { fontSize: 12, fontWeight: '800', color: COLORS.textLight },
  totalValue: { marginTop: 2, fontSize: 18, fontWeight: '900', color: COLORS.text },

  checkoutBtn: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  checkoutText: { color: COLORS.white, fontWeight: '900' },
});

export default CartModern;
