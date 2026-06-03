import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/components/marketTotalsListStyles';

export default function MarketTotalsList({ marketTotals, selectedMarket, onSelectMarket }) {
  return (
    <View style={styles.listWrap}>
      {marketTotals.map((item, index) => (
        <TouchableOpacity
          key={item.market}
          style={[
            styles.row,
            selectedMarket === item.market && styles.selectedRow,
            index !== marketTotals.length - 1 && styles.rowDivider,
          ]}
          onPress={() => onSelectMarket(item.market)}
          activeOpacity={0.85}
        >
          <Text style={styles.marketName}>{item.market}:</Text>
          <Text style={styles.marketTotal}>${item.total.toFixed(2)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
