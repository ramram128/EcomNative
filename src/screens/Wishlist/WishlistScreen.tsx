import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { useShop } from '../../store/shopStore';
import { COLORS } from '../../constants/theme';

const WishlistScreen = () => {
  const navigation = useNavigation();
  const { wishlist, removeWishlist, addToCart } = useShop();

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.count}>{wishlist.length} items</Text>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={40} color="#999" />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySub}>Tap the heart icon to save products.</Text>

        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.images?.[0]?.src }} style={styles.img} />

              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.name}>
                  {item.name}
                </Text>
                <Text style={styles.price}>₹ {item.price}</Text>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.smallBtn}
                    onPress={() => addToCart(item, 1)}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="cart-outline" size={16} color="#fff" />
                    <Text style={styles.smallBtnText}>Add</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => removeWishlist(item.id)}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="trash-outline" size={18} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default WishlistScreen;

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
  count: { fontSize: 12, fontWeight: '700', color: COLORS.textLight },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyTitle: { marginTop: 10, fontSize: 16, fontWeight: '900', color: COLORS.text },
  emptySub: { marginTop: 4, fontSize: 13, color: COLORS.textLight, textAlign: 'center' },

  primaryBtn: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  primaryText: { color: COLORS.white, fontWeight: '900' },

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

  row: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  smallBtn: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  smallBtnText: { color: COLORS.white, fontWeight: '900', fontSize: 12 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
