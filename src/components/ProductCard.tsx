import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Product } from '../types/product';

interface Props {
  product: Product;
  onPress: () => void;
}

const ProductCard = ({ product, onPress }: Props) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: product.images[0]?.src }} style={styles.image} />
    <View style={styles.info}>
      <Text numberOfLines={1} style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#fff', margin: 8, borderRadius: 10, elevation: 2 },
  image: { width: '100%', height: 150, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  info: { padding: 10 },
  name: { fontWeight: '600', fontSize: 14 },
  price: { color: '#2ecc71', marginTop: 4, fontWeight: 'bold' }
});

export default ProductCard;