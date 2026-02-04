import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import { Product } from '../types/product';
import { COLORS, ACTIVE_LAYOUT } from '../constants/theme';
import { styles } from '../styles/productcard.styles';
import { PriceDisplay } from './PriceDisplay';
import { getPriceDetails } from './utils/priceHelpers';

interface Props {
  product: Product;
  onPress: () => void;
}

const toNumber = (v: any) => {
  if (v === undefined || v === null) return NaN;
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const formatINR = (value: any) => {
  const n = toNumber(value);
  if (!Number.isFinite(n)) return String(value ?? '');
  try {
    // ✅ Best in modern RN (Hermes supports Intl in most setups)
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
  } catch {
    // Fallback
    return String(Math.round(n));
  }
};

const DiscountBadge = ({ percent }: { percent: number }) => (
  <View style={styles.discountBadge}>
    <Text style={styles.discountText}>{percent}% off</Text>
  </View>
);

const ProductCard = ({ product, onPress }: Props) => {
  const { showBoth, discountPercent } = useMemo(() => getPriceDetails(product), [product]);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.baseCard]}>
      

      <View>
        <Image source={{ uri: product.images?.[0]?.src }} style={styles.image} />
        {showBoth && <DiscountBadge percent={discountPercent}/>}
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={[styles.name, { color: COLORS.text }]}>
          {product.name}
        </Text>
        
        {/* REUSABLE COMPONENT USED HERE */}
        <PriceDisplay product={product} />
      </View>
    </TouchableOpacity>
  );
};
export default ProductCard;
