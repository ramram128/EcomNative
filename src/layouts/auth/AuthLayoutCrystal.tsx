import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export interface AuthLayoutProps {
  isSignup: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onFirstNameChange: (firstName: string) => void;
  onLastNameChange: (lastName: string) => void;
  onToggleMode: () => void;
  onSignup: () => void;
  onLogin: () => void;
  onSkip: () => void;
}

const AuthLayoutCrystal: React.FC<AuthLayoutProps> = ({
  isSignup,
  email,
  password,
  confirmPassword,
  firstName,
  lastName,
  loading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onToggleMode,
  onSignup,
  onLogin,
  onSkip,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Helper for dynamic transparent colors
  const transparentColor = (hex: string, opacity: number) => {
    const op = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${hex}${op}`;
  };

  return (
    <View style={styles.container}>
      {/* Mesh Background Effect */}
      <View style={styles.backgroundLayer}>
        <View style={[styles.meshCircle, { top: 0, left: 0, backgroundColor: COLORS.primary }]} />
        <View style={[styles.meshCircle, { top: 0, right: 0, backgroundColor: COLORS.textLight }]} />
        <View style={[styles.meshCircle, { bottom: 0, right: 0, backgroundColor: COLORS.border }]} />
        <View style={styles.overlay} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={[styles.logo, { color: COLORS.primary }]}>EcomNative</Text>
            <TouchableOpacity onPress={onSkip}>
              <Text style={styles.skipBtn}>Skip</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.glassCard}>
              {/* Inner Light Reflection Decor */}
              <View style={styles.reflection} />

              <View style={styles.cardHeader}>
                <Text style={styles.title}>{isSignup ? 'Create Vault' : 'Welcome Back'}</Text>
                <Text style={styles.subtitle}>
                  {isSignup ? 'Secure your data in the crystal vault.' : 'Enter your credentials.'}
                </Text>
              </View>

              <View style={styles.form}>
                {isSignup && (
                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>First Name</Text>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.input}
                          placeholder="John"
                          placeholderTextColor={transparentColor('#fff', 0.3)}
                          value={firstName}
                          onChangeText={onFirstNameChange}
                        />
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="name@example.com"
                      placeholderTextColor={transparentColor('#fff', 0.3)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={onEmailChange}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Password</Text>
                    {!isSignup && (
                      <TouchableOpacity>
                        <Text style={[styles.forgotLink, { color: COLORS.primary }]}>Forgot?</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="••••••••"
                      placeholderTextColor={transparentColor('#fff', 0.3)}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={onPasswordChange}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      <Text style={{ color: '#fff' }}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={isSignup ? onSignup : onLogin} 
                  disabled={loading}
                  activeOpacity={0.9}
                  style={styles.submitContainer}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.textLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitButton}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitText}>{isSignup ? 'Create Account' : 'Login to Vault'}</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialGrid}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={onToggleMode} style={styles.footerToggle}>
              <Text style={styles.footerText}>
                {isSignup ? 'Already have an account? ' : 'New to the platform? '}
                <Text style={[styles.footerAction, { color: COLORS.textLight }]}>
                  {isSignup ? 'Login' : 'Create Account'}
                </Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1c' },
  backgroundLayer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  meshCircle: { position: 'absolute', width: width, height: width, borderRadius: width / 2, opacity: 0.2, filter: 'blur(100px)' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13, 13, 28, 0.85)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  logo: { fontSize: 20, fontWeight: '900', letterSpacing: 4 },
  skipBtn: { color: 'rgba(230, 227, 249, 0.6)', fontSize: 14, fontWeight: '500' },
  scrollContent: { padding: 24, paddingBottom: 60, alignItems: 'center' },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(36, 36, 58, 0.3)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(71, 70, 88, 0.3)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  reflection: { position: 'absolute', top: -100, left: -100, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 100, filter: 'blur(40px)' },
  cardHeader: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: 'rgba(171, 169, 190, 0.8)', textAlign: 'center', lineHeight: 20 },
  form: { gap: 20 },
  row: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  label: { fontSize: 10, fontWeight: '700', color: 'rgba(171, 169, 190, 0.6)', letterSpacing: 1.5, textTransform: 'uppercase', marginLeft: 4 },
  forgotLink: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 34, 0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(71, 70, 88, 0.2)',
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { height: 56, color: '#fff', fontSize: 15 },
  eyeBtn: { padding: 8 },
  submitContainer: { marginTop: 12 },
  submitButton: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#c39bff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  submitText: { color: '#130030', fontSize: 16, fontWeight: '800' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(71, 70, 88, 0.3)' },
  dividerText: { marginHorizontal: 12, fontSize: 10, fontWeight: '700', color: 'rgba(171, 169, 190, 0.4)', letterSpacing: 1.5 },
  socialGrid: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(18, 18, 34, 0.2)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(71, 70, 88, 0.2)', gap: 8 },
  socialText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  footerToggle: { marginTop: 32 },
  footerText: { color: 'rgba(171, 169, 190, 0.8)', fontSize: 14, fontWeight: '500' },
  footerAction: { fontWeight: '700' },
});

export default AuthLayoutCrystal;