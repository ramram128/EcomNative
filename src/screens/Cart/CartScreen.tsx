import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useShop } from '../../store/shopStore';
import { COLORS } from '../../constants/theme';

const CartScreen = () => {
  const { cart, cartTotal, setQty, removeFromCart, clearCart } = useShop();

  return (
    <SafeAreaView style={styles.safe}   edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
        {cart.length > 0 ? (
          <TouchableOpacity onPress={clearCart} activeOpacity={0.9}>
            <Text style={styles.clear}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={40} color="#999" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add products to see them here.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => String(item.product.id)}
            contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.product.images?.[0]?.src }} style={styles.img} />

                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.name}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.price}>₹ {item.product.price}</Text>

                  <View style={styles.row}>
                    <View style={styles.qtyBox}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => setQty(item.product.id, item.qty - 1)}
                      >
                        <Ionicons name="remove" size={16} color="#111" />
                      </TouchableOpacity>

                      <Text style={styles.qtyText}>{item.qty}</Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => setQty(item.product.id, item.qty + 1)}
                      >
                        <Ionicons name="add" size={16} color="#111" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.trashBtn}
                      onPress={() => removeFromCart(item.product.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#333" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Bottom total + checkout */}
          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹ {Math.round(cartTotal)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.9}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

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

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyTitle: { marginTop: 10, fontSize: 16, fontWeight: '900', color: COLORS.text },
  emptySub: { marginTop: 4, fontSize: 13, color: COLORS.textLight, textAlign: 'center' },

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
  img: { width: 84, height: 84, borderRadius: 12, backgroundColor: '#eee' },
  name: { fontSize: 14, fontWeight: '900', color: COLORS.text },
  price: { marginTop: 4, fontSize: 13, fontWeight: '800', color: COLORS.primary },

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
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  totalLabel: { fontSize: 12, fontWeight: '800', color: COLORS.textLight },
  totalValue: { marginTop: 2, fontSize: 18, fontWeight: '900', color: COLORS.text },

  checkoutBtn: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  checkoutText: { color: COLORS.white, fontWeight: '900' },
});
