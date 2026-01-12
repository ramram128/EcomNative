import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { DetailsProps } from '../../types/navigation';
import { Variation } from '../../types/product';
import { ProductService } from '../../api/wooApi2';
import { COLORS } from '../../../constants/color';
import { styles as homeStyles } from '../../styles/home.styles'; // Reusing your theme's card styles
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProductDetailsScreen({ route, navigation }: DetailsProps) {
  const { product } = route.params;

  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product.type === 'variable') {
      fetchVariations();
    }
  }, [product.id]);

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

  const handleSelect = (attrName: string, option: string) => {
    const updated = { ...selectedOptions, [attrName]: option };
    setSelectedOptions(updated);

    const matched = variations.find(v =>
      v.attributes.every(a => updated[a.name] === a.option)
    );
    setSelectedVariation(matched || null);
  };

  return (
    <ScrollView style={homeStyles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Product Title Card */}
      <View style={homeStyles.balanceCard}>
        <Text style={homeStyles.headerTitle}>{product.name}</Text>
        <Text style={[homeStyles.welcomeText, { marginTop: 8 }]}>
          Category: {product.categories?.[0]?.name || 'General'}
        </Text>
      </View>

      {/* Simple Product Price Section */}
      {product.type === 'simple' && (
        <View style={localStyles.priceContainer}>
          <Text style={homeStyles.balanceAmount}>₹{product.price}</Text>
          <TouchableOpacity style={homeStyles.addButton}>
            <Ionicons name="cart-outline" size={20} color={COLORS.white} />
            <Text style={homeStyles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Variable Product Logic */}
      {product.type === 'variable' && (
        <View style={{ marginTop: 10 }}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ margin: 20 }} />
          ) : (
            <>
              {product.attributes?.filter(attr => attr.variation).map(attr => (
                <View key={attr.id} style={{ marginBottom: 20 }}>
                  <Text style={homeStyles.sectionTitle}>Select {attr.name}</Text>
                  <View style={localStyles.chipContainer}>
                    {attr.options.map(option => {
                      const isSelected = selectedOptions[attr.name] === option;
                      return (
                        <TouchableOpacity
                          key={option}
                          onPress={() => handleSelect(attr.name, option)}
                          style={[
                            localStyles.chip,
                            isSelected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                          ]}
                        >
                          <Text style={[localStyles.chipText, isSelected && { color: COLORS.white }]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}

              {/* Price and Add Button for Variable */}
              <View style={localStyles.priceContainer}>
                <Text style={homeStyles.balanceAmount}>
                  {selectedVariation ? `₹${selectedVariation.price}` : 'Select options'}
                </Text>
                <TouchableOpacity
                  disabled={!selectedVariation}
                  style={[homeStyles.addButton, !selectedVariation && { backgroundColor: COLORS.textLight }]}
                >
                  <Ionicons name="cart-outline" size={20} color={COLORS.white} />
                  <Text style={homeStyles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: COLORS.card,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
});