import React, { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useShop } from '../../store/shopStore';
import { CustomerService } from '../../api/wooApi2';
import { SelectedShippingAddressLayout } from '../../layouts';
import type { ShippingAddressData } from '../../layouts/ShippingAddressScreen';

const ShippingAddressScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useShop();
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ShippingAddressData>({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  });

  const fetchAddress = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await CustomerService.getCustomer(user.id);
      // WooCommerce returns 'shipping' and 'billing' objects
      setAddress(data.shipping);
    } catch (error) {
      console.error('Failed to fetch address:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const handleEdit = () => {
    setFormData({
      first_name: address?.first_name || '',
      last_name: address?.last_name || '',
      address_1: address?.address_1 || '',
      address_2: address?.address_2 || '',
      city: address?.city || '',
      state: address?.state || '',
      postcode: address?.postcode || '',
      country: address?.country || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await CustomerService.updateCustomer(user.id, { shipping: formData });
      setAddress(formData);
      setIsEditing(false);
      Alert.alert('Success', 'Address updated successfully');
    } catch (error) {
      console.error('Failed to update address:', error);
      Alert.alert('Error', 'Failed to update address');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFormDataChange = (data: ShippingAddressData) => {
    setFormData(data);
  };

  return (
    <SelectedShippingAddressLayout
      address={address}
      loading={loading}
      isAuthenticated={!!user?.id}
      isEditing={isEditing}
      saving={saving}
      formData={formData}
      onFormDataChange={handleFormDataChange}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onBack={() => navigation.goBack()}
      onLogin={() => navigation.navigate('Auth' as never)}
    />
  );
};

export default ShippingAddressScreen;
