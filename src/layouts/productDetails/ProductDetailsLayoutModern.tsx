// src/layouts/productDetails/ProductDetailsLayoutModern.tsx
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

import { useShop } from '../../store/shopStore';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const RatingRow = ({ value, count }: { value: number; count: number }) => {
  const rating = clamp(value, 0, 5);
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <View style={styles.ratingRow}>
      <View style={styles.starsRow}>
        {Array.from({ length: full }).map((_, i) => (
          <Ionicons key={`f-${i}`} name="star" size={16} color="#F5A623" />
        ))}
        {hasHalf && <Ionicons name="star-half" size={16} color="#F5A623" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Ionicons key={`e-${i}`} name="star-outline" size={16} color="#F5A623" />
        ))}
      </View>

      <Text style={styles.ratingText}>
        {rating.toFixed(1)}
        {count > 0 ? ` (${count})` : ''}
      </Text>
    </View>
  );
};

export default function ProductDetailsLayoutModern({
  product,
  navigation,
  displayImage,
  selectedOptions,
  selectedVariation,
  onSelectOption,
}: ProductDetailsLayoutProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const wished = isWishlisted(product.id);

  // ✅ WooCommerce uses "average_rating"
  const avgRating = Number(product?.avg_rating ?? 0);
  const ratingCount = Number(product?.rating_count ?? 0);

  // ✅ Variable product: require variation selection before add to cart
  const canAddToCart = useMemo(() => {
    if (product?.type === 'variable') return !!selectedVariation;
    return true;
  }, [product?.type, selectedVariation]);

  const finalPrice = selectedVariation?.price || product.price;

  const handleAddToCart = () => {
    if (!canAddToCart) {
      Alert.alert('Select options', 'Please choose all options before adding to cart.');
      return;
    }

    // ✅ Add to cart store
    addToCart(product, 1);

    Alert.alert('Added to cart', `${product.name} added to cart.`);
  };

  const handleOrderNow = () => {
    if (!canAddToCart) {
      Alert.alert('Select options', 'Please choose all options before ordering.');
      return;
    }

    // ✅ Usually: add to cart then go cart/checkout
    addToCart(product, 1);

    navigation.navigate('Tabs', { screen: 'Cart' });
  };

  return (
    <View style={styles.container}>
      <Header title="Product Details" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.detailsScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* IMAGE + WISHLIST */}
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
                color={wished ? '#E53935' : '#333'}
              />
            </TouchableOpacity>
          </View>

          {/* NAME + RATING (same row) */}
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle} numberOfLines={2}>
              {product.name}
            </Text>

            <RatingRow
              value={Number.isFinite(avgRating) ? avgRating : 0}
              count={Number.isFinite(ratingCount) ? ratingCount : 0}
            />
          </View>

          {/* PRICE */}
          <Text style={styles.priceBig}>₹ {finalPrice}</Text>

          {/* DESCRIPTION */}
          <Text style={styles.categoryName}>{product.description}</Text>

          {/* ATTRIBUTES */}
          {product.attributes?.map((attr: any) => (
            <AttributeSelector
              key={attr.id}
              attr={attr}
              selectedOptions={selectedOptions}
              onSelect={onSelectOption}
            />
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ===== FIXED ACTION BAR ===== */}
      <View style={styles.addToCartBar}>
        <View style={styles.actionRow}>
          {/* ADD TO CART */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.cartBtn,
              !canAddToCart && styles.actionBtnDisabled,
            ]}
            onPress={handleAddToCart}
            activeOpacity={0.9}
          >
            <Ionicons name="cart-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>
              {canAddToCart ? 'Add to Cart' : 'Select Options'}
            </Text>
          </TouchableOpacity>

          {/* ORDER NOW */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.orderBtn,
              !canAddToCart && styles.actionBtnDisabled,
            ]}
            onPress={handleOrderNow}
            activeOpacity={0.9}
          >
            <Ionicons name="flash-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
