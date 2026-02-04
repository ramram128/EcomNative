// src/components/product/PriceDisplay.tsx
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Product } from '../types/product';
import { getPriceDetails } from './utils/priceHelpers';
import { styles } from '../styles/details.styles';
import { COLORS } from '../constants/theme';

export const PriceDisplay = ({ product }: { product: Product}) => {
  const { showBoth, discountPercent, inrRegular, inrSale, finalPrice } = useMemo(() => getPriceDetails(product), [product]);

  return (
    <View style={styles.container}>
      {showBoth ? (
        <>
          <Text style={[styles.priceText, { color:  COLORS.shadow }]}>
            ₹{inrRegular}
          </Text>
          <Text style={[styles.categoryTitle, { color:COLORS.primary }]}>
            ₹{inrSale}
          </Text>
          <Text style={[styles.activeText, { color: COLORS.income }]}>
             ({discountPercent}% off)
          </Text>
        </>
      ) : (
        <Text style={[styles.priceText, { color:COLORS.primary }]}>
          ₹{finalPrice}
        </Text>
      )}
    </View>
  );
};