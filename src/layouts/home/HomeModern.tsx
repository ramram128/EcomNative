import React from 'react';
import { 
  FlatList, 
  View, 
  Text, 
  StatusBar, 
} from 'react-native';
import ProductCard from '../../components/ProductCard';
import { COLORS } from '../../constants/theme';
import { styles } from '../../styles/home.styles';

interface HomeLayoutProps {
  products: any[];
  onPress: (product: any) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function HomeModern({ 
  products, 
  onPress, 
  refreshing, 
  onRefresh 
}: HomeLayoutProps) {


  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        refreshing={refreshing} // 👈 Add this
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.label}>Collection</Text>
            <Text style={styles.title}>Bento Grid</Text>
          </View>
        }
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
             {/* Pass the dynamic styles to your ProductCard component */}
             <ProductCard product={item} onPress={() => onPress(item)} />
          </View>
        )}
      />
    </View>
  );
}

