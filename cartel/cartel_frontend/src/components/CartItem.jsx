import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QuantityControl from './QuantityControl';
import colors from '../theme/colors';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { increase, decrease } = useCart();

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.name}>{item.name}</Text>
      </View>

      <View style={styles.right}>
        <QuantityControl
          value={item.quantity}
          onIncrease={() => increase(item.id)}
          onDecrease={() => decrease(item.id)}
        />
        <Text style={styles.linePrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  linePrice: {
    marginTop: 6,
    fontSize: 14,
    color: colors.gray,
    fontWeight: '600',
  },
});
