import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { Product, Variation } from '../../types/product';
import { ProductService } from '../../api/wooApi2';

type Props = {
  route: RouteProp<{ params: { product: Product } }, 'params'>;
};

export default function ProductDetailsScreen({ route }: Props) {
  const { product } = route.params;

  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  );
  const [selectedVariation, setSelectedVariation] =
    useState<Variation | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch variations for variable product
  useEffect(() => {
    if (product.type === 'variable') {
      fetchVariations();
    }
  }, []);

  const fetchVariations = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getVariations(product.id);
      setVariations(data);
    } catch (error) {
      console.error('Failed to load variations', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle attribute selection
  const handleSelect = (attrName: string, option: string) => {
    const updated = {
      ...selectedOptions,
      [attrName]: option,
    };

    setSelectedOptions(updated);

    const matched = variations.find(v =>
      v.attributes.every(a => updated[a.name] === a.option)
    );

    setSelectedVariation(matched || null);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        {product.name}
      </Text>

      {/* SIMPLE PRODUCT */}
      {product.type === 'simple' && (
        <>
          <Text style={{ marginVertical: 12, fontSize: 16 }}>
            Price: ₹{product.price}
          </Text>

          <TouchableOpacity
            style={{ backgroundColor: '#000', padding: 14 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* VARIABLE PRODUCT */}
      {product.type === 'variable' && product.attributes && (
        <>
          {loading && (
            <ActivityIndicator
              size="large"
              style={{ marginVertical: 20 }}
            />
          )}

          {!loading &&
            product.attributes
              .filter(attr => attr.variation)
              .map(attr => (
                <View key={attr.id}>
                  <Text style={{ marginTop: 18, fontWeight: '600' }}>
                    Select {attr.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginVertical: 10,
                    }}
                  >
                    {attr.options.map(option => (
                      <TouchableOpacity
                        key={option}
                        onPress={() =>
                          handleSelect(attr.name, option)
                        }
                        style={{
                          padding: 10,
                          marginRight: 10,
                          marginBottom: 10,
                          borderWidth: 1,
                          borderColor:
                            selectedOptions[attr.name] === option
                              ? '#000'
                              : '#ccc',
                        }}
                      >
                        <Text>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

          {selectedVariation && (
            <Text style={{ marginVertical: 12, fontSize: 16 }}>
              Price: ₹{selectedVariation.price}
            </Text>
          )}

          <TouchableOpacity
            disabled={!selectedVariation}
            style={{
              backgroundColor: selectedVariation ? '#000' : '#999',
              padding: 14,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
