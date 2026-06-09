import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function QuantityControl({ value, onIncrease, onDecrease }) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Decrease quantity"
        onPress={onDecrease}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>-</Text>
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        accessibilityLabel="Increase quantity"
        onPress={onIncrease}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 4,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#2563eb',
    fontSize: 19,
    fontWeight: '700',
  },
  value: {
    minWidth: 34,
    textAlign: 'center',
    color: '#0f172a',
    fontWeight: '700',
  },
});
