import { StyleSheet, Platform } from "react-native";
import { COLORS, ACTIVE_LAYOUT } from "../constants/theme"; // Import Master Switches

const isCrystal = ACTIVE_LAYOUT === "crystal";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Crystal uses a dark version of the theme, Bento uses the light version
    backgroundColor: isCrystal ? "#000" : COLORS.background,
  },
  
  // Header Styles
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: isCrystal ? 40 : 24, // More space for Crystal
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
    color: isCrystal ? COLORS.white : COLORS.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: isCrystal ? COLORS.white : COLORS.text,
  },

  // Grid/List Styles
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 40,
  },
  cardWrapper: {
    flex: 1,
    padding: 6, // Spacing between tiles
  },

  // Product Card Base
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    // --- Dynamic Card Styling ---
    backgroundColor: isCrystal ? "rgba(255, 255, 255, 0.12)" : COLORS.card,
    borderWidth: isCrystal ? 1 : 0,
    borderColor: "rgba(255, 255, 255, 0.2)",
    
    // Bento Shadow (Modern only)
    ...(!isCrystal && Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    })),
  },

  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  
  info: {
    padding: 12,
  },

  name: {
    fontWeight: '700',
    fontSize: 14,
    color: isCrystal ? COLORS.white : COLORS.text,
  },

  price: {
    marginTop: 4,
    fontWeight: '800',
    fontSize: 15,
    color: isCrystal ? COLORS.white : COLORS.primary,
    opacity: isCrystal ? 0.9 : 1,
  },

  // Helper for Android Glass
  androidGlassOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isCrystal ? "#000" : COLORS.background,
  },
});