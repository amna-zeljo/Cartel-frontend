import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import colors from "../../config/colors";
import styles from "../../config/styles";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";

export default function ProductDetailsScreen({ route }) {
  const { productId } = route.params;
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getProduct(productId);
        setProduct(data);
      } catch (error) {
        Alert.alert("Greška", error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const handleAddToCart = () => {
    addItem(product);
    Alert.alert("Dodano", `${product.name} je dodan u korpu.`);
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.screenPadded}>
        <Text style={styles.emptyText}>Proizvod nije pronađen.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16 }}>
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={{ width: "100%", height: 220, borderRadius: 12, backgroundColor: colors.border }}
        />
      ) : null}

      <Text style={[styles.headerTitle, { marginTop: 16 }]}>{product.name}</Text>
      <Text style={styles.subtitle}>
        {product.category} · {product.unit}
      </Text>
      {product.description ? (
        <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>{product.description}</Text>
      ) : null}

      <View style={[styles.card, { backgroundColor: "#E8F5E9" }]}>
        <Text style={{ color: colors.textSecondary }}>Najniža cijena</Text>
        <Text style={[styles.price, { fontSize: 28 }]}>{product.lowest_price.toFixed(2)} KM</Text>
      </View>

      <Text style={[styles.cardTitle, { marginBottom: 8 }]}>Cijene po marketima</Text>
      {product.prices.map((price) => (
        <View key={price.market_id} style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>{price.market_name}</Text>
            {price.on_sale ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>AKCIJA</Text>
              </View>
            ) : null}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
            {price.on_sale ? (
              <Text style={{ textDecorationLine: "line-through", color: colors.textSecondary }}>
                {price.price.toFixed(2)} KM
              </Text>
            ) : null}
            <Text style={styles.price}>{price.effective_price.toFixed(2)} KM</Text>
          </View>
        </View>
      ))}

      <Pressable style={styles.primaryButton} onPress={handleAddToCart}>
        <Text style={styles.primaryButtonText}>Dodaj u korpu</Text>
      </Pressable>
    </ScrollView>
  );
}
