import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/profileScreen.styles';

export interface OrdersLayoutProps {
  orders: any[];
  loading: boolean;
  isAuthenticated: boolean;
  status: string;
  onBack: () => void;
  onLogin: () => void;
}

const OrdersLayoutModern: React.FC<OrdersLayoutProps> = ({
  orders,
  loading,
  isAuthenticated,
  status,
  onBack,
  onLogin,
}) => {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={22} color="#111" onPress={onBack} />
        <Text style={styles.headerTitle}>Orders – {status.toUpperCase()}</Text>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : !isAuthenticated ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
            Please login to view your orders
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#d4145a',
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 10,
            }}
            onPress={onLogin}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No orders found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.orderId}>Order #{item.number}</Text>
                <Text style={styles.amount}>₹{item.total}</Text>
              </View>
              <Text style={styles.status}>Status: {item.status.toUpperCase()}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                Date: {new Date(item.date_created).toLocaleDateString()}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default OrdersLayoutModern;