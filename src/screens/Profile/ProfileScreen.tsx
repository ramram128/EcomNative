import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SelectedProfileScreenLayout } from '../../layouts/profilescreen';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export type OrderItem = {
  key: 'pending' | 'delivered' | 'processing' | 'cancelled' | 'wishlist' | 'support';
  label: string;
  icon: string;
  onPress: () => void;
};

export type MenuItem = {
  key: 'edit' | 'address';
  label: string;
  icon: string;
  onPress: () => void;
};

const ProfileScreen = () => {
  const navigation = useNavigation<Nav>();

  // Demo user (replace with API/store later)
  const user = useMemo(
    () => ({
      name: 'Roan Atkinson',
      role: 'Entrepreneur',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    }),
    []
  );

  const orders: OrderItem[] = useMemo(
    () => [
      {
        key: 'pending',
        label: 'Pending Payment',
        icon: 'wallet-outline',
        onPress: () => navigation.navigate('Orders', { status: 'pending' }),
      },
      {
        key: 'delivered',
        label: 'Delivered',
        icon: 'cube-outline',
        onPress: () => navigation.navigate('Orders', { status: 'delivered' }),
      },
      {
        key: 'processing',
        label: 'Processing',
        icon: 'sync-outline',
        onPress: () => navigation.navigate('Orders', { status: 'processing' }),
      },
      {
        key: 'cancelled',
        label: 'Cancelled',
        icon: 'close-circle-outline',
        onPress: () => navigation.navigate('Orders', { status: 'cancelled' }),
      },
      {
        key: 'wishlist',
        label: 'Wishlist',
        icon: 'heart-outline',
        // Wishlist is a TAB. We go to Tabs -> Wishlist
        onPress: () => navigation.navigate('Tabs', { screen: 'Wishlist' }),
      },
      {
        key: 'support',
        label: 'Customer Care',
        icon: 'headset-outline',
        onPress: () => navigation.navigate('CustomerCare'),
      },
    ],
    [navigation]
  );

  const menu: MenuItem[] = useMemo(
    () => [
      {
        key: 'edit',
        label: 'Edit Profile',
        icon: 'person-outline',
        onPress: () => navigation.navigate('EditProfile'),
      },
      {
        key: 'address',
        label: 'Shipping Address',
        icon: 'location-outline',
        onPress: () => navigation.navigate('ShippingAddress'),
      },
    ],
    [navigation]
  );

  const onBack = () => {
    // Since Profile is in Tabs, this usually does nothing, but safe:
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Tabs', { screen: 'Wishlist' });

  };

  return (
    <SelectedProfileScreenLayout
      user={user}
      orders={orders}
      menu={menu}
      onBack={onBack}
    />
  );
};

export default ProfileScreen;
