import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';

import { Product } from '../types/product';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/productcard.styles';
import { PriceDisplay } from './PriceDisplay';
import { getPriceDetails } from './utils/priceHelpers';

interface Props {
  product: Product;
  onPress: () => void;
}

/* =================== DATE HELPER =================== */
const isNewArrival = (dateCreatedGmt?: string, days = 10): boolean => {
  if (!dateCreatedGmt) return false;

  const createdUTC = new Date(dateCreatedGmt).getTime();
  if (isNaN(createdUTC)) return false;

  const diffInDays =
    (Date.now() - createdUTC) / (1000 * 60 * 60 * 24);

  return diffInDays <= days;
};

/* =================== BADGES =================== */

const DiscountBadge = ({ percent }: { percent: number }) => (
  <View style={[styles.badge, styles.discountBadgeLeft]}>
    <Text style={styles.badgeText}>{percent}% OFF</Text>
  </View>
);

const NewArrivalBadge = () => (
  <View style={[styles.badge, styles.newBadgeRight]}>
    <Text style={styles.badgeText}>NEW</Text>
  </View>
);

/* =================== COMPONENT =================== */

const ProductCard = ({ product, onPress }: Props) => {
  const { showBoth, discountPercent } = useMemo(
    () => getPriceDetails(product),
    [product]
  );

  const isNew = useMemo(
    () => isNewArrival(product.date_created_gmt, 101),
    [product.date_created_gmt]
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.baseCard}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.images?.[0]?.src }}
          style={styles.image}
        />

        {/* LEFT SIDE: DISCOUNT */}
        {showBoth && <DiscountBadge percent={discountPercent} />}

        {/* RIGHT SIDE: NEW ARRIVAL */}
        {isNew && <NewArrivalBadge />}
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={[styles.name, { color: COLORS.text }]}>
          {product.name}
        </Text>

        <PriceDisplay product={product} />
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
