import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Orders: { status: 'pending' | 'delivered' | 'processing' | 'cancelled' };
  Wishlist: undefined;
  CustomerCare: undefined;
  EditProfile: undefined;
  ShippingAddress: undefined;
};

export type UserProfile = {
  name: string;
  role?: string;
  avatar?: string;
};

export type MenuItem = {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
};

export type ProfileScreenLayoutProps = {
  user: UserProfile;
  menu: MenuItem[];
  onLogout: () => void;
  onBack: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};
