import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectedProfileScreenLayout } from '../../layouts/profilescreen';

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

const ProfileScreen = () => {

  return (
    <SelectedProfileScreenLayout></SelectedProfileScreenLayout>
  );
};

export default ProfileScreen;


