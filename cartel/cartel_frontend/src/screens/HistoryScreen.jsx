import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';

function formatDate(isoString) {
  return new Date(isoString).toLocaleString();
}

export default function HistoryScreen({ orders, onBackToCart }) {
  const totalSavings = orders.reduce((sum, order) => sum + order.savings, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.summary}>
          You have saved {totalSavings.toFixed(2)} KM with your last {orders.length} purchases.
        </Text>

        {orders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No previous orders yet.</Text>
            <Text style={styles.emptyText}>Place your first order to see your history here.</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Text style={styles.orderId}>Order ID: {item.id}</Text>
                <Text style={styles.meta}>Date: {formatDate(item.createdAt)}</Text>
                <Text style={styles.meta}>Market: {item.selectedMarket}</Text>
                <Text style={styles.meta}>
                  Item Count: {item.items.reduce((sum, orderItem) => sum + orderItem.quantity, 0)}
                </Text>
                <Text style={styles.meta}>Total Paid: {item.totalAmount.toFixed(2)} KM</Text>
                <Text style={styles.meta}>Savings: {item.savings.toFixed(2)} KM</Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={onBackToCart}>
          <Text style={styles.primaryText}>Back to Cart</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  summary: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    color: colors.gray,
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 10,
  },
  orderItem: {
    paddingVertical: 4,
  },
  orderId: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    color: colors.gray,
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  primaryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
