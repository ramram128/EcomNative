import type { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: { focusSearch?: boolean } | undefined;   // ✅ add this
  ProductDetails: { id?: string } | undefined;
};

export type TabParamList = {
  Shop: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;

  Orders: { status: 'pending' | 'delivered' | 'processing' | 'cancelled' };
  CustomerCare: undefined;
  EditProfile: undefined;
  ShippingAddress: undefined;
};
