import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/components/cheapestOptionCardStyles';

export default function CheapestOptionCard({ market, total }) {
  return (
    <View style={styles.cheapestBox}>
      <Text style={styles.cheapestLabel}>Cheapest Option:</Text>
      <View style={styles.cheapestRow}>
        <Text style={styles.cheapestMarket}>{market}:</Text>
        <Text style={styles.cheapestValue}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
}
