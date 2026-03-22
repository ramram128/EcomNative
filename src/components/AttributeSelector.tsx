import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/create.styles'; // Adjusted path to match your structure

export const AttributeSelector = ({ attr, selectedOptions, onSelect }: any) => (
  <View
    key={attr.id}
    style={{
      flexDirection: 'row',      // ✅ Aligns Name and Options horizontally
      alignItems: 'center',       // ✅ Centers them vertically in the row
      marginVertical: 8,
      flexWrap: 'wrap',           // ✅ Allows wrapping if there are too many options
    }}
  >
    {/* Attribute Name (e.g., Size:) */}
    <Text style={[styles.sectionTitle, { marginRight: 12, marginBottom: 0 }]}>
      {attr.name}:
    </Text>

    {/* Options Container */}
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
      {attr.options.map((option: string) => {
        const isSelected = selectedOptions[attr.name.toLowerCase()] === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(attr.name, option)}
            style={[
              styles.categoryButton,
              isSelected && styles.categoryButtonActive,
              { marginVertical: 4 } // Adds a tiny bit of space if buttons wrap to next line
            ]}
          >
            <Text style={[
              styles.categoryButtonText,
              isSelected && styles.categoryButtonTextActive
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);