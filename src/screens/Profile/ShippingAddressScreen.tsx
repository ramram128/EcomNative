import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ShippingAddressScreen = () => {
  const navigation = useNavigation();

  // Demo address
  const address = {
    name: 'Roan Atkinson',
    phone: '+91 98765 43210',
    line1: '12, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
  };

  return (
    <SafeAreaView style={styles.safe } edges={['left', 'right']}>
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={22}
          color="#111"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Shipping Address</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.name}>{address.name}</Text>
          <Text style={styles.text}>{address.phone}</Text>
          <Text style={styles.text}>{address.line1}</Text>
          <Text style={styles.text}>
            {address.city}, {address.state} – {address.pincode}
          </Text>
        </View>

        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.addText}>Add / Edit Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ShippingAddressScreen;

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
  headerTitle: { fontSize: 18, fontWeight: '800' },

  container: { padding: 16 },

  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f7f7f7',
  },
  name: { fontSize: 15, fontWeight: '800' },
  text: { fontSize: 14, marginTop: 4, color: '#444' },

  addBtn: {
    marginTop: 20,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#d4145a',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
