import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, type NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SelectedProfileScreenLayout } from '../../layouts/profilescreen';
import type { RootStackParamList, TabParamList } from '../../navigation/types';
import { useShop } from '../../store/shopStore';
import { CustomerService } from '../../api/wooApi2';

type Nav = NativeStackNavigationProp<RootStackParamList>;

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
    } else {
      // Clear stored user data when logged out
      setUserData(null);
    }
  }, [isAuthenticated, user?.id, fetchUserData]);

  // Use real user data or fallback
  const userInfo = useMemo(() => {
    if (loading) {
      return {
        name: 'Loading...',
        role: 'Please wait',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      };
    }
    
    if (userData) {
      return {
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'User',
        role: userData.role || 'Customer',
        avatar: userData.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      };
    }
    
    if (!isAuthenticated) {
      return {
        name: 'Guest User',
        role: 'Please login to view profile',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      };
    }
    
    return {
      name: 'User',
      role: 'Loading profile...',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    };
  }, [userData, loading, isAuthenticated]);


  const menu: MenuItem[] = useMemo(
    () => [
      {
        key: 'edit',
        label: 'Edit Profile',
        icon: 'person-outline',
        onPress: () => {
          if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please login to edit your profile', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Login', onPress: () => navigation.navigate('Auth' as never) },
            ]);
            return;
          }
          navigation.navigate('EditProfile');
        },
      },
      {
        key: 'address',
        label: 'Shipping Address',
        icon: 'location-outline',
        onPress: () => navigation.navigate('ShippingAddress'),
      },
    ],
    [navigation, isAuthenticated]
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
      isAuthenticated={isAuthenticated}
      menu={menu}
      onBack={() => handleBack('Wishlist')}
      onLogin={() => navigation.navigate('Auth' as never)}
    />
  );
};

export default ProfileScreen;
