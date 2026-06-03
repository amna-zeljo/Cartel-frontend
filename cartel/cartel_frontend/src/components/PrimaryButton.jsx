import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../styles/components/primaryButtonStyles';

export default function PrimaryButton({ label, onPress = () => {}, secondary = false, style }) {
  return (
    <TouchableOpacity style={[styles.button, secondary && styles.secondary, style]} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}
