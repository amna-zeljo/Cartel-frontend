import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/components/priceComparisonTableStyles';

export default function PriceComparisonTable({ prices }) {
  return (
    <View style={styles.table}>
      {prices.map((item, index) => (
        <View key={item.market} style={[styles.row, index !== prices.length - 1 && styles.rowDivider]}>
          <Text style={styles.marketText}>{item.market}</Text>
          <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
}
