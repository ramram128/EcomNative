import React, { useMemo } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants/theme';
import ProductCard from '../../components/ProductCard';

const { width } = Dimensions.get('window');

interface HomeLayoutProps {
  products: any[];
  onPress: (product: any) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function HomeCrystal({
  products,
  onPress,
  refreshing,
  onRefresh
}: HomeLayoutProps) {

  const sections = useMemo(() => {
    if (!products || products.length === 0) return [];

    // 1️⃣ Grouping Logic
    const categoryMap: Record<string, any[]> = {};
    products.forEach(product => {
      const catName = product.categories?.[0]?.name;
      if (catName) {
        if (!categoryMap[catName]) categoryMap[catName] = [];
        categoryMap[catName].push(product);
      }
    });

    // 2️⃣ Banner Config
    const banners: any = {
      banner1: { color: COLORS.primary, title: "Flash Sale", subtitle: "Unbox Happiness Today" },
      banner2: { color: '#b81742', title: "Vibe Check", subtitle: "Curated Daily Finds" },
      banner3: { color: '#705d00', title: "Joyful Circle", subtitle: "Join for exclusive drops" },
    };

    // 3️⃣ Layout Order with "Mode" control
    // mode: 'grid' (vertical) OR 'scroll' (horizontal)
    const layoutOrder = [
      { type: 'BANNER', key: 'banner1' },
      { type: 'PRODUCTS', key: 'Demo', columns: 3, mode: 'scroll' }, // 👈 Swipeable
      { type: 'BANNER', key: 'banner2' },
      { type: 'PRODUCTS', key: 'Demo2', columns: 2, mode: 'grid' },  // 👈 Static Grid
      { type: 'BANNER', key: 'banner3' },
      { type: 'PRODUCTS', key: 'Shoes', columns: 1, mode: 'grid' },
    ];

    const result: any[] = [];

    for (let i = 0; i < layoutOrder.length; i++) {
      const item = layoutOrder[i];

      if (item.type === 'BANNER') {
        const banner = banners[item.key];
        if (banner) result.push({ id: `banner-${i}`, type: 'BANNER', ...banner });
      }

      else if (item.type === 'PRODUCTS') {
        const categoryProducts = categoryMap[item.key] || [];
        if (categoryProducts.length === 0) continue;

        const cols = item.columns || 2;
        const isGrid = item.mode === 'grid';

        // Only use "Perfect Count" if it's a static grid. 
        // If it's a scroll, show ALL products.
        const displayData = isGrid
          ? categoryProducts.slice(0, Math.floor(categoryProducts.length / cols) * cols)
          : categoryProducts;

        result.push({
          id: `products-${i}`,
          type: 'PRODUCTS',
          categoryTitle: item.key,
          data: displayData,
          columns: cols,
          mode: item.mode || 'grid'
        });
      }
    }
    return result;
  }, [products]);

  // 🔹 RENDER COMPONENTS
  const renderItem = ({ item }: any) => {
    // --- BANNER RENDER ---
    if (item.type === 'BANNER') {
      return (
        <LinearGradient
          colors={[item.color, item.color + 'DD']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerBadge}>LIMITED TIME</Text>
            <Text style={styles.bannerTitle}>{item.title}</Text>
            <Text style={styles.bannerSub}>{item.subtitle}</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={[styles.bannerBtnText, { color: item.color }]}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.decorCircle} />
        </LinearGradient>
      );
    }

    // --- PRODUCTS RENDER ---
    if (item.type === 'PRODUCTS') {
      return (
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>{item.categoryTitle}</Text>

          {item.mode === 'scroll' ? (
            /* 🔥 HORIZONTAL DRAG MODE */
            <FlatList
              data={item.data}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(p) => p.id.toString()}
              contentContainerStyle={styles.horizontalListPadding}
              renderItem={({ item: product }) => (
                <View style={styles.horizontalCard}>
                  <ProductCard product={product} onPress={() => onPress(product)} />
                </View>
              )}
            />
          ) : (
            /* 🧱 STATIC GRID MODE */
            <View style={styles.productGrid}>
              {item.data.map((product: any, index: number) => (
                <View
                  key={product?.id?.toString() || index}
                  style={{ width: `${100 / item.columns}%`, padding: 6 }}
                >
                  <ProductCard product={product} onPress={() => onPress(product)} />
                </View>
              ))}
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background || '#fff8f6' },
  listPadding: { paddingBottom: 40 },
  sectionWrapper: { marginBottom: 15 },
  sectionTitle: {
    fontSize: 20, fontWeight: '900', color: COLORS.text || '#000',
    marginLeft: 16, marginTop: 10, marginBottom: 12, letterSpacing: 0.5,
  },
  /* Grid Styles */
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },

  /* Horizontal Styles */
  horizontalListPadding: { paddingLeft: 16, paddingRight: 8 },
  horizontalCard: {
    width: width * 0.42, // Shows roughly 2.2 cards so user knows to swipe
    marginRight: 12,
    marginBottom: 10,
  },
  /* Banner Styles */
  banner: {
    margin: 16, borderRadius: 24, padding: 24, minHeight: 180,
    justifyContent: 'center', overflow: 'hidden', elevation: 4,
  },
  bannerContent: { zIndex: 2, maxWidth: '70%' },
  bannerBadge: { color: '#fff', fontSize: 10, fontWeight: '800', marginBottom: 4 },
  bannerTitle: { color: '#fff', fontSize: 32, fontWeight: '900', lineHeight: 34 },
  bannerSub: { color: '#fff', fontSize: 14, opacity: 0.8, marginTop: 4, marginBottom: 16 },
  bannerBtn: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 50, alignSelf: 'flex-start' },
  bannerBtnText: { fontWeight: '800', fontSize: 13 },
  decorCircle: {
    position: 'absolute', right: -30, bottom: -30, width: 150, height: 150,
    borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.15)', zIndex: 1,
  },
});