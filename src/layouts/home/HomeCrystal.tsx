import React from 'react';
import { FlatList, View, StyleSheet, StatusBar } from 'react-native';
import ProductCard from '../../components/ProductCard';
import { COLORS } from '../../constants/theme';

export default function HomeCrystal({ products, onPress, refreshing, onRefresh }: any) {
  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 8, paddingTop: 50 }}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => onPress(item)} />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });