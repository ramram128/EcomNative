import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');

// Matching the icons from your image
const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
    Home: { icon: 'home', label: 'Home' },
    Search: { icon: 'search', label: 'Search' },
    Wishlist: { icon: 'heart', label: 'Wishlist' },
    Cart: { icon: 'cart', label: 'Cart' },
    Profile: { icon: 'person', label: 'Profile' },
};

export const TabBarCrystal = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.outerContainer, { bottom: insets.bottom }]}>
            {/* Glassmorphism Background */}
            {Platform.OS === 'ios' ? (
                <BlurView
                    style={StyleSheet.absoluteFill}
                    blurType="dark"
                    blurAmount={15}
                />
            ) : (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20, 20, 30, 0.85)' }]} />
            )}

            <View style={styles.container}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const { icon, label } = TAB_CONFIG[route.name] || { icon: 'ellipse', label: route.name };

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

                    // Active color is a bright cyan/blue; Inactive is a muted grey
                    const activeColor = COLORS.primary;
                    const inactiveColor = '#8E8E93';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name={isFocused ? `${icon}` : `${icon}-outline`}
                                    size={22}
                                    color={isFocused ? activeColor : inactiveColor}
                                    style={isFocused ? styles.activeIconGlow : {}}
                                />
                            </View>
                            <Text style={[
                                styles.label,
                                { color: isFocused ? activeColor : inactiveColor }
                            ]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        alignSelf: 'center',
        width: width * 0.9, // Pill shape doesn't touch edges
        height: 60,
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        // Shadow for the bar itself
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    container: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconContainer: {
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIconGlow: {
        // Glow effect for iOS
        shadowColor: '#4CC9FE',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
    },
});