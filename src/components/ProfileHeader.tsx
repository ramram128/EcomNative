import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/profileScreen.styles';

interface ProfileHeaderProps {
  user: {
    name: string;
    role?: string;
    avatar?: string;
  };
  onBackPress: () => void;
  onCameraPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onBackPress,
  onCameraPress,
}) => {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBackPress}
        >
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Wave background */}
      <View style={styles.waveHolder}>
        <View style={styles.wave} />
        <View style={styles.waveAccent1} />
        <View style={styles.waveAccent2} />
      </View>

      {/* Avatar + name */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: user.avatar || 'https://via.placeholder.com/300' }} style={styles.avatar} />
          <TouchableOpacity style={styles.cameraBtn} onPress={onCameraPress}>
            <Ionicons name="camera-outline" size={16} color="#111" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role || ''}</Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
