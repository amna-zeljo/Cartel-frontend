import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function CartScreen() {
  const { cart, total } = useCart();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.back}>‹</Text>
        <Text style={styles.title}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <FlatList
          data={cart}
          keyExtractor={(i) => i.id}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          renderItem={({ item }) => <CartItem item={item} />}
          contentContainerStyle={{}}
        />

        <View style={styles.summary}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
            <Text style={styles.primaryText}>Place Order</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.primaryButton, styles.secondaryBtn]} onPress={() => {}}>
            <Text style={styles.primaryText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 64,
    backgroundColor: colors.blue,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  back: {
    color: colors.white,
    fontSize: 22,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 14,
  },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: colors.lightBlue,
  },
});
