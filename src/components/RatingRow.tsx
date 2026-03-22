import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/create.styles';

export const RatingRow = ({ value, count }: { value: number; count: number }) => {
    const rating = Math.min(5, Math.max(0, value));
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <View style={styles.ratingRow}>
            <View style={{ flexDirection: 'row', marginRight: 8 }}>
                {Array.from({ length: fullStars }).map((_, i) => (
                    <Ionicons key={`f-${i}`} name="star" size={16} color="#F5A623" />
                ))}
                {hasHalfStar && <Ionicons name="star-half" size={16} color="#F5A623" />}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <Ionicons key={`e-${i}`} name="star-outline" size={16} color="#F5A623" />
                ))}
            </View>
            <Text style={styles.ratingText}>
                {rating.toFixed(1)} {count > 0 && <Text style={{ fontSize: 12, color: '#888' }}>({count})</Text>}
            </Text>
        </View>
    );
};