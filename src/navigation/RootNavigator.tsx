import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; // Ensure this path is correct
import HomeScreen from '../screens/Home/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen/ProductDetailsScreen'; // Import the file we just made

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen} 
        options={({ route }) => ({ title: route.params.product.name })}
      />
    </Stack.Navigator>
  );
};