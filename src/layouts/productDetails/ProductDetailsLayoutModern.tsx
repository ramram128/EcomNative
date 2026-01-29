// src/layouts/productDetails/ProductDetailsLayoutModern.tsx
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/create.styles';

// Define what this layout expects to receive
interface ModernLayoutProps {
  product: any;
  navigation: any;
  loading: boolean;
  
  displayImage: string | null;
  selectedOptions: any;
  selectedVariation: any;
  onSelectOption: (name: string, option: string) => void;
}

export default function ProductDetailsLayoutModern({
  product,
  navigation,
  loading,
  displayImage,
  selectedOptions,
  selectedVariation,
  onSelectOption,
}: ModernLayoutProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView>
        <View style={styles.card}>
          {/* IMAGE - Now uses the displayImage prop */}
          <Image 
            source={{ uri: displayImage ?? undefined }} 
            style={styles.productImage} 
            />
          <Text style={styles.sectionTitle}>{product.name}</Text>
          
          {/* PRICE - Now uses the selectedVariation price */}
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            ₹ {selectedVariation?.price || product.price}
          </Text>

          {/* ATTRIBUTES */}
          {product.attributes?.map((attr: any) => (
            <View key={attr.id}>
              <Text style={styles.sectionTitle}>{attr.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                {attr.options.map((option: string) => {
                  const isSelected = selectedOptions[attr.name.toLowerCase()] === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => onSelectOption(attr.name, option)}
                      style={[styles.categoryButton, isSelected && styles.categoryButtonActive]}
                    >
                      <Text style={[styles.categoryButtonText, isSelected && styles.categoryButtonTextActive]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}