import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/profileScreen.styles';

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface MenuSectionProps {
  menu: MenuItem[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ menu }) => {
  return (
    <View style={styles.menuCard}>
      {menu.map((m, idx) => (
        <React.Fragment key={m.key}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={m.onPress}
            activeOpacity={0.85}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={m.icon} size={20} color="#444" />
              <Text style={styles.menuText}>{m.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          {idx !== menu.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default MenuSection;
