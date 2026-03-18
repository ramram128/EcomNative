import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';

import { Product } from '../types/product';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/details.styles';
import { PriceDisplay } from './PriceDisplay';
import { getPriceDetails } from './utils/priceHelpers';

interface Props {
  product: Product;
  onPress: () => void;
}

/* =================== COMPONENT =================== */

const ProductCard = ({ product, onPress }: Props) => {

  // ✅ CORRECT: get tags from product
  const tags = product.tags || [];

  const { showBoth, discountPercent } = useMemo(
    () => getPriceDetails(product),
    [product]
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.baseCard}>
      
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.images?.[0]?.src }}
          style={styles.image}
        />

        {/* LEFT: Discount */}
        {showBoth && (
          <View style={[styles.badge, styles.discountBadgeLeft]}>
            <Text style={styles.badgeText}>
              {discountPercent}% OFF
            </Text>
          </View>
        )}

        {/* RIGHT: WooCommerce Tags */}
        {tags.slice(0, 2).map((tag: any, index: number) => (
          <View
            key={tag.id || index}
            style={[
              styles.badge,
              styles.newBadgeRight,
              { top: 8 + index * 26 } // stack vertically
            ]}
          >
            <Text style={styles.badgeText}>
              {tag.name.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      {/* PRODUCT INFO */}
      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={[styles.name, { color: COLORS.text }]}
        >
          {product.name}
        </Text>

        <PriceDisplay product={product} />
      </View>

    </TouchableOpacity>
  );
};

export default ProductCard;