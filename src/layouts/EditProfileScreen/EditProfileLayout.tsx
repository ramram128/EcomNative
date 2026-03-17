import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProfileField } from '../../components/EditProfile/ProfileField';
import { styles } from '../../styles/profileScreen.styles';

interface EditProfileLayoutProps {
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  onBack: () => void;
  avatar: string;
  onDeleteUser?: () => void;
  loading?: boolean;
}

export const EditProfileLayoutModern: React.FC<EditProfileLayoutProps> = ({
  formData,
  setFormData,
  onSave,
  onBack,
  avatar,
  onDeleteUser,
  loading = false,
}) => {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={onSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera-outline" size={16} color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <ProfileField 
            label="Full Name" 
            value={formData.name} 
            onChangeText={(t) => setFormData({...formData, name: t})} 
          />
          <ProfileField 
            label="Email" 
            value={formData.email} 
            keyboardType="email-address"
            onChangeText={(t) => setFormData({...formData, email: t})} 
          />
          {/* Add other fields similarly */}
          
          <TouchableOpacity style={styles.bigSaveBtn} onPress={onSave} disabled={loading}>
            <Text style={styles.bigSaveText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          {onDeleteUser && (
            <TouchableOpacity 
              style={[styles.bigSaveBtn, styles.deleteBtn]} 
              onPress={onDeleteUser}
              disabled={loading}
            >
              <Text style={styles.deleteText}>Delete Account</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};