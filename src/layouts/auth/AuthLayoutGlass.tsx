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
  Dimensions
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import type { AuthLayoutProps } from './AuthLayoutModern';

const { width } = Dimensions.get('window');

const AuthLayoutGlass: React.FC<AuthLayoutProps> = ({
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

  return (
    <View style={styles.container}>
      {/* Decorative Background Elements */}
      <View style={[styles.blurCircle, styles.topCircle, { backgroundColor: COLORS.primary + '15' }]} />
      <View style={[styles.blurCircle, styles.bottomCircle, { backgroundColor: COLORS.primary + '08' }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* Header Bar */}
          <View style={styles.header}>
            <Text style={[styles.logo, { color: COLORS.text || '#39264c' }]}>EcomNative</Text>
            <TouchableOpacity onPress={onSkip}>
              <Text style={[styles.skipBtn, { color: COLORS.primary }]}>SKIP</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <View style={styles.hero}>
              <Text style={[styles.title, { color: COLORS.blackText || '#39264c' }]}>
                {isSignup ? 'Join with Us' : 'Welcome back'}
              </Text>
              <Text style={styles.subtitle}>
                {isSignup
                  ? 'Create an account to start your curated experience.'
                  : 'Enter your details to continue your curated experience.'}
              </Text>
            </View>

            {/* Dynamic Form */}
            <View style={styles.form}>
              {isSignup && (
                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="John"
                      value={firstName}
                      onChangeText={onFirstNameChange}
                      placeholderTextColor="#846e99"
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Doe"
                      value={lastName}
                      onChangeText={onLastNameChange}
                      placeholderTextColor="#846e99"
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="hello@curator.com"
                  value={email}
                  onChangeText={onEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#846e99"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={onPasswordChange}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#846e99"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Text style={{ color: COLORS.primary, fontSize: 10, fontWeight: '700' }}>
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {isSignup && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChangeText={onConfirmPasswordChange}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#846e99"
                  />
                </View>
              )}

              {!isSignup && (
                <TouchableOpacity style={styles.forgotPass}>
                  <Text style={[styles.forgotPassText, { color: COLORS.primary }]}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {/* Action Button */}
              <TouchableOpacity
                onPress={isSignup ? onSignup : onLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primary + 'CC']} // 20% transparent for gradient effect
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isSignup ? 'Join Now' : 'Sign In'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>OR CONNECT WITH</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                  {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                </Text>
                <TouchableOpacity onPress={onToggleMode}>
                  <Text style={[styles.toggleAction, { color: COLORS.primary }]}>
                    {isSignup ? 'Sign In' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainBackground,
  },
  blurCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  topCircle: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  bottomCircle: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: -width * 0.1,
    left: -width * 0.1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 80,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -1,
  },
  skipBtn: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 40,
  },
  hero: {
    marginBottom: 40,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.blackText,
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.blackText,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.background + '60',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPassText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6d22ed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(104, 83, 124, 0.1)',
  },
  dividerText: {
    paddingHorizontal: 15,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text + '80',
    letterSpacing: 1.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: COLORS.text,
  },
  toggleAction: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default AuthLayoutGlass;