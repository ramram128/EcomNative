import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ProductService } from '../../api/wooApi2';
import { Product } from '../../types/product';
import { COLORS, ACTIVE_LAYOUT } from '../../constants/theme';
import { SelectedHomeLayout } from '../../layouts';

export default function HomeScreen({ navigation }: any) {
  // ✅ Explicitly type the state to avoid 'never' error
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const products = await ProductService.getProducts();
      setData(products);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SelectedHomeLayout
      products={data}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onPress={(product: Product) =>
        navigation.navigate('ProductDetails', { product })
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.background 
  }
});