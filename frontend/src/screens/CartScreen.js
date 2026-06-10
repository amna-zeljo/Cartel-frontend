import React from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import colors from "../../config/colors";
import styles from "../../config/styles";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const { items, updateQty, removeItem } = useCart();

  const estimatedTotal = items.reduce(
    (sum, item) => sum + item.lowest_price * item.qty,
    0
  );

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Korpa je prazna", "Dodajte proizvode prije naručivanja.");
      return;
    }
    navigation.navigate("ChooseMarket");
  };

  return (
    <View style={styles.screenPadded}>
      <Text style={styles.headerTitle}>Korpa</Text>
      <Text style={styles.subtitle}>{items.length} različitih proizvoda</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.product_id)}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Vaša korpa je prazna.{"\n"}Pretražite proizvode i dodajte ih ovdje.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>
                  {item.lowest_price.toFixed(2)} KM / {item.unit}
                </Text>
              </View>
              <Pressable onPress={() => removeItem(item.product_id)}>
                <Text style={{ color: colors.error, fontWeight: "600" }}>Ukloni</Text>
              </Pressable>
            </View>
            <View style={[styles.rowBetween, { marginTop: 12 }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <Pressable
                  onPress={() => updateQty(item.product_id, item.qty - 1)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "700" }}>−</Text>
                </Pressable>
                <Text style={{ fontSize: 18, fontWeight: "600", minWidth: 24, textAlign: "center" }}>
                  {item.qty}
                </Text>
                <Pressable
                  onPress={() => updateQty(item.product_id, item.qty + 1)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFF" }}>+</Text>
                </Pressable>
              </View>
              <Text style={styles.price}>
                {(item.lowest_price * item.qty).toFixed(2)} KM
              </Text>
            </View>
          </View>
        )}
      />

      {items.length > 0 ? (
        <View style={[styles.card, { marginTop: 8 }]}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Procijenjeno (najjeftinije)</Text>
            <Text style={styles.price}>{estimatedTotal.toFixed(2)} KM</Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={handleCheckout}>
            <Text style={styles.primaryButtonText}>Naruči</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
