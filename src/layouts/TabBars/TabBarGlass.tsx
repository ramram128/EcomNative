import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

const TAB_ICONS: Record<string, string> = {
    Shop: 'home-sharp',
    Search: 'search-sharp',
    Wishlist: 'heart-sharp',
    Cart: 'cart-sharp',
    Profile: 'person-sharp',
};

export const TabBarGlass = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.outerContainer, { bottom: insets.bottom + 5 }]}>
            <LinearGradient
                colors={[COLORS.background + 'CC', COLORS.background + 'EE']}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.container}>
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

                    const iconName = TAB_ICONS[route.name];
                    const color = isFocused ? COLORS.primary : (COLORS.textLight || '#926f64');

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.6}
                        >
                            <View style={[styles.iconWrapper, isFocused && styles.activeIconWrapper]}>
                                <Ionicons name={iconName} size={22} color={color} />
                            </View>
                            {isFocused && <View style={styles.activeDot} />}
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
        left: 20,
        right: 20,
        height: 65,
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border || 'rgba(255, 255, 255, 0.5)',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    container: {
        flexDirection: 'row',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIconWrapper: {
        backgroundColor: COLORS.primary + '1A',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
        marginTop: 2,
    },
});
