import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../../styles/profileScreen.styles';

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}

export const ProfileField: React.FC<FieldProps> = ({ label, value, onChangeText, keyboardType }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType ?? 'default'}
      placeholder={`Enter ${label.toLowerCase()}`}
      placeholderTextColor="#999"
      style={styles.input}
    />
  </View>
);