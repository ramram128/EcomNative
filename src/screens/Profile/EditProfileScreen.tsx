import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../../styles/editProfile.styles';
import { COLORS } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const navigation = useNavigation();

  // 🔹 Local form state (replace with API data later)
  const [name, setName] = useState('Roan Atkinson');
  const [email, setEmail] = useState('roan@email.com');
  const [phone, setPhone] = useState('+91 98765 43210');

  const onSave = () => {
    // 🔥 TODO: connect API / Redux / Zustand
    console.log('Saved profile:', { name, email, phone });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* INPUT: NAME */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            style={styles.input}
          />
        </View>

        {/* INPUT: EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        {/* INPUT: PHONE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
