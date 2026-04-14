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
    isVariable, // ✅ Now using the flag from our updated helper
  } = useMemo(() => getPriceDetails(product), [product]);

  return (
    <View style={styles.container}>
      <View style={styles.priceRow}>
        {/* 1. Show "From" if it's a variable product to attract customers */}
        {isVariable && (
          <Text style={[styles.salePriceText, { fontSize: 12, fontWeight: '400' }]}>
            From
          </Text>
        )}

        {showBoth ? (
          <>
            {/* 2. Sale price (Cheapest variation's sale price) */}
            <Text style={styles.salePriceText}>
              ₹{inrSale}
            </Text>

            {/* 3. Regular price (Cheapest variation's regular price - striked) */}
            <Text style={[styles.strikeText, {}]}>
              ₹{inrRegular}
            </Text>

            {/* 4. Discount badge text */}
            <Text style={[styles.discountText]}>
              ({discountPercent}% OFF)
            </Text>
          </>
        ) : (
          /* 5. Fallback for non-discounted items or simple products */
          <Text style={styles.salePriceText}>
            ₹{finalPrice}
          </Text>
        )}
      </View>
    </View>
  );
};