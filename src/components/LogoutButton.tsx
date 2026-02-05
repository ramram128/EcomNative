import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/profileScreen.styles';

interface LogoutButtonProps {
  onPress: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.logoutBtn} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name="log-out-outline" size={18} color="#555" />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
