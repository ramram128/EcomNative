import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { EditProfileLayoutModern } from '../../layouts/EditProfileScreen/EditProfileLayout';
import { useShop } from '../../store/shopStore';
import { CustomerService } from '../../api/wooApi2';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { isAuthenticated, user, setAuth } = useShop();

  // 1. State Management
  const [formData, setFormData] = useState({
    name: '',
    role: 'Customer',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80');

  // Load user data on mount
  const loadUserData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const customerData = await CustomerService.getCustomer(user.id);
      setFormData({
        name: `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim(),
        role: customerData.role || 'Customer',
        email: customerData.email || '',
        phone: customerData.billing?.phone || customerData.shipping?.phone || '',
      });
      if (customerData.avatar_url) {
        setAvatar(customerData.avatar_url);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Fallback to basic user info
      setFormData({
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        role: 'Customer',
        email: user.email || '',
        phone: '',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserData();
    }
  }, [isAuthenticated, user?.id, loadUserData]);

  // 2. Logic Functions
  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = formData.name.split(' ');
      const lastName = lastNameParts.join(' ');

      await CustomerService.updateCustomer(user.id, {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        billing: {
          phone: formData.phone,
        },
        shipping: {
          phone: formData.phone,
        },
      });

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Unknown error';
      Alert.alert('Error', 'Failed to update profile: ' + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDeleteUser,
        },
      ]
    );
  };

  const confirmDeleteUser = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await CustomerService.deleteCustomer(user.id);
      setAuth(false, null);
      Alert.alert('Success', 'Account deleted successfully');
      navigation.navigate('Auth' as never);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Unknown error';
      Alert.alert('Error', 'Failed to delete account: ' + message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Render the Layout
  return (
    <EditProfileLayoutModern
      formData={formData}
      setFormData={setFormData}
      onSave={handleSave}
      onBack={() => navigation.goBack()}
      avatar={avatar}
      onDeleteUser={handleDeleteUser}
      loading={loading}
    />
  );
}