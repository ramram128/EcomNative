import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Image, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/details.styles';
import { Glass } from '../../components/Glass'; // Optional: Move Glass to its own file

const ProductDetailsLayoutCrystal = ({ 
  product, navigation, loading, displayImage, selectedOptions, selectedVariation, onSelectOption 
}: any) => {
  const price = useMemo(() => 
    product?.type === 'variable' ? (selectedVariation?.price || product?.price) : product?.price, 
    [product, selectedVariation]
  );
  
  const isDisabled = product?.type === 'variable' && !selectedVariation;

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* BACKGROUND SECTION */}
      <View style={styles.backgroundWrapper}>
        {displayImage && <Image source={{ uri: displayImage }} style={styles.fullBgImage} resizeMode="cover" />}
        <View style={styles.darkOverlay} />
      </View>

      {/* TOP NAVIGATION */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.glassCircle}>
          <Glass />
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Replace hardcoded height with a named style */}
        <View style={styles.heroSpacing} /> 
        
        <View style={styles.cardWrapper}>
          <Glass />
          <View>
            <Text style={styles.productTitle}>{product?.name}</Text>
            <Text style={styles.categoryTitle}>{product?.categories?.[0]?.name}</Text>
            <Text style={styles.priceText}>₹{price}</Text>
            
            {product?.type === 'variable' && (
              <View style={styles.attrRow}>
                {loading ? <ActivityIndicator color="#fff" /> : product.attributes?.map((attr: any) => (
                  <View key={attr.id} style={styles.attributeGroup}>
                    <Text style={styles.attrLabel}>{attr.name}</Text>
                    <View style={styles.optionsList}>
                      {attr.options.map((opt: string) => (
                        <TouchableOpacity 
                          key={opt} 
                          onPress={() => onSelectOption(attr.name, opt)}
                          style={[
                            styles.optionChip, 
                            selectedOptions[attr.name] === opt && styles.activeChip
                          ]}
                        >
                          <Text style={[
                            styles.optionText, 
                            selectedOptions[attr.name] === opt && styles.activeText
                          ]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.attrLabel}>Description</Text>
            <Text style={styles.descBody}>
              {product?.short_description?.replace(/<[^>]*>/g, '')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM ACTION BAR */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.actionPill}>
          <Glass />
          <TouchableOpacity 
            disabled={isDisabled} 
            style={[styles.addToCartBtn, isDisabled && styles.disabledBtn]} // Move opacity to styles
          >
            <Text style={styles.btnText}>{isDisabled ? 'SELECT OPTIONS' : 'ADD TO CART'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(ProductDetailsLayoutCrystal);