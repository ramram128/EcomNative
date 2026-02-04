import { StyleSheet, Platform, Dimensions } from 'react-native';
import { COLORS, ACTIVE_LAYOUT } from '../constants/theme';

const { height, width } = Dimensions.get('window');
const isCrystal = ACTIVE_LAYOUT === 'crystal';

export const styles = StyleSheet.create({
  // MAIN CONTAINERS
  mainContainer: { 
    flex: 1, 
    backgroundColor: isCrystal ? '#000' : '#FFFFFF' 
  },
  
  // IMAGE SECTION
  imageContainer: {
    width: '100%',
    height: isCrystal ? height * 0.75 : 400,
    backgroundColor: isCrystal ? 'transparent' : '#F9F9F9',
    position: 'relative',
  },
  fullBgImage: { 
    width: '100%', 
    height: '100%',
    resizeMode: 'cover'
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: isCrystal ? 'rgba(0,0,0,0.35)' : 'transparent',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },

  // TOP NAVIGATION
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  glassCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isCrystal ? 'rgba(255,255,255,0.3)' : '#EEE',
    backgroundColor: isCrystal ? 'transparent' : '#FFF',
    ...(!isCrystal && Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    })),
  },

  // PRODUCT INFO CARD
  scrollContent: { paddingBottom: 140 },
  cardWrapper: {
    marginHorizontal: isCrystal ? 16 : 0,
    marginTop: isCrystal ? 0 : -20,
    borderRadius: isCrystal ? 30 : 25,
    overflow: 'hidden',
    borderWidth: isCrystal ? 1 : 0,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: isCrystal ? 'transparent' : '#FFF',
    padding: 24,
  },

  // TEXT STYLES
  productTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: isCrystal ? '#FFF' : '#000',
  },
  categoryTitle: {
    marginTop: 4,
    color: isCrystal ? 'rgba(255,255,255,0.5)' : '#888',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceText: {
    fontSize: 24,
    fontWeight: isCrystal ? '300' : '800',
    color: isCrystal ? '#FFF' : '#000',
    marginVertical: 14,
  },

  // ATTRIBUTES / VARIATIONS
  attrContainer: { marginVertical: 15 },
  attrRow: { marginBottom: 14 },
  attrLabel: {
    color: isCrystal ? '#FFF' : '#000',
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.6,
    marginBottom: 8,
  },
  optionsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: isCrystal ? 'rgba(255,255,255,0.1)' : '#F5F5F5',
  },
  activeChip: { 
    backgroundColor: isCrystal ? '#FFF' : COLORS.primary 
  },
  optionText: { color: isCrystal ? '#FFF' : '#444' },
  activeText: { 
    color: isCrystal ? '#000' : '#FFF', 
    fontWeight: '800' 
  },

  // DESCRIPTION
  descriptionTile: {
    backgroundColor: isCrystal ? 'transparent' : '#F5F5F5',
    padding: isCrystal ? 0 : 20,
    borderRadius: 20,
    marginTop: 10,
  },
  descBody: {
    color: isCrystal ? '#ccc' : '#444',
    lineHeight: 22,
    fontSize: 15,
  },

  // FOOTER & ACTION BUTTON
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: isCrystal ? 'transparent' : '#FFF',
    borderTopWidth: isCrystal ? 0 : 1,
    borderTopColor: '#EEE',
  },
  actionPill: {
    width: isCrystal ? width * 0.85 : width - 40,
    height: 64,
    borderRadius: isCrystal ? 32 : 15,
    padding: isCrystal ? 6 : 0,
    overflow: 'hidden',
    borderWidth: isCrystal ? 1 : 0,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: isCrystal ? 'transparent' : COLORS.primary,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: isCrystal ? '#FFF' : 'transparent',
    borderRadius: isCrystal ? 28 : 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: isCrystal ? '#000' : '#FFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  androidGlass: { backgroundColor: 'rgba(255,255,255,0.08)' },
  
    backgroundWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    heroSpacing: {
      height: 350, // Replaces { height: 350 } in JSX
    },
    attributeGroup: {
      marginBottom: 15,
    },

    disabledBtn: {
      opacity: 0.5, // Replaces { opacity: 0.5 } in JSX
    },
    
    container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  strikeText: {
    textDecorationLine: 'line-through',
    fontSize: 16,
    marginLeft: 5,
    // No color needed, styles.categoryTitle already handles it!
  },
  discountText: {
    fontSize: 14,
    color: '#16a34a', // Standard green for discounts, or use COLORS.income
    marginLeft: 5,
  }
  
});