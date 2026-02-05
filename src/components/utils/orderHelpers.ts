export interface OrderItem {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
}

export const getOrders = (navigation: any): OrderItem[] => [
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
      onPress: () => navigation.navigate('Wishlist'),
    },
    {
      key: 'support',
      label: 'Customer Care',
      icon: 'headset-outline',
      onPress: () => navigation.navigate('CustomerCare'),
    },
  ];
