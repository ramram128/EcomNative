import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { Product } from '../types/product';
import { COLORS, ACTIVE_LAYOUT } from '../constants/theme';
import { BlurView } from '@react-native-community/blur';

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

const ProductCard = ({ product, onPress }: Props) => {
  const isCrystal = ACTIVE_LAYOUT === 'crystal';

  const hasVariationAttribute = !!product.attributes?.some((attr) => attr.variation);
  const isVariableWithVariation = product.type === 'variable' && hasVariationAttribute;

  const firstVariation = isVariableWithVariation ? product.variations?.[0] : undefined;

  const displaySalesPrice =
    firstVariation?.sale_price && firstVariation.sale_price !== ''
      ? firstVariation.sale_price
      : product.price;

  const displayRegularPrice =
    firstVariation?.regular_price && firstVariation.regular_price !== ''
      ? firstVariation.regular_price
      : product.regular_price;

  const { showBothPrices, discountPercent, inrRegular, inrSale } = useMemo(() => {
    const regNum = toNumber(displayRegularPrice);
    const saleNum = toNumber(displaySalesPrice);

    const both =
      !!displayRegularPrice &&
      !!displaySalesPrice &&
      String(displayRegularPrice) !== String(displaySalesPrice) &&
      Number.isFinite(regNum) &&
      Number.isFinite(saleNum) &&
      regNum > saleNum;

    const percent =
      both && regNum > 0
        ? Math.round(((regNum - saleNum) / regNum) * 100)
        : 0;

    return {
      showBothPrices: both,
      discountPercent: percent,
      inrRegular: formatINR(displayRegularPrice),
      inrSale: formatINR(displaySalesPrice),
    };
  }, [displayRegularPrice, displaySalesPrice]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.baseCard,
        isCrystal ? styles.crystalContainer : styles.bentoContainer,
      ]}
      activeOpacity={0.85}
    >
      {/* 💎 Glass effect only in Crystal layout */}
      {isCrystal &&
        (Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={10}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidGlass]} />
        ))}

      <View>
        <Image source={{ uri: product.images?.[0]?.src }} style={styles.image} />

        {/* 🔥 Discount badge like Flipkart */}
        {showBothPrices && discountPercent > 0 && (
          <View
            style={[
              styles.badge,
              isCrystal ? styles.badgeCrystal : styles.badgeBento,
            ]}
          >
            <Text style={styles.badgeText}>{discountPercent}% OFF</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={[
            styles.name,
            { color: isCrystal ? COLORS.white : COLORS.text },
          ]}
        >
          {product.name}
        </Text>

        {/* ✅ Prices in same line + strike regular + discount text */}
        <View style={styles.priceRow}>
          {showBothPrices ? (
            <>
              <Text
                style={[
                  styles.regularPrice,
                  {
                    color: isCrystal
                      ? 'rgba(255,255,255,0.75)'
                      : (COLORS.gray ?? 'rgba(0,0,0,0.55)'),
                  },
                ]}
              >
                ₹{inrRegular}
              </Text>

              <Text
                style={[
                  styles.salePrice,
                  { color: isCrystal ? COLORS.white : COLORS.primary },
                ]}
              >
                ₹{inrSale}
              </Text>

              {/* optional small green-ish text (uses your COLORS if exists) */}
              {discountPercent > 0 && (
                <Text
                  style={[
                    styles.offText,
                    { color: isCrystal ? 'rgba(255,255,255,0.9)' : (COLORS.success ?? '#16a34a') },
                  ]}
                >
                  {'  '}({discountPercent}% off)
                </Text>
              )}
            </>
          ) : (
            <Text
              style={[
                styles.salePrice,
                { color: isCrystal ? COLORS.white : COLORS.primary },
              ]}
            >
              ₹{formatINR(displaySalesPrice || displayRegularPrice)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Shared styles for both designs
  baseCard: {
    flex: 1,
    margin: 5,
    borderRadius: 16,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },

  // Badge
  badge: {
    position: 'absolute',
    left: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeBento: {
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  badgeCrystal: {
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.3,
  },

  info: { padding: 12 },
  name: { fontWeight: '700', fontSize: 14, marginBottom: 6 },

  // ✅ Price row
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  regularPrice: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginRight: 8,
    lineHeight: 18,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  offText: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.95,
  },

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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
