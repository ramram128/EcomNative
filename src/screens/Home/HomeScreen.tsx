import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, TextInput, Text } from 'react-native';
import { ProductService } from '../../api/wooApi2';
import { Product } from '../../types/product';
import { HomeProps } from '../../types/navigation';
import { styles } from './Home.style';
import ProductCard from '../../components/ProductCard';

export default function HomeScreen({ navigation }: HomeProps) {
  //  Hooks at the top level
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  //  Data Fetching 
  const loadProducts = async () => {
    try {
      const products = await ProductService.getProducts();
      setData(products);
      setFilteredData(products);
    } catch (error: any) {
      console.error("❌ Failed to load products:", {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        data: error.response?.data,
        ERROR:JSON.stringify(error)
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  //  Lifecycle and Callbacks
  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
    
  }, []);

  // Search Filtering 
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  
    if (!text) {
      setFilteredData(data);
      return;
    }
  
    const query = text.toLowerCase();
    setFilteredData(
      data.filter(item =>
        item.name.toLowerCase().includes(query)
      )
    );
  }, [data]);

  const handlePress = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  // Early Return for Initial Loader
  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar UI */}
      <View style={{ padding: 10, backgroundColor: '#fff' }}>
        <TextInput
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={{
            height: 40,
            borderColor: '#ddd',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 15,
            backgroundColor: '#f9f9f9'
          }}
        />
      </View>

      <FlatList
        data={filteredData}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => handlePress(item)} 
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#0000ff']}
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#888' }}>No products found.</Text>
          </View>
        }
      />
    </View>
  );
}