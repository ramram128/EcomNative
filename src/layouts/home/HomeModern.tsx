import React, { useMemo, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  TextInput
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Product, Variation } from '../../types/product';

const { width } = Dimensions.get('window');

/* =================== THEME CONSTANTS (CRYSTAL LOOK) =================== */
const CRYSTAL_COLORS = {
  surface: "#0d0d1c",
  surfaceVariant: "rgba(36, 36, 58, 0.4)",
  primary: "#c39bff",
  secondary: "#70d6ff",
  tertiary: "#ff88b2",
  onSurface: "#e6e3f9",
  onSurfaceVariant: "#aba9be",
  outline: "rgba(117, 116, 135, 0.2)",
  glass: "rgba(255, 255, 255, 0.05)",
};

/* =================== TYPES & UTILS =================== */
interface HomeLayoutProps {
  products: Product[];
  onPress: (product: Product) => void;
  refreshing: boolean;
  onRefresh: () => void;
  searchQuery: string;
  setSearchQuery: (text: string) => void;
}

type SectionItem =
  | { id: string; type: 'HERO' }
  | { id: string; type: 'BANNER'; color: string[]; title: string; subtitle: string; isDark?: boolean }
  | { id: string; type: 'PRODUCTS'; categoryTitle: string; data: Product[]; columns: number; mode: 'grid' | 'scroll' };

