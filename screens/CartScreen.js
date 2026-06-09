import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import QuantityControl from '../components/QuantityControl';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cart, total, increase, decrease, remove, placeOrder } = useCart();

  const handlePlaceOrder = () => {
    const order = placeOrder('Cartel recommended market');

    if (order) {
      navigation.replace('OrderConfirmation', { order });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topActions}>
        <Text style={styles.heading}>My Cart</Text>
        <Pressable onPress={() => navigation.navigate('OrderHistory')}>
          <Text style={styles.historyLink}>Order History</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          contentContainerStyle={cart.length === 0 && styles.emptyList}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptyText}>Continue shopping to browse products.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price.toFixed(2)} KM each</Text>
                <Pressable onPress={() => remove(item.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
              <View style={styles.itemControls}>
                <QuantityControl
                  value={item.quantity}
                  onIncrease={() => increase(item.id)}
                  onDecrease={() => decrease(item.id)}
                />
                <Text style={styles.lineTotal}>
                  {(item.price * item.quantity).toFixed(2)} KM
                </Text>
              </View>
            </View>
          )}
        />

        <View style={styles.summary}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} KM</Text>
          </View>
          <Pressable
            disabled={cart.length === 0}
            onPress={handlePlaceOrder}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
              cart.length === 0 && styles.disabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>Place Order</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Search')}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
    padding: 16,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heading: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '800',
  },
  historyLink: {
    color: '#2563eb',
    fontWeight: '700',
  },
  card: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  item: {
    flexDirection: 'row',
    padding: 16,
  },
  itemDetails: {
    flex: 1,
    paddingRight: 12,
  },
  itemName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  itemPrice: {
    color: '#64748b',
    marginTop: 4,
  },
  remove: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 9,
  },
  itemControls: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  lineTotal: {
    color: '#334155',
    fontWeight: '700',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginLeft: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
  },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  totalLabel: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '700',
  },
  totalValue: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: '#eaf2ff',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.45,
  },
});
