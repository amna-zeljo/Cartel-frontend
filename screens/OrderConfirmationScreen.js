import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function OrderConfirmationScreen({ navigation, route }) {
  const order = route.params?.order;

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>No order found</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.buttonText}>Back to Cart</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.success}>Order placed successfully</Text>
        <Text style={styles.meta}>Order ID: {order.id}</Text>
        <Text style={styles.meta}>Date: {new Date(order.createdAt).toLocaleString()}</Text>
        <Text style={styles.meta}>Market: {order.selectedMarket}</Text>
        <Text style={styles.meta}>Estimated savings: {order.savings.toFixed(2)} KM</Text>

        <Text style={styles.sectionTitle}>Products</Text>
        <FlatList
          data={order.items}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemValue}>
                {item.quantity} x {item.price.toFixed(2)} KM
              </Text>
            </View>
          )}
        />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{order.totalAmount.toFixed(2)} KM</Text>
        </View>

        <Pressable style={styles.button} onPress={() => navigation.navigate('OrderHistory')}>
          <Text style={styles.buttonText}>View Order History</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f3f6fb',
  },
  card: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  success: {
    color: '#15803d',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  title: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  meta: {
    color: '#334155',
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  itemName: {
    flex: 1,
    color: '#0f172a',
    marginRight: 12,
  },
  itemValue: {
    color: '#64748b',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  totalLabel: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '800',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#eaf2ff',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
