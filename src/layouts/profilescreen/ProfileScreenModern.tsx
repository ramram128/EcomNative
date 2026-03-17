import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/profileScreen.styles';

// Import the shared interface
import { ProfileLayoutProps } from '../../layouts/profilescreen'; 

import ProfileHeader from '../../components/ProfileHeader';
import OrdersSection from '../../components/OrdersSection';
import MenuSection from '../../components/MenuSection';
import LogoutButton from '../../components/LogoutButton';
import { useShop } from '../../store/shopStore'; // To handle logout logic

const ProfileScreenModern: React.FC<ProfileLayoutProps> = ({ 
  user, 
  isAuthenticated,
  menu, 
  onBack,
  onLogin,
}) => {
  const navigation = useNavigation<any>();
  const { setAuth } = useShop();

  const handleLogout = () => {
    setAuth(false);
    navigation.navigate('Auth' as never);
  };

  const handleLogin = () => {
    navigation.navigate('Auth' as never);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          user={user} // Now uses data from ProfileScreen.tsx
          onBackPress={onBack || (() => navigation.goBack())}
          onCameraPress={() => {/* Add logic to change avatar if needed */}}
        />

        {/* Pass the navigation to the OrdersSection */}
        <OrdersSection navigation={navigation} />

        <MenuSection menu={menu} />

        {isAuthenticated ? (
          <LogoutButton onPress={handleLogout} />
        ) : (
          <LogoutButton onPress={onLogin ?? handleLogin} label="Login" iconName="log-in-outline" />
        )}

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreenModern;