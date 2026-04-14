import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SelectedAuthLayout } from '../../layouts/auth';
import { CustomerService } from '../../api/wooApi2';
import { useShop } from '../../store/shopStore';
import { usePopup } from '../../context/PopupContext';

const AuthScreen = () => {
  const navigation = useNavigation();
  const { setAuth } = useShop();
  const { showAlert, showToast } = usePopup();

  // Form state
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  // Business logic
  const handleSignup = async () => {
    if (!email || !password || !firstName || !lastName) {
      showAlert('Required Fields', 'Please fill all mandatory fields', 'warning');
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const customer = await CustomerService.login({ email, password });
      setAuth(true, {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
      });
      // Alert.alert('Success', 'Logged in successfully');
      showToast('Welcome back!', customer.email);
      navigation.navigate('Tabs' as never);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      showAlert('Login Error', message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignup(!isSignup);
  };

  return (
    <SelectedAuthLayout
      isSignup={isSignup}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      firstName={firstName}
      lastName={lastName}
      loading={loading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onFirstNameChange={setFirstName}
      onLastNameChange={setLastName}
      onToggleMode={handleToggleMode}
      onSignup={handleSignup}
      onLogin={handleLogin}
      onSkip={handleSkip}
    />
  );
};

export default AuthScreen;