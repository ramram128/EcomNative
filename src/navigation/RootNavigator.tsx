import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../types/navigation'; 
import HomeScreen2 from '../screens/Home/HomeScreen2';
import ProductDetailsScreen from '../screens/ProductDetailsScreen/ProductDetailsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/color';

// Change "Stack" to "Tab"
const Tab = createBottomTabNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProductDetails') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen2} 
        options={{ title: 'Shop' }}
      />
      <Tab.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen} 
        options={({ route }) => ({ 
            title: route.params?.product?.name || 'Details',
            // This hides the tab bar when looking at details if you prefer
            display: route.params?.product ? 'flex' : 'none' 
        })}
      />
    </Tab.Navigator>
  );
};