import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/profileScreen.styles';

interface LogoutButtonProps {
  onPress: () => void;
  label?: string;
  iconName?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress, label = 'Logout', iconName = 'log-out-outline' }) => {
  return (
    <TouchableOpacity style={styles.logoutBtn} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={iconName as any} size={18} color="#555" />
      <Text style={styles.logoutText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
