import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  TextInput, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import { ProductService } from '../../api/wooApi2';
import { Product } from '../../types/product';
import { HomeProps } from '../../types/navigation';
import { styles } from '../../styles/home.styles'; 
import ProductCard from '../../components/ProductCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from "../../../constants/color";


export default function HomeScreen2({ navigation,route }: HomeProps) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = async () => {
    try {
      const products = await ProductService.getProducts();
      setData(products);
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Content Area */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Browse Collection</Text>
              <Text style={styles.usernameText}>Store Inventory</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="filter-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Search Input using Balance Card Style */}
        <View style={[styles.balanceCard, { paddingVertical: 10, paddingHorizontal: 15, marginBottom: 20 }]}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             <Ionicons name="search" size={18} color={COLORS.textLight} />
             <TextInput
                placeholder="Search products..."
                placeholderTextColor={COLORS.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ flex: 1, marginLeft: 10, color: COLORS.text, fontSize: 16 }}
             />
           </View>
        </View>

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>All Products</Text>
          <Text style={styles.transactionDate}>{filteredData.length} Items Found</Text>
        </View>
      </View>

      <FlatList
        data={filteredData}
        numColumns={2}
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => navigation.navigate('ProductDetails', { product: item })} 
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={COLORS.textLight} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>No results</Text>
            <Text style={styles.emptyStateText}>We couldn't find any products matching your search.</Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={() => setSearchQuery('')}>
              <Text style={styles.emptyStateButtonText}>Clear Search</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}