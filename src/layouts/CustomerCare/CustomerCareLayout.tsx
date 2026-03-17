import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/profileScreen.styles'; // Reuse your shared styles

interface CustomerCareLayoutProps {
  onBack: () => void;
  onCall: () => void;
  onEmail: () => void;
}

export const CustomerCareLayout: React.FC<CustomerCareLayoutProps> = ({
  onBack,
  onCall,
  onEmail,
}) => {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Care</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.desc}>
          Our support team is available 24/7 to help you.
        </Text>

        {/* Support Options */}
        <SupportCard 
          icon="call-outline" 
          label="Call Support" 
          onPress={onCall} 
        />
        
        <SupportCard 
          icon="mail-outline" 
          label="Email Support" 
          onPress={onEmail} 
        />

        <SupportCard 
          icon="chatbubble-ellipses-outline" 
          label="Live Chat (Coming Soon)" 
          disabled 
        />
      </View>
    </SafeAreaView>
  );
};

/* --- Local Component for clean cards --- */
const SupportCard = ({ icon, label, onPress, disabled }: any) => (
  <TouchableOpacity
    style={[styles.card, disabled && { opacity: 0.6 }]}
    onPress={onPress}
    disabled={disabled}
  >
    <Ionicons name={icon} size={22} color="#111" />
    <Text style={styles.cardText}>{label}</Text>
  </TouchableOpacity>
);