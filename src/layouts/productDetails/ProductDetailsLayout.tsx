import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/theme';
import { styles } from '../../styles/create.styles';

export default function ProductDetailsLayout({
  product,
  navigation,
  loading,
  displayImage,
  selectedOptions,
  selectedVariation,
  onSelectOption,
}: any) {

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Product Details</Text>

        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            product.type === 'variable' && !selectedVariation && styles.saveButtonDisabled,
          ]}
        >
          <Text style={styles.saveButton}>Add</Text>
          <Ionicons name="cart-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.card}>

          {/* IMAGE */}
          {displayImage ? (
            <Image source={{ uri: displayImage }} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={50} color={COLORS.border} />
            </View>
          )}

          {/* NAME */}
          <Text style={styles.sectionTitle}>{product.name}</Text>
          <Text style={{ color: COLORS.textLight }}>
            {product.categories?.[0]?.name}
          </Text>

          {/* PRICE */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.amountInput}>
              {product.type === 'variable'
                ? selectedVariation?.price || product.price
                : product.price}
            </Text>
            
          </View>

          {/* ATTRIBUTES */}
          {product.type === 'variable' && (
            <>
              {loading ? (
                <ActivityIndicator />
              ) : (
                product.attributes
                  ?.filter((a: any) => a.variation)
                  .map((attr: any) => (
                    <View key={attr.id}>
                      <Text style={styles.sectionTitle}>{attr.name}</Text>
                      <View style={styles.categoryGrid}>
                        {attr.options.map((option: string) => {
                          const isSelected =
                            selectedOptions[attr.name] === option;

                          return (
                            <TouchableOpacity
                              key={option}
                              onPress={() =>
                                onSelectOption(attr.name, option)
                              }
                              style={[
                                styles.categoryButton,
                                isSelected && styles.categoryButtonActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.categoryButtonText,
                                  isSelected &&
                                    styles.categoryButtonTextActive,
                                ]}
                              >
                                {option}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ))
              )}
            </>
          )}

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>About this item</Text>
          <Text style={{ lineHeight: 22 }}>
            {product.short_description?.replace(/<[^>]*>?/gm, '')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
