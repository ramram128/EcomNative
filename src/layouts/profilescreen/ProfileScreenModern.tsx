import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../../styles/profileScreen.styles';
import ProfileHeader from '../../components/ProfileHeader';
import OrdersSection from '../../components/OrdersSection';
import MenuSection from '../../components/MenuSection';
import LogoutButton from '../../components/LogoutButton';

/**
 * Keep this here for easy copy-paste.
 * If you already have src/navigation/types.ts, move this there and import it instead.
 */
export type RootStackParamList = {
  Orders: { status: 'pending' | 'delivered' | 'processing' | 'cancelled' };
  Wishlist: undefined;
  CustomerCare: undefined;
  EditProfile: undefined;
  ShippingAddress: undefined;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
}

const ProfileScreenModern = () => {
  const navigation = useNavigation<Nav>();

  const user = {
    name: 'Roan Atkinson',
    role: 'Entrepreneur',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  };

  const menu: MenuItem[] = [
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
  ];

  const handleLogout = () => {
    // Add logout logic here
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          user={user}
          onBackPress={() => navigation.goBack()}
          onCameraPress={() => {}}
        />

        <OrdersSection navigation={navigation} />

        <MenuSection menu={menu} />

        <LogoutButton onPress={handleLogout} />

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreenModern;


