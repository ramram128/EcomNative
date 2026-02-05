import { StyleSheet, Platform } from 'react-native';
import { COLORS, ACTIVE_LAYOUT } from '../constants/theme';

const isCrystal = ACTIVE_LAYOUT === 'crystal';

export const styles = StyleSheet.create({
  baseCard: {
    flex: 1,
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: isCrystal
      ? 'rgba(255, 255, 255, 0.12)'
      : COLORS.border,
    borderWidth: isCrystal ? 1 : 0,
    borderColor: isCrystal
      ? 'rgba(255, 255, 255, 0.2)'
      : 'transparent',
  },

  imageWrapper: {
    position: 'relative',
  },

  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },

  /* ================= BADGES ================= */

  badge: {
    position: 'absolute',
    top: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 20,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.4,
  },

  /* LEFT: DISCOUNT */
  discountBadgeLeft: {
    left: 8,
    backgroundColor: isCrystal
      ? 'rgba(255, 255, 255, 0.25)'
      : '#00000090',
    borderWidth: isCrystal ? 1 : 0,
    borderColor: 'rgba(255,255,255,0.35)',
  },

  /* RIGHT: NEW ARRIVAL */
  newBadgeRight: {
    right: 8,
    top: 8,
    backgroundColor: isCrystal
      ? 'rgba(255, 255, 255, 0.25)'
      : '#00000090',
    borderWidth: isCrystal ? 1 : 0,
    borderColor: 'rgba(255,255,255,0.35)'
  },

  /* ================= INFO ================= */

  info: {
    padding: 10,
  },

  name: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 0,
  },

  /* ================= PRICE ================= */

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },

  regularPrice: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'line-through',
    color: '#888',
  },

  salePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },

  offText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.income,
  },
});
