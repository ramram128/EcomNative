import React, { useMemo, useCallback } from 'react';
import {
    FlatList,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Product, Variation } from '../../types/product';
import { SelectedSearchBar } from '../Searchbars';
import { JOY_COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');

/* =================== TYPES & INTERFACES =================== */
interface HomeLayoutProps {
    products: Product[];
    onPress: (product: Product) => void;
    refreshing: boolean;
    onRefresh: () => void;
    searchQuery: string;
    setSearchQuery: (text: string) => void;
}

type SectionItem =
    | { id: string; type: 'BANNER'; color: string[]; title: string; subtitle: string; isDark?: boolean }
    | { id: string; type: 'PRODUCTS'; categoryTitle: string; data: Product[]; columns: number; mode: 'grid' | 'scroll' };

/* =================== UTILS =================== */
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

/* =================== STYLISH PRODUCT CARD =================== */
const ProductCard = ({ product, onPress, numColumns = 2 }: { product: Product; onPress: () => void; numColumns: number }) => {
    const scale = numColumns > 2 ? (numColumns > 3 ? 0.72 : 0.85) : 1;

    const priceData = useMemo(() => {
        let reg = product.regular_price;
        let sale = product.sale_price || product.price;

        if (product.type === 'variable' && product.variations && product.variations.length > 0) {
            const cheapestVar = product.variations.reduce((prev: Variation, curr: Variation) => {
                const prevP = toNumber(prev.sale_price || prev.price);
                const currP = toNumber(curr.sale_price || curr.price);
                return currP < prevP ? curr : prev;
            });
            reg = cheapestVar.regular_price || cheapestVar.price;
            sale = cheapestVar.sale_price || cheapestVar.price;
        }

        const regNum = toNumber(reg);
        const saleNum = toNumber(sale);
        const isDiscounted = !isNaN(regNum) && !isNaN(saleNum) && regNum > saleNum;
        const percent = isDiscounted ? Math.round(((regNum - saleNum) / regNum) * 100) : 0;

        return {
            showBoth: isDiscounted,
            discountPercent: percent,
            inrSale: formatINR(sale),
            inrRegular: formatINR(reg),
            isVariable: product.type === 'variable'
        };
    }, [product]);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.cardBase}>
            <View style={styles.cardImageWrapper}>
                <Image
                    source={{ uri: product.images?.[0]?.src || 'https://via.placeholder.com/300' }}
                    style={styles.cardImage}
                />
                {product.tags && product.tags.length > 0 && (
                    <View style={styles.cardBadge}>
                        <Text style={styles.cardBadgeText}>{product.tags[0].name.toUpperCase()}</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                    <Text numberOfLines={1} style={[styles.cardName, { fontSize: 15 * scale, flex: 1 }]}>
                        {product.name}
                    </Text>
                    {priceData.showBoth && (
                        <View style={[styles.inlineDiscountBadge, { paddingHorizontal: 6 * scale }]}>
                            <Text style={[styles.inlineDiscountText, { fontSize: 10 * scale }]}>
                                -{priceData.discountPercent}%
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardPriceRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {priceData.isVariable && <Text style={{ fontSize: 10 * scale, color: '#888' }}>From </Text>}
                        <Text style={[styles.cardPrice, { fontSize: 17 * scale }]}>₹{priceData.inrSale}</Text>
                    </View>
                </View>

                {priceData.showBoth && numColumns < 4 && (
                    <Text style={{ fontSize: 11 * scale, color: '#999', textDecorationLine: 'line-through' }}>
                        ₹{priceData.inrRegular}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

/* =================== MAIN COMPONENT =================== */
export default function HomeGlass({ products, onPress, refreshing, onRefresh, searchQuery, setSearchQuery }: HomeLayoutProps) {

    // ✅ FIX: Stable Header — no dependency on searchQuery so FlatList won't remount header
    const renderHeader = useCallback(() => (
        <View style={{ marginTop: 10 }}>
            <Text style={styles.brandName}>EcomNative</Text>
            <SelectedSearchBar onChangeText={setSearchQuery} />
        </View>
    ), [setSearchQuery]);

    const sections = useMemo(() => {
        if (!products || products.length === 0) return [];

        const categoryMap: Record<string, Product[]> = {};
        products.forEach(p => {
            const catName = p.categories?.[0]?.name || 'Uncategorized';
            if (!categoryMap[catName]) categoryMap[catName] = [];
            categoryMap[catName].push(p);
        });

        const banners: Record<string, any> = {
            banner1: { color: [JOY_COLORS.primary, JOY_COLORS.secondary], title: "Unbox\nHappiness Today.", subtitle: "Flash Sale" },
            banner2: { color: ['#ffe173', '#e8c426'], title: "Vibe Checks &\nCozy Knits", subtitle: "40% OFF", isDark: true },
            banner3: { color: [JOY_COLORS.secondary, '#91002f'], title: "Join the\nJoyful Circle", subtitle: "Exclusive" },
        };

        const layoutOrder = [
            { type: 'BANNER', key: 'banner1' },
            { type: 'PRODUCTS', key: 'Demo', columns: 3, mode: 'scroll' },
            { type: 'BANNER', key: 'banner2' },
            { type: 'PRODUCTS', key: 'Demo2', columns: 3, mode: 'scroll' },
            { type: 'BANNER', key: 'banner3' },
            { type: 'PRODUCTS', key: 'Shoes', columns: 3, mode: 'grid' },
        ] as const;

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
                        mode: item.mode
                    });
                }
            }
        });
        return result;
    }, [products]);

    const renderItem = useCallback(({ item }: { item: SectionItem }) => {
        if (item.type === 'BANNER') {
            return (
                <LinearGradient colors={item.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
                    <View style={styles.bannerContent}>
                        <Text style={[styles.bannerBadge, item.isDark && { color: '#000', opacity: 0.6 }]}>{item.subtitle.toUpperCase()}</Text>
                        <Text style={[styles.bannerTitle, item.isDark && { color: JOY_COLORS.text }]}>{item.title}</Text>
                        <TouchableOpacity style={[styles.bannerBtn, item.isDark && { backgroundColor: JOY_COLORS.text }]}>
                            <Text style={[styles.bannerBtnText, { color: item.isDark ? '#fff' : JOY_COLORS.primary }]}>Shop Now</Text>
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
                    <Text style={styles.sectionTitle}>{item.categoryTitle}</Text>
                    <Text style={styles.seeAll}>See All →</Text>
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
        <FlatList
            data={sections}
            renderItem={renderItem}
            // ✅ FIX: Use the stable function here
            ListHeaderComponent={renderHeader}
            keyExtractor={(item) => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: JOY_COLORS.background }}
            contentContainerStyle={{ paddingBottom: 60, paddingTop: 10 }}
        />
    );
}

const styles = StyleSheet.create({
    brandName: { fontSize: 26, fontWeight: '900', color: JOY_COLORS.primary, textAlign: 'left', paddingHorizontal: 20, letterSpacing: 1, marginBottom: 6 },
    sectionWrapper: { marginBottom: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
    sectionTitle: { fontSize: 24, fontWeight: '900', color: JOY_COLORS.text, letterSpacing: -0.5 },
    seeAll: { color: JOY_COLORS.primary, fontWeight: '700' },
    productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
    horizontalListPadding: { paddingLeft: 20, paddingRight: 8 },
    banner: { marginHorizontal: 20, marginVertical: 15, borderRadius: 30, padding: 25, minHeight: 200, justifyContent: 'center', overflow: 'hidden' },
    bannerContent: { zIndex: 2 },
    bannerBadge: { color: '#fff', fontSize: 10, fontWeight: '800', marginBottom: 6, letterSpacing: 1 },
    bannerTitle: { color: '#fff', fontSize: 28, fontWeight: '900', lineHeight: 30, marginBottom: 15 },
    bannerBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 50, alignSelf: 'flex-start' },
    bannerBtnText: { fontWeight: '800', fontSize: 13 },
    decorCircle: { position: 'absolute', right: -40, bottom: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.15)' },
    cardBase: { marginBottom: 10 },
    cardImageWrapper: { width: '100%', aspectRatio: 1, borderRadius: 24, backgroundColor: JOY_COLORS.surface, overflow: 'hidden' },
    cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    cardBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: JOY_COLORS.tertiary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    cardBadgeText: { fontSize: 10, fontWeight: '800', color: JOY_COLORS.text },
    cardInfo: { paddingVertical: 10, paddingHorizontal: 4 },
    nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    cardName: { fontWeight: '700', color: JOY_COLORS.text },
    inlineDiscountBadge: { backgroundColor: '#e6f4ea', borderRadius: 6, paddingVertical: 2, marginLeft: 6 },
    inlineDiscountText: { color: '#1e8e3e', fontWeight: '800' },
    cardPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    cardPrice: { fontWeight: '900', color: JOY_COLORS.primary },
    addButton: { backgroundColor: JOY_COLORS.primary, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginTop: -2 },
});