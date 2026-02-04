import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

import HomeScreen from '../screens/Home/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen/ProductDetailsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import WishlistScreen from '../screens/Wishlist/WishlistScreen';
import CartScreen from '../screens/Cart/CartScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/theme';

/** -----------------------
 *  Types
 *  ----------------------*/

// Stack inside the "Shop" tab
export type HomeStackParamList = {
  Home: undefined;
  ProductDetails: { id?: string } | undefined; // adjust params as needed
};

// Bottom tabs
export type TabParamList = {
  Shop: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Profile: undefined;
};

/** -----------------------
 *  Navigators
 *  ----------------------*/

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};

/** -----------------------
 *  Tab Icons (Typed Map)
 *  ----------------------*/

const TAB_ICONS: Record<keyof TabParamList, string> = {
  Shop: 'home-outline',
  Search: 'search-outline',
  Wishlist: 'heart-outline',
  Cart: 'cart-outline',
  Profile: 'person-outline',
};

/** -----------------------
 *  Root Navigator
 *  ----------------------*/

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true, // set false if you don't want labels

        // Optional: nicer tab bar spacing
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },

        tabBarIcon: ({ color, size }) => {
          const iconName = TAB_ICONS[route.name];
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Shop" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default RootNavigator;
