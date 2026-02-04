import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Platform } from 'react-native';
import { Product } from '../types/product';
import { COLORS, ACTIVE_LAYOUT } from '../constants/theme';
import { BlurView } from '@react-native-community/blur';

interface Props {
  product: Product;
  onPress: () => void;
}

const ProductCard = ({ product, onPress }: Props) => {
  const isCrystal = ACTIVE_LAYOUT === 'crystal';

  return (
    <TouchableOpacity 
      onPress={onPress}
      // 🔥 DYNAMIC: Switch between Crystal (translucent) and Bento (solid) containers
      style={[
        styles.baseCard, 
        isCrystal ? styles.crystalContainer : styles.bentoContainer
      ]}
    >
      {/* 1. GLASS EFFECT: Only renders if layout is 'crystal' */}
      {isCrystal && (
        Platform.OS === 'ios' ? (
          <BlurView style={StyleSheet.absoluteFill} blurType="light" blurAmount={10} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidGlass]} />
        )
      )}

      <Image source={{ uri: product.images[0]?.src }} style={styles.image} />
      
      <View style={styles.info}>
        <Text 
          numberOfLines={1} 
          // 🔥 DYNAMIC: White text for Crystal, Theme text for Bento
          style={[styles.name, { color: isCrystal ? COLORS.white : COLORS.text }]}
        >
          {product.name}
        </Text>
        
        <Text 
          // 🔥 DYNAMIC: Price color adjusts to theme primary color in Bento mode
          style={[styles.price, { color: isCrystal ? COLORS.white : COLORS.primary }]}
        >
          ₹{product.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Shared styles for both designs
  baseCard: { 
    flex: 1, 
    margin: 8, 
    borderRadius: 16, 
    overflow: 'hidden' 
  },
  image: { 
    width: '100%', 
    height: 160, 
    resizeMode: 'cover' 
  },
  info: { padding: 12 },
  name: { fontWeight: '700', fontSize: 14 },
  price: { marginTop: 4, fontWeight: '800', fontSize: 15 },

  // 💎 CRYSTAL SPECIFIC (Glassmorphism)
  crystalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  androidGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  // 🍱 BENTO SPECIFIC (Modern Tile)
  bentoContainer: {
    backgroundColor: '#FFFFFF', // Clean white tile
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

export default ProductCard;