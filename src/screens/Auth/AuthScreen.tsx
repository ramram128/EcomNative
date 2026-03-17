import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';
import { CustomerService } from '../../api/wooApi2';
import { useShop } from '../../store/shopStore';

const AuthScreen = () => {
  const navigation = useNavigation();
  const { setAuth } = useShop();
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill all mandatory fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const customer = await CustomerService.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      setAuth(true, { 
        id: customer.id,
        email, 
        first_name: firstName, 
        last_name: lastName 
      });
      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('Tabs' as never);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Unknown error';
      Alert.alert('Error', 'Registration failed: ' + message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Tabs' as never);
  };

  const handleLogin = () => {
    // TODO: Implement actual login API call
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    // Placeholder: set auth to true with mock user ID
    // In real implementation, this would come from login API response
    setAuth(true, { 
      id: 5, // Mock user ID - replace with real API response
      email 
    });
    Alert.alert('Success', 'Logged in successfully');
    navigation.navigate('Tabs' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authenticate</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !isSignup && styles.activeButton]}
          onPress={() => setIsSignup(false)}
        >
          <Text style={[styles.buttonText, !isSignup && styles.activeButtonText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSignup && styles.activeButton]}
          onPress={() => setIsSignup(true)}
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
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSignup} disabled={loading}>
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
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
            <Text style={styles.submitButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
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

export default AuthScreen;