const toNumber = (v: any): number => {
  if (v === undefined || v === null || v === '') return NaN;
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const formatINR = (value: any): string => {
  const n = toNumber(value);
  if (!Number.isFinite(n)) return String(value ?? '');
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
};

/* =================== CRYSTAL PRODUCT CARD =================== */
const ProductCard = ({ product, onPress, numColumns = 2 }: { product: Product; onPress: () => void; numColumns: number }) => {
  const scale = numColumns > 2 ? (numColumns > 3 ? 0.72 : 0.85) : 1;

  const priceData = useMemo(() => {
    let reg = product.regular_price;
    let sale = product.sale_price || product.price;

    if (product.type === 'variable' && (product.variations?.length ?? 0) > 0) {
      const cheapestVar = product.variations!.reduce((prev: Variation, curr: Variation) => {
        const prevP = toNumber(prev.sale_price || prev.price);
        const currP = toNumber(curr.sale_price || curr.price);
        return currP < prevP ? curr : prev;
      });
      reg = cheapestVar.regular_price || cheapestVar.price;
      sale = cheapestVar.sale_price || cheapestVar.price;
    }

    const regNum = toNumber(reg);
    const saleNum = toNumber(sale);
    return {
      isDiscounted: !isNaN(regNum) && regNum > saleNum,
      inrSale: formatINR(sale),
      isVariable: product.type === 'variable'
    };
  }, [product]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.cardBase}>
      <View style={styles.glassCardEffect}>
        <View style={styles.cardImageWrapper}>
          <Image
            source={{ uri: product.images?.[0]?.src || 'https://via.placeholder.com/300' }}
            style={styles.cardImage}
          />
          <TouchableOpacity style={styles.heartButton}>
            <Text style={{ color: CRYSTAL_COLORS.tertiary, fontSize: 16 }}>♥</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardInfo}>
          <Text numberOfLines={1} style={[styles.cardName, { fontSize: 15 * scale }]}>
            {product.name}
          </Text>
          <View style={styles.cardPriceRow}>
            <Text style={styles.categoryLabel}>{product.categories?.[0]?.name || 'Art'}</Text>
            <View style={styles.priceBadge}>
              <Text style={[styles.cardPrice, { fontSize: 14 * scale }]}>₹{priceData.inrSale}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* =================== MAIN COMPONENT =================== */
export default function HomeModern({ products, onPress, refreshing, onRefresh, searchQuery, setSearchQuery }: HomeLayoutProps) {

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.navRow}>
        <Text style={styles.brandName}>ECOMNATIVE</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search curated art..."
            placeholderTextColor="rgba(171, 169, 190, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
    </View>
  ), [searchQuery, setSearchQuery]);

  const sections = useMemo(() => {
    if (!products || products.length === 0) return [];

    const categoryMap: Record<string, Product[]> = {};
    products.forEach(p => {
      const catName = p.categories?.[0]?.name || 'New Arrivals';
      if (!categoryMap[catName]) categoryMap[catName] = [];
      categoryMap[catName].push(p);
    });

    const banners: Record<string, { color: string[]; title: string; subtitle: string; isDark?: boolean }> = {
      banner1: { color: [CRYSTAL_COLORS.primary, CRYSTAL_COLORS.secondary], title: "Ethereal\nCollections", subtitle: "New Season" },
      banner2: { color: ['#ffe173', '#e8c426'], title: "Curated Art &\nModern Vibes", subtitle: "40% OFF", isDark: true },
      banner3: { color: [CRYSTAL_COLORS.tertiary, '#91002f'], title: "Join the\nCrystal Circle", subtitle: "Exclusive" },
    };

    // ✅ layoutOrder: Interleave banners and product sections
    // Change the 'key' values below to match YOUR WooCommerce category names
    const layoutOrder = [
      { type: 'BANNER' as const, key: 'banner1' },
      { type: 'PRODUCTS' as const, key: 'Demo', columns: 3, mode: 'scroll' as const },
      { type: 'BANNER' as const, key: 'banner2' },
      { type: 'PRODUCTS' as const, key: 'Demo2', columns: 2, mode: 'grid' as const },
      { type: 'BANNER' as const, key: 'banner3' },
      { type: 'PRODUCTS' as const, key: 'Shoes', columns: 3, mode: 'scroll' as const },
    ];

    const result: SectionItem[] = [];
    layoutOrder.forEach((item, i) => {
      if (item.type === 'BANNER') {
        const b = banners[item.key];
        if (b) result.push({ id: `banner-${i}`, type: 'BANNER', ...b });
      } else {
        const catData = categoryMap[item.key] || [];
        if (catData.length > 0) {
          result.push({
            id: `prod-${i}`,
            type: 'PRODUCTS',
            categoryTitle: item.key,
            data: catData,
            columns: item.columns,
            mode: item.mode,
          });
        }
      }
    });
    return result;
  }, [products]);

  const renderItem = useCallback(({ item }: { item: SectionItem }) => {
    if (item.type === 'HERO') {
      return (
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['rgba(13,13,28,0.8)', 'transparent']}
            start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroTextOverlay}>
            <Text style={styles.heroTitle}>Ethereal {'\n'}<Text style={{ color: CRYSTAL_COLORS.primary }}>Collections</Text></Text>
            <TouchableOpacity style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Explore Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (item.type === 'BANNER') {
      return (
        <LinearGradient colors={item.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <Text style={[styles.bannerBadge, item.isDark && { color: '#000', opacity: 0.6 }]}>{item.subtitle.toUpperCase()}</Text>
            <Text style={[styles.bannerTitle, item.isDark && { color: '#1a1a2e' }]}>{item.title}</Text>
            <TouchableOpacity style={[styles.bannerBtn, item.isDark && { backgroundColor: '#1a1a2e' }]}>
              <Text style={[styles.bannerBtnText, { color: item.isDark ? '#fff' : CRYSTAL_COLORS.primary }]}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.decorCircle} />
        </LinearGradient>
      );
    }

    const horizontalCardWidth = (width - 32) / (item.columns + 0.2);

    return (
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{item.categoryTitle}</Text>
            <Text style={styles.sectionSubtitle}>Freshly curated for your space</Text>
          </View>
          <Text style={styles.seeAllText}>View All →</Text>
        </View>

        {item.mode === 'scroll' ? (
          <FlatList
            data={item.data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(p) => p.id.toString()}
            contentContainerStyle={styles.horizontalListPadding}
            renderItem={({ item: product }) => (
              <View style={{ width: horizontalCardWidth, marginRight: 15 }}>
                <ProductCard product={product} onPress={() => onPress(product)} numColumns={item.columns} />
              </View>
            )}
          />
        ) : (
          <View style={styles.productGrid}>
            {item.data.map((product, index) => (
              <View key={product.id.toString() || index} style={{ width: `${100 / item.columns}%`, padding: 8 }}>
                <ProductCard product={product} onPress={() => onPress(product)} numColumns={item.columns} />
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }, [onPress]);

  return (
    <View style={{ flex: 1, backgroundColor: CRYSTAL_COLORS.surface }}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandName: { color: CRYSTAL_COLORS.primary, fontSize: 20, fontWeight: '900', letterSpacing: 4 },
  searchContainer: { backgroundColor: CRYSTAL_COLORS.surfaceVariant, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, width: width * 0.5, borderWidth: 1, borderColor: CRYSTAL_COLORS.outline },
  searchInput: { color: CRYSTAL_COLORS.onSurface, fontSize: 12 },

  heroContainer: { height: 250, marginHorizontal: 20, borderRadius: 24, overflow: 'hidden', marginBottom: 30 },
  heroImage: { width: '100%', height: '100%' },
  heroTextOverlay: { position: 'absolute', bottom: 20, left: 20 },
  heroTitle: { color: '#fff', fontSize: 32, fontWeight: '800', lineHeight: 36 },
  heroBtn: { backgroundColor: CRYSTAL_COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 50, marginTop: 15, alignSelf: 'flex-start' },
  heroBtnText: { color: '#3f0f79', fontWeight: '800' },

  bannerContainer: { marginHorizontal: 20, marginVertical: 15, borderRadius: 30, padding: 25, minHeight: 200, justifyContent: 'center', overflow: 'hidden' },
  bannerContent: { zIndex: 2 },
  bannerBadge: { color: '#fff', fontSize: 10, fontWeight: '800', marginBottom: 6, letterSpacing: 1 },
  bannerTitle: { color: '#fff', fontSize: 28, fontWeight: '900', lineHeight: 30, marginBottom: 15 },
  bannerBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 50, alignSelf: 'flex-start' },
  bannerBtnText: { fontWeight: '800', fontSize: 13 },
  decorCircle: { position: 'absolute', right: -40, bottom: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.15)' },

  sectionWrapper: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { color: CRYSTAL_COLORS.onSurface, fontSize: 22, fontWeight: '800' },
  sectionSubtitle: { color: CRYSTAL_COLORS.onSurfaceVariant, fontSize: 12 },
  seeAllText: { color: CRYSTAL_COLORS.primary, fontWeight: '700', fontSize: 13 },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  horizontalListPadding: { paddingLeft: 20, paddingRight: 8 },
  cardBase: { width: '100%', marginBottom: 10 },
  glassCardEffect: { backgroundColor: CRYSTAL_COLORS.surfaceVariant, borderRadius: 20, padding: 10, borderWidth: 1, borderColor: CRYSTAL_COLORS.outline },
  cardImageWrapper: { width: '100%', aspectRatio: 1, borderRadius: 15, overflow: 'hidden', backgroundColor: '#1a1a2e' },
  cardImage: { width: '100%', height: '100%' },
  heartButton: { position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(13,13,28,0.5)', justifyContent: 'center', alignItems: 'center' },

  cardInfo: { marginTop: 10, paddingHorizontal: 4 },
  cardName: { color: CRYSTAL_COLORS.onSurface, fontWeight: '700', marginBottom: 6 },
  cardPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryLabel: { color: CRYSTAL_COLORS.onSurfaceVariant, fontSize: 11 },
  priceBadge: { backgroundColor: CRYSTAL_COLORS.surface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  cardPrice: { color: CRYSTAL_COLORS.primary, fontWeight: '900' },
});