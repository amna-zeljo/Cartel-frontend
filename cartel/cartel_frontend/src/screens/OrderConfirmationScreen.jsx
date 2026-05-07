import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';

function formatDate(isoString) {
  return new Date(isoString).toLocaleString();
}

export default function OrderConfirmationScreen({ order, onViewHistory, onBackToCart }) {
  if (!order) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Order Confirmation</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.message}>No order found.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={onBackToCart}>
            <Text style={styles.primaryText}>Back to Cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Confirmation</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.success}>Order placed successfully.</Text>
        <Text style={styles.info}>Order ID: {order.id}</Text>
        <Text style={styles.info}>Date: {formatDate(order.createdAt)}</Text>
        <Text style={styles.info}>Selected Market: {order.selectedMarket}</Text>
        <Text style={styles.info}>Savings: {order.savings.toFixed(2)} KM</Text>

        <Text style={styles.sectionTitle}>Products</Text>
        <FlatList
          data={order.items}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.value}>
                {item.quantity} x {item.price.toFixed(2)} KM
              </Text>
            </View>
          )}
        />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{order.totalAmount.toFixed(2)} KM</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onViewHistory}>
          <Text style={styles.primaryText}>View History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.primaryButton, styles.secondaryBtn]} onPress={onBackToCart}>
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
  success: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  info: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 6,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  name: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  value: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  totalRow: {
    marginTop: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: colors.text,
    fontSize: 16,
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
