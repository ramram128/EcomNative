import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

import type { Product } from '../types/product';
import { getPriceDetails } from './utils/priceHelpers';

import { styles } from '../styles/details.styles';

type Props = {
  product: Product;
};

export const PriceDisplay: React.FC<Props> = ({ product }) => {
  const {
    showBoth,
    discountPercent,
    inrRegular,
    inrSale,
    finalPrice,
  } = useMemo(() => getPriceDetails(product), [product]);

  return (
    <View style={styles.container}>
      {showBoth ? (
        <View style={styles.priceRow}>
          {/* Regular price (striked) */}
          <Text style={styles.strikeText}>
            ₹{inrRegular}
          </Text>

          {/* Sale price (big & bold) */}
          <Text style={styles.salePriceText}>
            ₹{inrSale}
          </Text>

          {/* Discount */}
          <Text style={styles.discountText}>
            ({discountPercent}% OFF)
          </Text>
        </View>
      ) : (
        <Text style={styles.salePriceText}>
          ₹{finalPrice}
        </Text>
      )}
    </View>
  );
};
