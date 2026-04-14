import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

import { Product, Variation } from '../types/product';
import { COLORS } from '../constants/theme';

interface Props {
  product: Product;
  onPress: () => void;
  numColumns?: number; // Tells the card how many siblings it has
}

/* =================== UTILS =================== */

const toNumber = (v: any): number => {
  if (v === undefined || v === null || v === '') return NaN;
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const formatINR = (value: any): string => {
  const n = toNumber(value);
  if (!Number.isFinite(n)) return String(value ?? '');
  try {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

/* =================== COMPONENT =================== */

const ProductCard = ({ product, onPress, numColumns = 2 }: Props) => {
  if (!product) return null;

  // 🧠 DYNAMIC SCALING:
  // We calculate a multiplier based on column count to shrink fonts/paddings
  // 2 cols = 1.0, 3 cols = 0.85, 4+ cols = 0.72
  const scale = numColumns > 2 ? (numColumns > 3 ? 0.72 : 0.85) : 1;

  const tags = product.tags || [];

  const priceData = useMemo(() => {
    let reg = product.regular_price;
    let sale = product.sale_price || product.price;

    if (product.type === 'variable' && product.variations && product.variations.length > 0) {
      const cheapestVar = product.variations.reduce((prev: Variation, curr: Variation) => {
        const prevPrice = toNumber(prev.sale_price || prev.price);
        const currPrice = toNumber(curr.sale_price || curr.price);
        return currPrice < prevPrice ? curr : prev;
      });

      reg = cheapestVar.regular_price || cheapestVar.price;
      sale = cheapestVar.sale_price || cheapestVar.price;
    }

    const regNum = toNumber(reg);
    const saleNum = toNumber(sale);
    const isDiscounted = !isNaN(regNum) && !isNaN(saleNum) && regNum > saleNum;
    const percent = isDiscounted ? Math.round(((regNum - saleNum) / regNum) * 100) : 0;

    return {
      showBoth: isDiscounted,
      discountPercent: percent,
      inrRegular: formatINR(reg),
      inrSale: formatINR(sale),
      finalPrice: formatINR(sale || reg),
      isVariable: product.type === 'variable'
    };
  }, [product]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.baseCard}
    >
      {/* IMAGE SECTION */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.images?.[0]?.src || 'https://via.placeholder.com/300' }}
          style={styles.image}
        />

        {/* TOP LEFT: Discount Badge (Scaled) */}
        {priceData.showBoth && (
          <View style={[styles.discountBadge, { paddingHorizontal: 6 * scale, top: 6 * scale, left: 6 * scale }]}>
            <Text style={[styles.badgeText, { fontSize: 9 * scale }]}>
              {/* Show shorter text if 4 columns */}
              {priceData.discountPercent}%{numColumns < 4 ? ' OFF' : ''}
            </Text>
          </View>
        )}

        {/* TOP RIGHT: Tag (Scaled) */}
        <View style={[styles.tagContainer, { top: 6 * scale, right: 6 * scale }]}>
          {tags.slice(0, 1).map((tag: any, index: number) => (
            <View key={tag.id || index} style={[styles.tagBadge, { paddingHorizontal: 5 * scale }]}>
              <Text style={[styles.badgeText, { fontSize: 8 * scale }]}>
                {tag.name.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* INFO SECTION */}
      <View style={[styles.info, { padding: 8 * scale }]}>
        <Text
          numberOfLines={numColumns > 3 ? 2 : 1}
          style={[styles.name, { fontSize: 14 * scale, marginBottom: 2 * scale }]}
        >
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          {priceData.isVariable && (
            <Text style={[styles.fromLabel, { fontSize: 10 * scale }]}>From </Text>
          )}

          <Text style={[styles.salePrice, { fontSize: 15 * scale }]}>₹{priceData.inrSale}</Text>

          {/* Hide strike price on 4-column layout to prevent clutter */}
          {priceData.showBoth && numColumns < 4 && (
            <Text style={[styles.strikePrice, { fontSize: 11 * scale }]}>
              ₹{priceData.inrRegular}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* =================== STYLES =================== */

const styles = StyleSheet.create({
  baseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    backgroundColor: COLORS?.primary || '#E91E63',
    paddingVertical: 2,
    borderRadius: 3,
    zIndex: 10,
  },
  tagContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  tagBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 2,
    borderRadius: 3,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontWeight: '600',
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  fromLabel: {
    color: '#888',
    marginRight: 2,
  },
  salePrice: {
    fontWeight: 'bold',
    color: COLORS?.primary || '#000',
  },
  strikePrice: {
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
});

export default ProductCard;