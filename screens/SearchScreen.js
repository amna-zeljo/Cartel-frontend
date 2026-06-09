import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useCart } from '../context/CartContext';

const PRODUCTS = [
  { id: '1', name: 'Wireless Headphones', price: 79.99 },
  { id: '2', name: 'Smartphone Stand', price: 14.5 },
  { id: '3', name: 'Bluetooth Speaker', price: 39.99 },
  { id: '4', name: 'Laptop Backpack', price: 59.0 },
  { id: '5', name: 'Mechanical Keyboard', price: 99.95 },
  { id: '6', name: 'Gaming Mouse', price: 45.25 },
  { id: '7', name: 'USB-C Hub', price: 29.99 },
  { id: '8', name: 'Desk Lamp', price: 22.75 },
];

export default function SearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const { itemCount } = useCart();

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase().trim())
    );
  }, [searchText]);

  const handleProductPress = (product) => {
    const message = `${product.name}\nPrice: $${product.price.toFixed(2)}`;

    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(product.name, `Price: $${product.price.toFixed(2)}`);
    }
  };

  const renderProduct = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.productCard,
        pressed && styles.productCardPressed,
      ]}
      onPress={() => handleProductPress(item)}
    >
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#8a94a6"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.featureButtons}>
        <Pressable
          style={({ pressed }) => [styles.featureButton, pressed && styles.featureButtonPressed]}
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={styles.featureButtonText}>Store Map</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.featureButton, pressed && styles.featureButtonPressed]}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.featureButtonText}>Cart ({itemCount})</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No products found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  searchWrapper: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9e2ef',
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1e293b',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  listContent: {
    paddingBottom: 24,
  },
  featureButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  featureButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  featureButtonPressed: {
    opacity: 0.85,
  },
  featureButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e7edf7',
    shadowColor: '#1e293b',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  productCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  productName: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    flex: 1,
    marginRight: 14,
  },
  productPrice: {
    fontSize: 17,
    color: '#2563eb',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 28,
    fontSize: 15,
  },
});
