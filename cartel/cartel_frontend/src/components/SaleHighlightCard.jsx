import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/components/saleHighlightCardStyles';

export default function SaleHighlightCard({ market, price }) {
  return (
    <View style={styles.saleBox}>
      <Text style={styles.saleTitle}>On Sale at {market}!</Text>
      <Text style={styles.saleValue}>Now ${price.toFixed(2)}</Text>
    </View>
  );
}
