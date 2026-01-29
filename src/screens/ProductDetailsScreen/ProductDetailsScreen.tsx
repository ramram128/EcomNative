// src/screens/ProductDetailsScreen/ProductDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import ProductDetailsLayoutModern from '../../layouts/productDetails/ProductDetailsLayoutModern';
import { ProductService } from '../../api/wooApi3';
import { Product, Variation } from '../../types/product';

export default function ProductDetailsScreen({ route, navigation }: any) {
  const { product } = route.params;
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [fullVariations, setFullVariations] = useState<Variation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(product.images?.[0]?.src || null);

  // Fetch full variation data (since product.variations only contains IDs)
  useEffect(() => {
    const loadData = async () => {
      if (product.type === 'variable') {
        setLoading(true);
        try {
          const data = await ProductService.getVariations(product.id);
          setFullVariations(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [product.id]);

  // Match the selection to a specific variation
  useEffect(() => {
    if (fullVariations.length > 0) {
      const match = fullVariations.find(v => 
        v.attributes.every(attr => selectedOptions[attr.name.toLowerCase()] === attr.option)
      );
      setSelectedVariation(match || null);
      if (match?.image?.src) setDisplayImage(match.image.src);
    }
  }, [selectedOptions, fullVariations]);

  const handleSelectOption = (name: string, option: string) => {
    setSelectedOptions(prev => ({ ...prev, [name.toLowerCase()]: option }));
  };

  return (
    <ProductDetailsLayoutModern
      product={product}
      navigation={navigation}
      loading={loading}
      displayImage={displayImage}
      selectedOptions={selectedOptions}
      selectedVariation={selectedVariation}
      onSelectOption={handleSelectOption}
    />
  );
}