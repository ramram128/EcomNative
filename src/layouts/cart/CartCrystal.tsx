import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartLayoutProps } from './types';
import { getCartItemPriceDetails } from '../../components/utils/priceHelpers';

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 65;

const CartCrystal: React.FC<CartLayoutProps> = ({
  cart,
  cartTotal,
  setQty,
  removeFromCart,
  onCheckout,
}) => {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: any }) => {
    const priceDetails = getCartItemPriceDetails(item.product, item.variation);
    return (
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.variation?.image?.src || item.product.images?.[0]?.src }}
            style={styles.img}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.productCategory}>
                {item.variation
                  ? item.variation.attributes?.map((a: any) => a.option).join(', ')
                  : 'Original Edition'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => removeFromCart(item.product.id, item.variation?.id, item.key)}
            >
              <Ionicons name="trash-outline" size={18} color="rgba(230, 227, 249, 0.5)" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                onPress={() => setQty(item.product.id, item.qty - 1, item.variation?.id)}
              >
                <Ionicons name="remove" size={14} color="#c39bff" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.qty}</Text>
              <TouchableOpacity
                onPress={() => setQty(item.product.id, item.qty + 1, item.variation?.id)}
              >
                <Ionicons name="add" size={14} color="#c39bff" />
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
      {/* Mesh Gradient Emulation */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
           colors={['#0d0d1c', '#1a1a2e']}
           style={StyleSheet.absoluteFill}
        />
        <View style={[styles.meshOverlay, { top: -100, left: -100, backgroundColor: 'rgba(138, 43, 226, 0.15)' }]} />
        <View style={[styles.meshOverlay, { top: -100, right: -100, backgroundColor: 'rgba(112, 214, 255, 0.15)' }]} />
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.key || `${item.product.id}-${item.variation?.id || '0'}`}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: TAB_HEIGHT + insets.bottom + 140,
        }}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Cart</Text>
            <Text style={styles.headerSub}>{cart.length} items ready for checkout</Text>
          </View>
        )}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.floatingSummary, { bottom: TAB_HEIGHT + insets.bottom + 30 }]}>
        <View style={styles.summaryBlur}>
          <View style={styles.summaryHeader}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>₹{Math.round(cartTotal)}</Text>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={onCheckout}>
            <LinearGradient
              colors={['#c39bff', '#b68cf5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkoutBtn}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color="#130030" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1c',
  },
  meshOverlay: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: (width * 1.5) / 2,
    opacity: 0.5,
  },
  header: {
    marginBottom: 32,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e6e3f9',
    fontFamily: 'Manrope',
  },
  headerSub: {
    fontSize: 14,
    color: '#aba9be',
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(36, 36, 58, 0.3)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(117, 116, 135, 0.2)',
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#121222',
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
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#c39bff',
  },
  productCategory: {
    fontSize: 13,
    color: '#aba9be',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(36, 36, 58, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e6e3f9',
    minWidth: 16,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e6e3f9',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  regularPrice: {
    fontSize: 11,
    color: '#aba9be',
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  discountBadge: {
    backgroundColor: 'rgba(195, 155, 255, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  discountText: {
    color: '#c39bff',
    fontSize: 9,
    fontWeight: '800',
  },
  floatingSummary: {
    position: 'absolute',
    left: 24,
    right: 24,
    zIndex: 40,
  },
  summaryBlur: {
    backgroundColor: 'rgba(36, 36, 58, 0.4)',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  subtotalLabel: {
    fontSize: 15,
    color: '#aba9be',
    fontWeight: '500',
  },
  subtotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e6e3f9',
  },
  checkoutBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#c39bff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  checkoutText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#130030',
  },
});

export default CartCrystal;
