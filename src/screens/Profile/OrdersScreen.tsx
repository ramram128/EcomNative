import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const status = route.params?.status ?? 'pending';

  // Demo orders (replace with API)
  const orders = [
    { id: 'ORD001', amount: '₹1,200', status },
    { id: 'ORD002', amount: '₹899', status },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={22}
          color="#111"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>
          Orders – {status.toUpperCase()}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerTitle: { fontSize: 17, fontWeight: '800' },

  list: { padding: 16 },

  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f7f7f7',
    marginBottom: 12,
  },
  orderId: { fontWeight: '800', fontSize: 15 },
  amount: { fontSize: 14, marginTop: 4 },
  status: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
  },
});
