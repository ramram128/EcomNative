import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useNavigation, type NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SelectedProfileScreenLayout } from '../../layouts/profilescreen';
import type { RootStackParamList, TabParamList } from '../../navigation/types';
import { useShop } from '../../store/shopStore';
import { CustomerService } from '../../api/wooApi2';

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
  const { isAuthenticated, user } = useShop();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await CustomerService.getCustomer(user.id);
      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Fallback to basic user info
      setUserData({
        first_name: user.first_name || 'User',
        last_name: user.last_name || '',
        email: user.email,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserData();
    }
  }, [isAuthenticated, user?.id, fetchUserData]);

  // Use real user data or fallback
  const userInfo = useMemo(() => {
    if (userData) {
      return {
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'User',
        role: userData.role || 'Customer',
        avatar: userData.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      };
    }
    return {
      name: 'Guest User',
      role: 'Please login',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    };
  }, [userData]);

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

  const handleBack = (e: keyof TabParamList) => {
    // Since Profile is in Tabs, this usually does nothing, but safe:
    if (navigation.canGoBack()) navigation.goBack();
    else
      navigation.navigate(
        'Tabs',
        ({ screen: e } as unknown) as NavigatorScreenParams<TabParamList>
      );
  };

  return (
    <SelectedProfileScreenLayout
      user={userInfo}
      orders={orders}
      menu={menu}
      onBack={() => handleBack('Wishlist')}
    />
  );
};

export default ProfileScreen;
