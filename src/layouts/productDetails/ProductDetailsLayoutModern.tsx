import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/details.styles';

export default function ProductDetailsLayoutModern({ 
  product, navigation, loading, selectedOptions, onSelectOption 
}: any) {
  
  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE SECTION */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product?.images?.[0]?.src }} style={styles.fullBgImage} />
          
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.glassCircle}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTENT SECTION */}
        <View style={styles.cardWrapper}>
          <Text style={styles.categoryTitle}>Premium Collection</Text>
          <Text style={styles.productTitle}>{product?.name}</Text>
          <Text style={styles.priceText}>₹{product?.price}</Text>

          {/* ATTRIBUTES */}
          {product?.type === 'variable' && (
            <View style={styles.attrContainer}>
              {loading ? <ActivityIndicator color="#000" /> : 
                product.attributes?.map((attr: any) => (
                  <View key={attr.id} style={styles.attrRow}>
                    <Text style={styles.attrLabel}>{attr.name}</Text>
                    <View style={styles.optionsList}>
                      {attr.options.map((opt: string) => (
                        <TouchableOpacity 
                          key={opt} 
                          onPress={() => onSelectOption(attr.name, opt)}
                          style={[styles.optionChip, selectedOptions[attr.name] === opt && styles.activeChip]}
                        >
                          <Text style={[styles.optionText, selectedOptions[attr.name] === opt && styles.activeText]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))
              }
            </View>
          )}

          {/* DESCRIPTION */}
          <View style={styles.descriptionTile}>
            <Text style={styles.attrLabel}>Description</Text>
            <Text style={styles.descBody}>
              {product?.description?.replace(/<[^>]*>?/gm, '')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.actionPill}>
          <TouchableOpacity style={styles.addToCartBtn}>
            <Text style={styles.btnText}>ADD TO BAG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}