import { StyleSheet, Platform } from "react-native";
import { COLORS, ACTIVE_LAYOUT } from "../constants/theme"; // Import Master Switches

const isCrystal = ACTIVE_LAYOUT === "crystal";

export const styles = StyleSheet.create({

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

  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    // Modern rounded pill shape
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
    
    // Theme-based styling
    backgroundColor: isCrystal 
      ? 'rgba(255, 255, 255, 0.2)' // Frosted glass for Crystal
      : '#388e3c',                 // Solid Green for Bento/Standard
      
    // Add a slight blur/border for Crystal mode
    borderWidth: isCrystal ? 1 : 0,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  discountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
})