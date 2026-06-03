import React from 'react';
import { View } from 'react-native';
import styles from '../styles/components/appCardStyles';

export default function AppCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}
