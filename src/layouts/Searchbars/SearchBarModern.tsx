import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/theme';

interface SearchBarProps {
    onChangeText: (text: string) => void;
}

export const SearchBarModern = ({ onChangeText }: SearchBarProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={20} color={COLORS.primary} />
                <TextInput
                    placeholder="Search products..."
                    style={styles.input}
                    onChangeText={onChangeText}
                    placeholderTextColor={COLORS.textLight || "#999"}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: '#ff0000ff',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#271813',
    },
});