import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

import { ProductDetailsLayoutProps } from './types';
import { Header } from '../../components/Header';
import { AttributeSelector } from '../../components/AttributeSelector';
import { RatingRow } from '../../components/RatingRow';
import { useShop } from '../../store/shopStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, JOY_COLORS } from '../../constants/theme';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProductDetailsGlass({
  product,
  navigation,
  displayImage,
  selectedOptions,
  selectedVariation,
  onSelectOption,
  relatedProducts = [],
  reviews = [],
  fullVariations = [],
  onAddReview,
  currentUserEmail,
  onUpdateReview,
  onDeleteReview,
}: ProductDetailsLayoutProps) {
  const { addToCart, toggleWishlist, isWishlisted, isAuthenticated } = useShop();
  const wished = isWishlisted(product.id);
  const insets = useSafeAreaInsets();
  const TAB_HEIGHT = 65;

  // Review Form State
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Review State
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editText, setEditText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReviewSubmit = async () => {
    if (newRating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }
    if (!newReviewText.trim()) {
      Alert.alert('Review Required', 'Please enter your review.');
      return;
    }

    if (onAddReview) {
      setIsSubmitting(true);
      try {
        await onAddReview(newRating, newReviewText);
        setNewRating(0);
        setNewReviewText('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Safe numeric conversion
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

  const priceData = useMemo(() => {
    let reg = selectedVariation?.regular_price || product.regular_price;
    let sale = selectedVariation?.price || product.price;

    // If it's a variable product and no variation is selected, aggregate
    // Use fullVariations if provided, otherwise fallback to product.variations
    const variations = fullVariations.length > 0 ? fullVariations : (product.variations || []);

    if (!selectedVariation && product.type === 'variable' && variations.length > 0 && typeof variations[0] === 'object') {
      const cheapestVar = variations.reduce((prev: any, curr: any) => {
        const prevPrice = toNumber(prev.price);
        const currPrice = toNumber(curr.price);
        // Fallback to avoid NaN issues if price is missing
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
      regNum,
      saleNum,
      isVariable: product.type === 'variable' && !selectedVariation
    };
  }, [product, selectedVariation]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length;
  }, [reviews]);

  console.log('[DEBUG] Final Price Data:', priceData);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariation || undefined);
    Alert.alert('Added to cart', `${product.name} added to cart.`);
  };

  const renderStars = (rating: number) => {
    return (
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
  };

  const ProductCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
    const scale = 0.85; // Fixed scale for horizontal list

    const priceData = useMemo(() => {
      let reg = item.regular_price;
      let sale = item.sale_price || item.price;

      // Handle variable products carefully
      if (item.type === 'variable' && item.variations && item.variations.length > 0) {
        // Only attempt to reduce if variations are objects
        if (typeof item.variations[0] === 'object') {
          const cheapestVar = item.variations.reduce((prev: any, curr: any) => {
            const prevP = toNumber(prev.sale_price || prev.price);
            const currP = toNumber(curr.sale_price || curr.price);
            return currP < prevP ? curr : prev;
          });
          reg = cheapestVar.regular_price || cheapestVar.price;
          sale = cheapestVar.sale_price || cheapestVar.price;
        }
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
        isVariable: item.type === 'variable'
      };
    }, [item]);

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.cardBase}>
        <View style={styles.cardImageWrapper}>
          <Image
            source={{ uri: item.images?.[0]?.src || 'https://via.placeholder.com/300' }}
            style={styles.cardImage}
          />
          {item.tags && item.tags.length > 0 && (
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>{item.tags[0].name.toUpperCase()}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={[styles.cardName, { fontSize: 15 * scale, flex: 1 }]}>
              {item.name}
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

          {priceData.showBoth && (
            <Text style={{ fontSize: 11 * scale, color: '#999', textDecorationLine: 'line-through' }}>
              ₹{priceData.inrRegular}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="JoyfulShop" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_HEIGHT + insets.bottom + 100 }}
      >
        {/* IMAGE */}
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: displayImage ?? undefined }}
            style={styles.image}
          />
          <TouchableOpacity
            onPress={() => toggleWishlist(product)}
            style={styles.wishlist}
          >
            <Ionicons
              name={wished ? 'heart' : 'heart-outline'}
              size={20}
              color={wished ? '#E53935' : '#333'}
            />
          </TouchableOpacity>
        </View>

        {/* INFO CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>{product.name}</Text>
          <RatingRow value={avgRating} count={reviews.length} />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            {priceData.isVariable && <Text style={{ color: '#888', fontSize: 14 }}>From </Text>}
            <Text style={styles.price}>₹ {priceData.finalPrice}</Text>
            {priceData.showBoth && (
              <>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{priceData.discountPercent}%</Text>
                </View>
                <Text style={styles.regularPrice}>₹ {priceData.regularPrice}</Text>
              </>
            )}
          </View>

          <Text style={styles.desc}>
            {product.description?.replace(/<[^>]*>?/gm, '')}
          </Text>
        </View>

        {/* ATTRIBUTES */}
        {product.type === 'variable' && (
          <View style={styles.card}>
            {product.attributes?.map((attr: any) => (
              <AttributeSelector
                key={attr.id || attr.name}
                attr={attr}
                selectedOptions={selectedOptions}
                onSelect={onSelectOption}
              />
            ))}
          </View>
        )}

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Similar Products</Text>
              <Text style={styles.seeAll}>See All →</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListPadding}
            >
              {relatedProducts.map((item) => (
                <View key={item.id} style={{ width: (width - 32) / 3.2, marginRight: 15 }}>
                  <ProductCard
                    item={item}
                    onPress={() => navigation.push('ProductDetails', { product: item })}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* REVIEWS */}
        <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>

          {/* ADD REVIEW FORM */}
          <View style={styles.reviewForm}>
            <Text style={styles.formTitle}>Add a Review</Text>
            {isAuthenticated ? (
              <>
                <View style={styles.starSelector}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <TouchableOpacity key={s} onPress={() => setNewRating(s)}>
                      <Ionicons
                        name={s <= newRating ? "star" : "star-outline"}
                        size={20}
                        color="#FFD700"
                        style={{ marginRight: 8 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Write your review here..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  value={newReviewText}
                  onChangeText={setNewReviewText}
                />
                <TouchableOpacity
                  style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
                  onPress={handleReviewSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>Submit Review</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.loginPrompt}>
                <Ionicons name="lock-closed-outline" size={24} color="#666" />
                <Text style={styles.loginPromptText}>Please log in to add a review</Text>
              </View>
            )}
          </View>

          {reviews.length > 0 ? (
            reviews.map((item) => {
              const isOwnReview = currentUserEmail && item.reviewer_email &&
                currentUserEmail.toLowerCase() === item.reviewer_email.toLowerCase();
              const isEditing = editingReviewId === item.id;

              return (
                <View key={item.id} style={styles.reviewItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: 'bold' }}>{item.reviewer}</Text>
                      {!isEditing && renderStars(Number(item.rating))}
                    </View>
                    {isOwnReview && !isEditing && (
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingReviewId(item.id);
                            setEditRating(Number(item.rating));
                            setEditText(item.review?.replace(/<[^>]*>?/gm, '') || '');
                          }}
                          style={styles.reviewActionBtn}
                        >
                          <Ionicons name="create-outline" size={16} color="#1e8e3e" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              'Delete Review',
                              'Are you sure you want to delete this review?',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Delete',
                                  style: 'destructive',
                                  onPress: () => onDeleteReview?.(item.id),
                                },
                              ]
                            );
                          }}
                          style={styles.reviewActionBtn}
                        >
                          <Ionicons name="trash-outline" size={16} color="#E53935" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {isEditing ? (
                    <View style={{ marginTop: 8 }}>
                      <View style={styles.starSelector}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <TouchableOpacity key={s} onPress={() => setEditRating(s)}>
                            <Ionicons
                              name={s <= editRating ? "star" : "star-outline"}
                              size={24}
                              color="#FFD700"
                              style={{ marginRight: 6 }}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                      <TextInput
                        style={styles.reviewInput}
                        value={editText}
                        onChangeText={setEditText}
                        multiline
                        numberOfLines={3}
                        placeholder="Edit your review..."
                        placeholderTextColor="#999"
                      />
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                          style={[styles.submitBtn, { flex: 1 }, isUpdating && styles.disabledBtn]}
                          disabled={isUpdating}
                          onPress={async () => {
                            if (editRating === 0) {
                              Alert.alert('Rating Required', 'Please select a star rating.');
                              return;
                            }
                            setIsUpdating(true);
                            try {
                              await onUpdateReview?.(item.id, editRating, editText);
                              setEditingReviewId(null);
                            } finally {
                              setIsUpdating(false);
                            }
                          }}
                        >
                          {isUpdating ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text style={styles.submitBtnText}>Save</Text>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.cancelBtn, { flex: 1 }]}
                          onPress={() => setEditingReviewId(null)}
                        >
                          <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <Text style={{ color: '#666', marginTop: 4 }}>
                      {item.review?.replace(/<[^>]*>?/gm, '')}
                    </Text>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={{ color: '#999', marginTop: 8 }}>No reviews yet</Text>
          )}
        </View>
      </ScrollView>

      {/* 🔥 GLASS FLOATING BAR */}
      <View style={[
        styles.floatingBar,
        { bottom: TAB_HEIGHT + insets.bottom + 10 }
      ]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={20}
            reducedTransparencyFallbackColor="white"
          />
        ) : (
          <LinearGradient
            colors={[COLORS.background + 'CC', COLORS.background + 'EE']}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.floatingContent}>
          <Text style={styles.floatingPrice}>₹ {priceData.finalPrice}</Text>
          <TouchableOpacity
            onPress={handleAddToCart}
            style={styles.cartBtn}
          >
            <Ionicons name="cart-outline" size={18} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 8, fontWeight: 'bold' }}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background + '80',
  },
  imageWrap: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 320,
  },
  wishlist: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 50,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E53935',
  },
  regularPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  discountBadge: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 10,
  },
  discountText: {
    color: '#1e8e3e',
    fontSize: 12,
    fontWeight: '800',
  },
  desc: {
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: JOY_COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  seeAll: {
    color: JOY_COLORS.primary,
    fontWeight: '700',
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionWrapper: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12
  },
  horizontalListPadding: { paddingLeft: 20, paddingRight: 8 },
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
  floatingBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 65,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  floatingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  floatingPrice: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#E53935',
  },
  cartBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewForm: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  starSelector: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loginPromptText: {
    color: '#666',
    marginLeft: 8,
    fontSize: 14,
  },
  reviewActionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  cancelBtn: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#666',
    fontWeight: '700',
    fontSize: 15,
  },
});