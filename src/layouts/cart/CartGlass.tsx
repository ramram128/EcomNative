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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, JOY_COLORS } from '../../constants/theme';
import { CartLayoutProps } from './types';
import { getCartItemPriceDetails } from '../../components/utils/priceHelpers';

const TAB_HEIGHT = 65;

const CartGlass: React.FC<CartLayoutProps> = ({
  cart,
  cartTotal,
  setQty,
  removeFromCart,
  clearCart,
  onCheckout,
  isLoading,
}) => {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: any }) => {
    const priceDetails = getCartItemPriceDetails(item.product, item.variation);
    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.variation?.image?.src || item.product.images?.[0]?.src }}
            style={styles.img}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.badge}>LIMITED EDITION</Text>
              <Text numberOfLines={1} style={styles.name}>
                {item.product.name}
              </Text>
              {item.variation && (
                <Text style={styles.variationText}>
                  {item.variation.attributes?.map((a: any) => a.option).join(', ')}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeFromCart(item.product.id, item.variation?.id, item.key)}
            >
              <Ionicons name="trash-outline" size={18} color="#926f64" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.qtyBox}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(item.product.id, item.qty - 1, item.variation?.id)}
              >
                <Ionicons name="remove" size={14} color={JOY_COLORS.text} />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.qty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(item.product.id, item.qty + 1, item.variation?.id)}
              >
                <Ionicons name="add" size={14} color={JOY_COLORS.text} />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.price}>₹{priceDetails.finalPrice}</Text>
              {priceDetails.showBoth && (
                <View style={styles.discountRow}>
                  <Text style={styles.regularPrice}>₹{priceDetails.inrRegular}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{priceDetails.discountPercent}%</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.key || `${item.product.id}-${item.variation?.id || '0'}`}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: TAB_HEIGHT + insets.bottom + 120,
        }}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Cart</Text>
          </View>
        )}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {cart.length > 0 && (
        <View style={[styles.floatingSummary, { bottom: TAB_HEIGHT + insets.bottom + 15 }]}>
          {Platform.OS === 'ios' ? (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="light"
              blurAmount={30}
              reducedTransparencyFallbackColor="white"
            />
          ) : (
            <LinearGradient
              colors={['#ffffffcc', '#ffffffee']}
              style={StyleSheet.absoluteFill}
            />
          )}

          <View style={styles.summaryContent}>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.totalValue}>₹{Math.round(cartTotal)}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onCheckout}
              style={styles.checkoutBtnContainer}
            >
              <LinearGradient
                colors={[JOY_COLORS.primary, JOY_COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkoutBtn}
              >
                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f6',
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: JOY_COLORS.text,
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: 14,
    color: '#5d4036',
    fontWeight: '500',
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#ab3500',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff8f6',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    fontSize: 9,
    fontWeight: '800',
    color: JOY_COLORS.secondary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: JOY_COLORS.text,
  },
  variationText: {
    fontSize: 12,
    color: '#5d4036',
    opacity: 0.6,
  },
  deleteBtn: {
    padding: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff1ed',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 12,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: JOY_COLORS.text,
    minWidth: 15,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
    color: JOY_COLORS.primary,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  regularPrice: {
    fontSize: 11,
    color: '#926f64',
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  discountBadge: {
    backgroundColor: '#fff1ed',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  discountText: {
    color: JOY_COLORS.primary,
    fontSize: 9,
    fontWeight: '800',
  },
  floatingSummary: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 140,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#ab3500',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  summaryContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5d4036',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '900',
    color: JOY_COLORS.text,
  },
  checkoutBtnContainer: {
    marginTop: 12,
  },
  checkoutBtn: {
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default CartGlass;
