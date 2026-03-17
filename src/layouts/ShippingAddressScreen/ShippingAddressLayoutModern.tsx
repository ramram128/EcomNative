import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { InputField } from '../../components/InputField';
import { styles } from '../../styles/shippingaddress.styles';


export interface ShippingAddressData {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface ShippingAddressLayoutProps {
  address: any;
  loading: boolean;
  isAuthenticated: boolean;
  isEditing: boolean;
  saving: boolean;
  formData: ShippingAddressData;
  onFormDataChange: (data: ShippingAddressData) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onBack: () => void;
  onLogin: () => void;
}

const ShippingAddressLayoutModern: React.FC<ShippingAddressLayoutProps> = ({
  address,
  loading,
  isEditing,
  saving,
  formData,
  onFormDataChange,
  isAuthenticated,
  onEdit,
  onSave,
  onCancel,
  onBack,
  onLogin,
}) => {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={22}
          color="#111"
          onPress={onBack}
        />
        <Text style={styles.headerTitle}>Shipping Address</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#d4145a" />
        ) : !isAuthenticated ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
              Please login to view your shipping address
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#d4145a',
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 10,
              }}
              onPress={onLogin}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        ) : isEditing ? (
          // Edit Form
          <View>
            <Text style={styles.sectionTitle}>Add/Edit Address</Text>

            <InputField
              label="First Name"
              value={formData.first_name}
              onChangeText={(text) => onFormDataChange({ ...formData, first_name: text })}
              placeholder="Enter first name"
            />

            <InputField
              label="Last Name"
              value={formData.last_name}
              onChangeText={(text) => onFormDataChange({ ...formData, last_name: text })}
              placeholder="Enter last name"
            />

            <InputField
              label="Address Line 1"
              value={formData.address_1}
              onChangeText={(text) => onFormDataChange({ ...formData, address_1: text })}
              placeholder="Enter address line 1"
            />

            <InputField
              label="Address Line 2 (Optional)"
              value={formData.address_2}
              onChangeText={(text) => onFormDataChange({ ...formData, address_2: text })}
              placeholder="Enter address line 2"
            />

            <InputField
              label="City"
              value={formData.city}
              onChangeText={(text) => onFormDataChange({ ...formData, city: text })}
              placeholder="Enter city"
            />

            <InputField
              label="State"
              value={formData.state}
              onChangeText={(text) => onFormDataChange({ ...formData, state: text })}
              placeholder="Enter state"
            />

            <InputField
              label="Postcode"
              value={formData.postcode}
              onChangeText={(text) => onFormDataChange({ ...formData, postcode: text })}
              placeholder="Enter postcode"
              keyboardType="numeric"
            />

            <InputField
              label="Country"
              value={formData.country}
              onChangeText={(text) => onFormDataChange({ ...formData, country: text })}
              placeholder="Enter country"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelBtn]}
                onPress={onCancel}
                disabled={saving}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveBtn]}
                onPress={onSave}
                disabled={saving}
              >
                <Text style={styles.saveText}>
                  {saving ? 'Saving...' : 'Save Address'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : address && address.address_1 ? (
          // Display Address
          <View>
            <Text style={styles.sectionTitle}>Current Address</Text>
            <View style={styles.card}>
              <Text style={styles.name}>{address.first_name} {address.last_name}</Text>
              <Text style={styles.text}>{address.address_1}</Text>
              {address.address_2 ? <Text style={styles.text}>{address.address_2}</Text> : null}
              <Text style={styles.text}>
                {address.city}, {address.state} – {address.postcode}
              </Text>
              <Text style={styles.text}>{address.country}</Text>
            </View>
          </View>
        ) : (
          // No Address Message
          <View>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <View style={styles.card}>
              <Text style={styles.text}>No shipping address found.</Text>
            </View>
          </View>
        )}

        {!isEditing && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={onEdit}
          >
            <Ionicons name="add-outline" size={18} color="#fff" />
            <Text style={styles.addText}>
              {address?.address_1 ? 'Edit Address' : 'Add New Address'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShippingAddressLayoutModern;

