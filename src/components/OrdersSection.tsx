import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../styles/profileScreen.styles';
import { getOrders, OrderItem } from './utils/orderHelpers';
import type { RootStackParamList } from '../screens/Profile/ProfileScreen';

interface OrdersSectionProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({ navigation }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>My Orders</Text>

      <View style={styles.grid}>
        {getOrders(navigation).map((it: OrderItem) => (
          <TouchableOpacity
            key={it.key}
            style={styles.gridItem}
            onPress={it.onPress}
            activeOpacity={0.85}
          >
            <View style={styles.gridIconCircle}>
              <Ionicons name={it.icon} size={22} color="#111" />
            </View>
            <Text style={styles.gridLabel} numberOfLines={2}>
              {it.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default OrdersSection;
