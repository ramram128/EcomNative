import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

type OrderItem = {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
};

type MenuItem = {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
};

const ProfileScreen = () => {
  const navigation = useNavigation<Nav>();

  const user = {
    name: 'Roan Atkinson',
    role: 'Entrepreneur',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  };

  const orders: OrderItem[] = [
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

  return (
    <SafeAreaView style={styles.safe} edges={[ 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerWrap}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={22} color="#111" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Wave background */}
          <View style={styles.waveHolder}>
            <View style={styles.wave} />
            <View style={styles.waveAccent1} />
            <View style={styles.waveAccent2} />
          </View>

          {/* Avatar + name */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraBtn} onPress={() => {}}>
                <Ionicons name="camera-outline" size={16} color="#111" />
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>
        </View>

        {/* My Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Orders</Text>

          <View style={styles.grid}>
            {orders.map((it) => (
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

        {/* Menu */}
        <View style={styles.menuCard}>
          {menu.map((m, idx) => (
            <React.Fragment key={m.key}>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={m.onPress}
                activeOpacity={0.85}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name={m.icon} size={20} color="#444" />
                  <Text style={styles.menuText}>{m.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#999" />
              </TouchableOpacity>

              {idx !== menu.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => {}} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color="#555" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingBottom: 12,
    backgroundColor: '#fff',
  },

  headerWrap: {
    backgroundColor: '#fff',
    paddingBottom: 12,
  },
  headerTopRow: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  waveHolder: {
    height: 170,
    marginHorizontal: 16,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#f4f4f4',
  },
  wave: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: -70,
    height: 170,
    borderRadius: 999,
    backgroundColor: '#d4145a',
    transform: [{ rotate: '-8deg' }],
  },
  waveAccent1: {
    position: 'absolute',
    left: -20,
    right: -60,
    bottom: -95,
    height: 190,
    borderRadius: 999,
    backgroundColor: '#ff4f7f',
    opacity: 0.75,
    transform: [{ rotate: '6deg' }],
  },
  waveAccent2: {
    position: 'absolute',
    left: -70,
    right: -10,
    bottom: -110,
    height: 210,
    borderRadius: 999,
    backgroundColor: '#ff8fb0',
    opacity: 0.45,
    transform: [{ rotate: '-3deg' }],
  },

  profileCard: {
    marginTop: -62,
    alignItems: 'center',
    paddingBottom: 10,
  },
  avatarWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },
  cameraBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  role: {
    marginTop: 2,
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 14,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLabel: {
    marginTop: 8,
    fontSize: 11,
    textAlign: 'center',
    color: '#444',
    fontWeight: '600',
  },

  menuCard: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    overflow: 'hidden',
  },
  menuRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuText: {
    fontSize: 14,
    color: '#111',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f1f1',
    marginLeft: 14,
  },

  logoutBtn: {
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f7f7f7',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#555',
  },
});
