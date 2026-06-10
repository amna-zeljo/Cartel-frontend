import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import colors from "../../config/colors";
import styles from "../../config/styles";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";

export default function ChooseMarketScreen({ navigation }) {
  const { items, clearCart } = useCart();
  const [calculation, setCalculation] = useState(null);
  const [selectedMarketId, setSelectedMarketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const selectedMarket = calculation?.per_market?.find(
    (market) => market.market_id === selectedMarketId
  );

  const totalQuantity = items.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    (async () => {
      try {
        const cartItems = items.map((item) => ({
          product_id: item.product_id,
          qty: item.qty,
        }));

        const data = await api.calculateOrder(cartItems);
        setCalculation(data);
        setSelectedMarketId(data.cheapest_single_market?.market_id);
      } catch (error) {
        Alert.alert("Greška", error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [items]);

  const handlePlaceOrder = async () => {
    if (!selectedMarketId) return;

    setSubmitting(true);

    try {
      const cartItems = items.map((item) => ({
        product_id: item.product_id,
        qty: item.qty,
      }));

      await api.placeOrder({
        market_id: selectedMarketId,
        items: cartItems,
      });

      clearCart();

      Alert.alert("Uspjeh", "Narudžba je uspješno kreirana!", [
        {
          text: "Pogledaj lokacije",
          onPress: () => navigation.replace("Map", { marketId: selectedMarketId }),
        },
        {
          text: "Početna",
          onPress: () => navigation.popToTop(),
        },
      ]);
    } catch (error) {
      Alert.alert("Greška", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screenPadded}>
      <Text style={styles.headerTitle}>Odaberi market</Text>
      <Text style={styles.subtitle}>
        Uporedite ukupne cijene i odaberite market za narudžbu
      </Text>

      {calculation ? (
        <View style={[styles.card, { backgroundColor: "#E8F5E9" }]}>
          <Text style={{ color: colors.textSecondary }}>
            Najjeftinije po proizvodu (svi marketi)
          </Text>

          <Text style={[styles.price, { fontSize: 22 }]}>
            {Number(calculation.cheapest_per_product_total || 0).toFixed(2)} KM
          </Text>

          <Text style={{ color: colors.success, marginTop: 6, fontWeight: "600" }}>
            Maks. ušteda: {Number(calculation.max_savings || 0).toFixed(2)} KM
          </Text>
        </View>
      ) : null}

      {selectedMarket ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pregled narudžbe</Text>

          <Text style={styles.cardSubtitle}>
            Odabrani market: {selectedMarket.market_name}
          </Text>

          <Text style={styles.cardSubtitle}>
            Proizvodi: {items.length} različitih / {totalQuantity} ukupno
          </Text>

          <Text style={styles.cardSubtitle}>
            Ukupno za odabrani market: {Number(selectedMarket.total || 0).toFixed(2)} KM
          </Text>
        </View>
      ) : null}

      <FlatList
        data={calculation?.per_market || []}
        keyExtractor={(item) => String(item.market_id)}
        renderItem={({ item }) => {
          const selected = selectedMarketId === item.market_id;
          const missingProducts = Array.isArray(item.missing_products)
            ? item.missing_products
            : [];

          return (
            <Pressable
              style={[
                styles.card,
                selected && { borderColor: colors.primary, borderWidth: 2 },
                item.is_cheapest && { backgroundColor: "#FFF8E1" },
              ]}
              onPress={() => setSelectedMarketId(item.market_id)}
            >
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {item.market_name}
                    {item.is_cheapest ? " ★ Najjeftinije" : ""}
                  </Text>

                  <Text style={styles.cardSubtitle}>
                    Dostupno: {item.available_items}/{items.length} proizvoda
                  </Text>

                  {!item.is_complete && missingProducts.length > 0 ? (
                    <Text style={{ color: colors.error, fontSize: 12, marginTop: 4 }}>
                      Nedostaje: {missingProducts.join(", ")}
                    </Text>
                  ) : null}
                </View>

                <Text style={styles.price}>
                  {Number(item.total || 0).toFixed(2)} KM
                </Text>
              </View>
            </Pressable>
          );
        }}
      />

      <Pressable
        style={[styles.primaryButton, submitting && { opacity: 0.6 }]}
        onPress={handlePlaceOrder}
        disabled={submitting || !selectedMarketId}
      >
        <Text style={styles.primaryButtonText}>
          {submitting ? "Naručujem..." : "Potvrdi narudžbu"}
        </Text>
      </Pressable>

      {selectedMarketId ? (
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Map", { marketId: selectedMarketId })}
        >
          <Text style={styles.secondaryButtonText}>Pogledaj lokacije na mapi</Text>
        </Pressable>
      ) : null}
    </View>
  );
}