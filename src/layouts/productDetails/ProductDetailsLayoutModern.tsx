import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ProductDetailsLayoutProps } from './types';
import { styles } from '../../styles/create.styles';
import { Header } from '../../components/Header';
import { AttributeSelector } from '../../components/AttributeSelector';
import { RatingRow } from '../../components/RatingRow';
import { useShop } from '../../store/shopStore';
import { COLORS } from '../../constants/theme';

export default function ProductDetailsLayoutModern({
  product,
  navigation,
  loading,
  displayImage,
  selectedOptions,
  selectedVariation,
  onSelectOption,
  groupedProducts,
  onExternalPress,
  relatedProducts = [],
  reviews = [],
  fullVariations = [],
}: ProductDetailsLayoutProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const wished = isWishlisted(product.id);

  const ratingCount = reviews.length;

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  const isExternal = product.type === 'external';
  const isGrouped = product.type === 'grouped';

  const canAddToCart = useMemo(() => {
    if (isExternal || isGrouped) return false;
    if (product?.type === 'variable') return !!selectedVariation;
    return true;
  }, [product?.type, selectedVariation, isExternal, isGrouped]);

  // ✅ Price helpers
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

  // ✅ Price data with regular price + discount
  const priceData = useMemo(() => {
    let reg = selectedVariation?.regular_price || product.regular_price;
    let sale = selectedVariation?.price || product.price;

    const variations = fullVariations.length > 0 ? fullVariations : (product.variations || []);

    if (!selectedVariation && product.type === 'variable' && variations.length > 0 && typeof variations[0] === 'object') {
      const cheapestVar = variations.reduce((prev: any, curr: any) => {
        const prevPrice = toNumber(prev.price);
        const currPrice = toNumber(curr.price);
        if (isNaN(currPrice)) return prev;
        if (isNaN(prevPrice)) return curr;
        return currPrice < prevPrice ? curr : prev;
      });
      reg = cheapestVar.regular_price || cheapestVar.price;
      sale = cheapestVar.price;
    }

    const regNum = toNumber(reg);
    const saleNum = toNumber(sale);
    const isDiscounted = !isNaN(regNum) && !isNaN(saleNum) && regNum > saleNum;
    const percent = isDiscounted ? Math.round(((regNum - saleNum) / regNum) * 100) : 0;

    return {
      showBoth: isDiscounted,
      discountPercent: percent,
      regularPrice: formatINR(reg),
      finalPrice: formatINR(sale),
      isVariable: product.type === 'variable' && !selectedVariation,
    };
  }, [product, selectedVariation, fullVariations]);

  const handleAddToCart = () => {
    if (!canAddToCart) {
      Alert.alert('Select options', 'Please choose all options before adding to cart.');
      return;
    }
    addToCart(product, 1, selectedVariation || undefined);
    Alert.alert('Added to cart', `${product.name} added to cart.`);
  };

  const handleOrderNow = () => {
    if (!canAddToCart) {
      Alert.alert('Select options', 'Please choose all options before ordering.');
      return;
    }
    addToCart(product, 1, selectedVariation || undefined);
    navigation.navigate('Tabs', { screen: 'Cart' });
  };

  const renderStars = (rating: number) => (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={s <= rating ? "star" : "star-outline"}
          size={12}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Product Details" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.detailsScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: displayImage ?? undefined }}
              style={styles.productImage}
            />
            <TouchableOpacity
              style={styles.wishlistBtn}
              onPress={() => toggleWishlist(product)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={wished ? 'heart' : 'heart-outline'}
                size={20}
                color={wished ? COLORS.expense : COLORS.blackText}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle} numberOfLines={2}>
              {product.name}
            </Text>
            <RatingRow value={avgRating} count={ratingCount} />
          </View>

          {/* ✅ PRICE WITH REGULAR PRICE + DISCOUNT */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 10, flexWrap: 'wrap' }}>
            {priceData.isVariable && <Text style={{ color: COLORS.text + '80', fontSize: 14 }}>From </Text>}
            <Text style={styles.priceBig}>₹ {priceData.finalPrice}</Text>
            {priceData.showBoth && (
              <>
                <View style={{
                  backgroundColor: COLORS.primary + '18',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  marginLeft: 10,
                }}>
                  <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '800' }}>
                    -{priceData.discountPercent}%
                  </Text>
                </View>
                <Text style={{
                  fontSize: 16,
                  color: COLORS.text + '60',
                  textDecorationLine: 'line-through',
                  marginLeft: 10,
                }}>
                  ₹ {priceData.regularPrice}
                </Text>
              </>
            )}
          </View>

          <Text style={styles.categoryName}>
            {product.description?.replace(/<[^>]*>?/gm, '')}
          </Text>

          {product.type === 'variable' && product.attributes?.map((attr: any) => (
            <AttributeSelector
              key={attr.id || attr.name}
              attr={attr}
              selectedOptions={selectedOptions}
              onSelect={onSelectOption}
            />
          ))}

          {isGrouped && groupedProducts?.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Includes:</Text>
              {groupedProducts.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={styles.groupedItem}
                  onPress={() => navigation.push('ProductDetails', { product: child })}
                >
                  <Text style={styles.groupedItemName}>{child.name}</Text>
                  <Text style={styles.priceSmall}>₹ {child.price}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* REVIEWS */}
          <View style={{ marginTop: 30, borderTopWidth: 1, borderColor: COLORS.border, paddingTop: 20 }}>
            <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>
              Customer Reviews ({reviews.length})
            </Text>

            {reviews.length > 0 ? (
              reviews.map((item) => (
                <View key={item.id} style={{ marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: COLORS.blackText }}>{item.reviewer}</Text>
                    {renderStars(Number(item.rating))}
                  </View>
                  <Text style={{ fontSize: 12, color: COLORS.text + '60', marginVertical: 4 }}>
                    {new Date(item.date_created).toLocaleDateString()}
                  </Text>
                  <Text style={{ color: COLORS.blackText + '99', lineHeight: 18 }}>
                    {item.review?.replace(/<[^>]*>?/gm, '')}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: COLORS.text + '60', fontStyle: 'italic' }}>No reviews yet.</Text>
            )}
          </View>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <View style={{ marginTop: 30 }}>
              <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>
                More from this category
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedProducts.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={{ width: 140, marginRight: 12 }}
                    onPress={() => navigation.push('ProductDetails', { product: item })}
                  >
                    <Image
                      source={{ uri: item.images?.[0]?.src }}
                      style={{ width: '100%', height: 120, borderRadius: 12 }}
                    />
                    <Text numberOfLines={1} style={{ fontWeight: '600', marginTop: 5, color: COLORS.blackText }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
                      ₹ {item.price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.addToCartBar}>
        {isExternal ? (
          <TouchableOpacity
            style={[styles.actionBtn, styles.orderBtn, { width: '100%' }]}
            onPress={onExternalPress}
          >
            <Text style={styles.actionText}>{product.button_text || 'Buy Product'}</Text>
            <Ionicons name="open-outline" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.cartBtn,
                !canAddToCart && styles.actionBtnDisabled,
              ]}
              onPress={handleAddToCart}
              activeOpacity={0.9}
            >
              <Ionicons name="cart-outline" size={18} color={COLORS.white} />
              <Text style={styles.actionText}>
                {canAddToCart ? 'Add to Cart' : 'Select Options'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.orderBtn,
                !canAddToCart && styles.actionBtnDisabled,
              ]}
              onPress={handleOrderNow}
              activeOpacity={0.9}
            >
              <Ionicons name="flash-outline" size={18} color={COLORS.white} />
              <Text style={styles.actionText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}