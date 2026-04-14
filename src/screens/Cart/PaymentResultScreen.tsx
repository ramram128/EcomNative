import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const DARK_BLUE = '#0F0F1A';
const ACCENT_PURPLE = '#7C3AED';
const CARD_BG = '#16162A';
const SUCCESS_GREEN = '#10B981';
const FAILURE_RED = '#EF4444';

const PaymentResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { success, orderId, paymentId, amount, error } = route.params as any;
  
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[
          styles.iconContainer, 
          { 
            backgroundColor: success ? SUCCESS_GREEN + '20' : FAILURE_RED + '20',
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <Ionicons 
            name={success ? "checkmark-circle" : "close-circle"} 
            size={100} 
            color={success ? SUCCESS_GREEN : FAILURE_RED} 
          />
        </Animated.View>

        <Text style={styles.title}>{success ? 'Payment Successful!' : 'Payment Failed'}</Text>
        <Text style={styles.subtitle}>
          {success 
            ? 'Your order has been placed successfully. Thank you for shopping with us!' 
            : error || 'Something went wrong while processing your payment. Please try again.'
          }
        </Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>#{orderId}</Text>
          </View>
          {paymentId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment ID</Text>
              <Text style={[styles.detailValue, { fontSize: 12 }]}>{paymentId}</Text>
            </View>
          )}
          {amount && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount Paid</Text>
              <Text style={styles.detailValue}>₹{Math.round(amount)}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        {success ? (
          <TouchableOpacity 
            style={styles.primaryBtnContainer}
            onPress={() => navigation.navigate('Tabs' as never)}
          >
            <LinearGradient
              colors={[ACCENT_PURPLE, '#6D28D9']}
              style={styles.primaryBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryBtnText}>Continue Shopping</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.btnRow}>
            <TouchableOpacity 
              style={styles.secondaryBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryBtnText}>Go Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.retryBtn}
              onPress={() => navigation.navigate('Checkout' as never)}
            >
              <LinearGradient
                colors={[ACCENT_PURPLE, '#6D28D9']}
                style={styles.primaryBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryBtnText}>Retry Payment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_BLUE },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconContainer: { 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 30,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#A0A0B8', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  detailsCard: { 
    backgroundColor: CARD_BG, 
    width: '100%', 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: '#2D2D44' 
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailLabel: { fontSize: 14, color: '#A0A0B8' },
  detailValue: { fontSize: 14, color: '#fff', fontWeight: '700' },
  footer: { padding: 30, paddingBottom: 40 },
  primaryBtnContainer: { width: '100%' },
  primaryBtn: { height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 15 },
  secondaryBtn: { flex: 1, height: 56, borderRadius: 18, borderWidth: 1, borderColor: '#2D2D44', justifyContent: 'center', alignItems: 'center', backgroundColor: CARD_BG },
  secondaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  retryBtn: { flex: 1.5 },
});

export default PaymentResultScreen;
