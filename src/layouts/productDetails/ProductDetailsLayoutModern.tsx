// src/layouts/productDetails/ProductDetailsLayoutModern.tsx
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ProductDetailsLayoutProps } from './types';
import { styles } from '../../styles/create.styles';
import { Header } from '../../components/Header';
import { AttributeSelector } from '../../components/AttributeSelector';

export default function ProductDetailsLayoutModern({
  product,
  navigation,
  displayImage,
  selectedOptions,
  selectedVariation,
  onSelectOption,
}: ProductDetailsLayoutProps) {
  return (
    <View style={styles.container}>
      <Header title="Product Details" onBack={() => navigation.goBack()} />

      <ScrollView>
        <View style={styles.card}>
          <Image 
            source={{ uri: displayImage ?? undefined }} 
            style={styles.productImage} 
          />
          
          <Text style={styles.sectionTitle}>{product.name}</Text>
          
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            ₹ {selectedVariation?.price || product.price}
          </Text>

          {/* Render Attributes using the new component */}
          {product.attributes?.map((attr: any) => (
            <AttributeSelector 
              key={attr.id}
              attr={attr}
              selectedOptions={selectedOptions}
              onSelect={onSelectOption}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}