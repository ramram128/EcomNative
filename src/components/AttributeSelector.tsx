// src/components/product/AttributeSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../styles/create.styles';


export const AttributeSelector = ({ attr, selectedOptions, onSelect }: any) => (
  <View key={attr.id} style={{ marginVertical: 10 }}>
    <Text style={styles.sectionTitle}>{attr.name}</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {attr.options.map((option: string) => {
        const isSelected = selectedOptions[attr.name.toLowerCase()] === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(attr.name, option)}
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
);