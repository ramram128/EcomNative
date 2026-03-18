import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants/theme';

export interface AuthLayoutProps {
  isSignup: boolean;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onFirstNameChange: (firstName: string) => void;
  onLastNameChange: (lastName: string) => void;
  onToggleMode: () => void;
  onSignup: () => void;
  onLogin: () => void;
  onSkip: () => void;
}

const AuthLayoutModern: React.FC<AuthLayoutProps> = ({
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authenticate</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !isSignup && styles.activeButton]}
          onPress={() => onToggleMode()}
        >
          <Text style={[styles.buttonText, !isSignup && styles.activeButtonText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSignup && styles.activeButton]}
          onPress={() => onToggleMode()}
        >
          <Text style={[styles.buttonText, isSignup && styles.activeButtonText]}>Signup</Text>
        </TouchableOpacity>
      </View>

      {isSignup ? (
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={onFirstNameChange}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={onLastNameChange}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={onEmailChange}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={onPasswordChange}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={onConfirmPasswordChange}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={onSignup} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={onEmailChange}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={onPasswordChange}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={onLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.primary,
  },
  activeButtonText: {
    color: '#fff',
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  skipButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthLayoutModern;