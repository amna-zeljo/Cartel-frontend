import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCart } from '../context/CartContext';

export default function OrderHistoryScreen({ navigation }) {
  const { orders } = useCart();
  const totalSavings = orders.reduce((sum, order) => sum + order.savings, 0);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.summary}>
          Saved {totalSavings.toFixed(2)} KM across {orders.length} orders.
        </Text>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={orders.length === 0 && styles.emptyList}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No previous orders</Text>
              <Text style={styles.emptyText}>Completed orders will appear here.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.order}>
              <Text style={styles.orderId}>{item.id}</Text>
              <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text style={styles.meta}>Market: {item.selectedMarket}</Text>
              <Text style={styles.meta}>
                Items: {item.items.reduce((sum, product) => sum + product.quantity, 0)}
              </Text>
              <Text style={styles.meta}>Paid: {item.totalAmount.toFixed(2)} KM</Text>
              <Text style={styles.savings}>Saved: {item.savings.toFixed(2)} KM</Text>
            </View>
          )}
        />

        <Pressable style={styles.button} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.buttonText}>Back to Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f6fb',
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  summary: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  order: {
    paddingVertical: 12,
  },
  orderId: {
    color: '#0f172a',
    fontWeight: '800',
    marginBottom: 6,
  },
  meta: {
    color: '#64748b',
    marginBottom: 4,
  },
  savings: {
    color: '#15803d',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  emptyList: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#64748b',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
