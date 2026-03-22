import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TAB_ICONS: Record<string, string> = {
    Shop: 'grid-outline',
    Search: 'search-outline',
    Wishlist: 'heart-outline',
    Cart: 'bag-handle-outline',
    Profile: 'person-outline',
};

const ACTIVE_ICONS: Record<string, string> = {
    Shop: 'grid',
    Search: 'search',
    Wishlist: 'heart',
    Cart: 'bag-handle',
    Profile: 'person',
};

export const TabBarModern = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { height: 65 + insets.bottom, paddingBottom: insets.bottom }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const iconName = isFocused ? ACTIVE_ICONS[route.name] : TAB_ICONS[route.name];
                const color = isFocused ? COLORS.primary : (COLORS.textLight || '#888');

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabItem}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.indicator, { backgroundColor: isFocused ? COLORS.primary : 'transparent' }]} />
                        <Ionicons name={iconName} size={24} color={color} />
                        <Text style={[styles.label, { color, fontWeight: isFocused ? '800' : '500' }]}>{route.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.white || '#fff',
        borderTopWidth: 1,
        borderTopColor: COLORS.border || '#f0f0f0',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        width: 20,
        height: 3,
        borderRadius: 2,
        position: 'absolute',
        top: 0,
    },
    label: {
        fontSize: 11,
        marginTop: 4,
    },
});
