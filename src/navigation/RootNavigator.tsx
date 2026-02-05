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

import EditProfileScreen from '../screens/Profile/EditProfileScreen';

import ShippingAddressScreen from '../screens/Profile/ShippingAddressScreen';
import CustomerCareScreen from '../screens/Profile/CustomerCareScreen';
import OrdersScreen from '../screens/Profile/OrdersScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/theme';

/** -----------------------
 *  Types
 *  ----------------------*/

// Stack inside the "Shop" tab
export type HomeStackParamList = {
  Home: undefined;
  ProductDetails: { id?: string } | undefined;
};

// Bottom tabs
export type TabParamList = {
  Shop: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Profile: undefined;
};

// ✅ Root stack above tabs
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;

  // Profile menu screens
  EditProfile: undefined;
  ShippingAddress: undefined;
  CustomerCare: undefined;
  Orders: { status: 'pending' | 'delivered' | 'processing' | 'cancelled' };
};

/** -----------------------
 *  Navigators
 *  ----------------------*/

const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const HomeStack = () => {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="Home" component={HomeScreen} />
      <HomeStackNav.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </HomeStackNav.Navigator>
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
 *  Tabs
 *  ----------------------*/

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true,

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

/** -----------------------
 *  Root Navigator (Stack -> Tabs + extra screens)
 *  ----------------------*/

export const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs" component={Tabs} />

      {/* Profile menu screens */}
      <RootStack.Screen name="EditProfile" component={EditProfileScreen} />

      <RootStack.Screen name="ShippingAddress" component={ShippingAddressScreen} />
      <RootStack.Screen name="CustomerCare" component={CustomerCareScreen} />
      <RootStack.Screen name="Orders" component={OrdersScreen} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
