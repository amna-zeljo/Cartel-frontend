import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function QuantityControl({ value, onIncrease, onDecrease }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrease} style={styles.button}>
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>
      <View style={styles.valueWrap}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
      <TouchableOpacity onPress={onIncrease} style={styles.button}>
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    padding: 4,
    borderRadius: 8,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 18,
    color: colors.blue,
    fontWeight: '600',
    lineHeight: 18,
  },
  valueWrap: {
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  valueText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
});
