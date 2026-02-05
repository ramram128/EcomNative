// imports
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ProductDetailsLayoutProps } from './types';
import { styles } from '../../styles/create.styles';
import { Header } from '../../components/Header';
import { AttributeSelector } from '../../components/AttributeSelector';

/* =================== HELPERS =================== */

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/* =================== RATING COMPONENT =================== */

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
        {rating.toFixed(1)}{count > 0 ? ` (${count})` : ''}
      </Text>
    </View>
  );
};

/* =================== MAIN COMPONENT =================== */

export default function ProductDetailsLayoutModern({
  product,
  navigation,
  displayImage,
  selectedOptions,
  selectedVariation,
  onSelectOption,
}: ProductDetailsLayoutProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const avgRating = Number(product?.avg_rating ?? 0);
  const ratingCount = Number(product?.rating_count ?? 0);

  return (
    <View style={styles.container}>
      <Header title="Product Details" onBack={() => navigation.goBack()} />

      <ScrollView>
        <View style={styles.card}>
          {/* IMAGE + WISHLIST */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: displayImage ?? undefined }}
              style={styles.productImage}
            />

            <TouchableOpacity
              style={styles.wishlistBtn}
              onPress={() => setIsWishlisted(p => !p)}
            >
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={20}
                color={isWishlisted ? '#E53935' : '#333'}
              />
            </TouchableOpacity>
          </View>

          {/* TITLE + RATING */}
       <View style={styles.titleRow}>
  <Text
    style={styles.sectionTitle}
    numberOfLines={2}
  >
    {product.name}
  </Text>

  <RatingRow
    value={Number.isFinite(avgRating) ? avgRating : 0}
    count={Number.isFinite(ratingCount) ? ratingCount : 0}
  />
</View>



          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            ₹ {selectedVariation?.price || product.price}
          </Text>

          <Text style={styles.categoryName}>{product.description}</Text>

          {product.attributes?.map((attr: any) => (
            <AttributeSelector
              key={attr.id}
              attr={attr}
              selectedOptions={selectedOptions}
              onSelect={onSelectOption}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
