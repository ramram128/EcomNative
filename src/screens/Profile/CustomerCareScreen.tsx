import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CustomerCareScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Care</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.desc}>
          Our support team is available 24/7 to help you.
        </Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => Linking.openURL('tel:+919876543210')}
        >
          <Ionicons name="call-outline" size={22} color="#111" />
          <Text style={styles.cardText}>Call Support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => Linking.openURL('mailto:support@infinitroot.com')}
        >
          <Ionicons name="mail-outline" size={22} color="#111" />
          <Text style={styles.cardText}>Email Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#111" />
          <Text style={styles.cardText}>Live Chat (Coming Soon)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CustomerCareScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },

  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  desc: { fontSize: 14, color: '#666', marginBottom: 20 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f7f7f7',
    marginBottom: 12,
    gap: 12,
  },
  cardText: { fontSize: 15, fontWeight: '700', color: '#111' },
});
