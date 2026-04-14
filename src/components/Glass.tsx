import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Glass = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
    </View>
  );
};