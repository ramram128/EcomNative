import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet, TextInput } from 'react-native'; // Added TextInput
import { ProductService } from '../../api/wooApi2';
import { Product } from '../../types/product';
import { COLORS } from '../../constants/theme';
import { SelectedHomeLayout } from '../../layouts';

export default function HomeScreen({ navigation }: any) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // 1. Add state for the search query
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = async () => {
    try {
      const products = await ProductService.getProducts();
      const enrichedProducts = await Promise.all(
        products.map(async (product) => {
          if (product.type !== 'variable') return product;
          const hasVariationAttribute = product.attributes?.some((attr) => attr.variation);
          if (!hasVariationAttribute) return product;
          try {
            const variations = await ProductService.getVariations(product.id);
            return { ...product, variations };
          } catch (e) {
            console.error('Variation Fetch Error:', e);
            return product;
          }
        })
      );
      setData(enrichedProducts);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, []);

  // 2. Filter data based on search query
  // We use useMemo to avoid re-calculating on every minor render
  const filteredProducts = useMemo(() => {
    return data.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 3. Add the Search Bar UI */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search products"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* 4. Pass filteredProducts instead of raw data */}
      <SelectedHomeLayout
        products={filteredProducts}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onPress={(product: Product) =>
          navigation.navigate('ProductDetails', { product })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.background 
  },
  searchContainer: {
    padding: 10,
    backgroundColor: COLORS.background,
    
  },
  searchInput: {
    height: 45,
    backgroundColor: '#fff', // Or use a color from your theme
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  }
});
