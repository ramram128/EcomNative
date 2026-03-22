import React, { useState, useEffect } from 'react';
import { Linking, Alert } from 'react-native';
import { SelectedProductDetailsLayout } from '../../layouts/productDetails';
import { ProductService } from '../../api/wooApi2';
import { Product, Variation } from '../../types/product';
import { useShop } from '../../store/shopStore';

export default function ProductDetailsScreen({ route, navigation }: any) {
  const { product } = route.params as { product: Product };
  const { user, isAuthenticated } = useShop();

  const [loading, setLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(
    product.images?.[0]?.src || null
  );

  // States
  const [fullVariations, setFullVariations] = useState<Variation[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [groupedProducts, setGroupedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const categoryId = product.categories?.[0]?.id;

        // ✅ Parallel API calls
        const promises: any[] = [
          ProductService.getProductReviews(product.id),
        ];

        if (categoryId) {
          promises.push(ProductService.getProductsByCategory(categoryId));
        }

        if (product.type === 'variable') {
          promises.push(ProductService.getVariations(product.id));
        }

        if (
          product.type === 'grouped' &&
          product.grouped_products &&
          product.grouped_products.length > 0
        ) {
          promises.push(
            ProductService.getMultipleProducts(product.grouped_products)
          );
        }

        const results = await Promise.all(promises);

        // ✅ Reviews
        const reviewsData = results[0] || [];
        const filteredReviews = reviewsData.filter(
          (r: any) => r.product_id === product.id
        );
        setReviews(filteredReviews);

        let index = 1;

        // ✅ Related Products (same category)
        if (categoryId) {
          const sameCategory = results[index] || [];

          const filtered = sameCategory
            .filter((p: Product) => p.id !== product.id) // remove current product
            .slice(0, 10); // limit

          setRelatedProducts(filtered);
          index++;
        }

        // ✅ Variations
        if (product.type === 'variable') {
          setFullVariations(results[index] || []);
          index++;
        }

        // ✅ Grouped Products
        if (product.type === 'grouped') {
          setGroupedProducts(results[index] || []);
        }

      } catch (e) {
        console.error("Error fetching sub-data:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [product.id]);

  // ✅ Variation matching logic
  useEffect(() => {
    if (product.type === 'variable' && fullVariations.length > 0) {
      const match = fullVariations.find(v =>
        v.attributes.every(
          attr => selectedOptions[attr.name.toLowerCase()] === attr.option
        )
      );

      setSelectedVariation(match || null);

      if (match?.image?.src) {
        setDisplayImage(match.image.src);
      }
    }
  }, [selectedOptions, fullVariations, product.type]);

  const handleSelectOption = (name: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [name.toLowerCase()]: option,
    }));
  };

  // ✅ External/Affiliate
  const handleExternalPress = async () => {
    if (product.external_url) {
      const supported = await Linking.canOpenURL(product.external_url);
      supported
        ? await Linking.openURL(product.external_url)
        : Alert.alert("Error", "Invalid URL");
    }
  };

  const refreshReviews = async () => {
    const reviewsData = await ProductService.getProductReviews(product.id);
    const filteredReviews = reviewsData.filter(
      (r: any) => r.product_id === product.id
    );
    setReviews(filteredReviews);
  };

  // ✅ Add Review
  const handleAddReview = async (rating: number, reviewText: string) => {
    if (!isAuthenticated || !user) {
      Alert.alert("Login Required", "Please log in to submit a review.");
      return;
    }

    try {
      await ProductService.addReview({
        product_id: product.id,
        review: reviewText,
        reviewer: `${user.first_name} ${user.last_name}`.trim() || user.username || "Anonymous",
        reviewer_email: user.email,
        rating: rating,
      });

      Alert.alert("Success", "Your review has been submitted and is awaiting approval.");
      await refreshReviews();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit review. Please try again.");
    }
  };

  // ✅ Update Review
  const handleUpdateReview = async (reviewId: number, rating: number, reviewText: string) => {
    try {
      await ProductService.updateReview(reviewId, {
        review: reviewText,
        rating: rating,
      });
      Alert.alert("Success", "Your review has been updated.");
      await refreshReviews();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update review. Please try again.");
    }
  };

  // ✅ Delete Review
  const handleDeleteReview = async (reviewId: number) => {
    try {
      await ProductService.deleteReview(reviewId);
      Alert.alert("Deleted", "Your review has been removed.");
      await refreshReviews();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to delete review. Please try again.");
    }
  };

  return (
    <SelectedProductDetailsLayout
      product={product}
      navigation={navigation}
      loading={loading}
      displayImage={displayImage}

      // Variable
      selectedOptions={selectedOptions}
      selectedVariation={selectedVariation}
      onSelectOption={handleSelectOption}

      // Grouped
      groupedProducts={groupedProducts}

      // External
      onExternalPress={handleExternalPress}

      // Reviews
      reviews={reviews}
      onAddReview={handleAddReview}
      currentUserEmail={user?.email}
      onUpdateReview={handleUpdateReview}
      onDeleteReview={handleDeleteReview}

      // ⭐ NEW: Related Products
      relatedProducts={relatedProducts}
      fullVariations={fullVariations}
    />
  );
}