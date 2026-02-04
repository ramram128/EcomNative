import React, { useState } from 'react';
import { SelectedDetails } from '../../layouts';

export default function ProductDetailsScreen({ route, navigation }: any) {
  const { product } = route.params;
  
  // State for variation selection
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isChangingVariation, setIsChangingVariation] = useState(false);

  const handleSelectOption = (attr: string, option: string) => {
    setSelectedOptions(prev => ({ ...prev, [attr]: option }));
    // If you fetch new variation data from WooCommerce here, 
    // you would set setIsChangingVariation(true)
  };

  return (
    <SelectedDetails 
      product={product} 
      navigation={navigation}
      // ✅ ADD THESE MISSING PROPS
      loading={isChangingVariation} 
      displayImage={product?.images?.[0]?.src}
      selectedOptions={selectedOptions}
      onSelectOption={handleSelectOption}
      // selectedVariation={null} // Add this if you have the variation object
    />
  );
}