import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../../config/colors";
import styles from "../../config/styles";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [savings, history] = await Promise.all([
        api.getSavingsSummary(),
        api.getOrderHistory(),
      ]);

      setSummary(savings);
      setOrders(Array.isArray(history) ? history : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [])
  );

  const formatDate = (iso) => {
    if (!iso) return "Nepoznat datum";

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "Nepoznat datum";

    return date.toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.headerTitle}>Početna</Text>
          <Text style={styles.subtitle}>Zdravo, {user?.name || "korisniče"}</Text>
        </View>

        <Pressable onPress={logout}>
          <Text style={{ color: colors.primary, fontWeight: "600" }}>Odjava</Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={{ color: "#E8F5E9", fontSize: 14 }}>Vaša ušteda</Text>

        <Text style={{ color: "#FFF", fontSize: 32, fontWeight: "700", marginTop: 4 }}>
          {Number(summary?.total_savings || 0).toFixed(2)} KM
        </Text>

        <Text style={{ color: "#C8E6C9", marginTop: 8, fontSize: 14 }}>
          {summary?.message || "Historija uštede će se prikazati nakon prvih narudžbi."}
        </Text>
      </View>

      <Text style={[styles.cardTitle, { marginBottom: 8, marginTop: 8 }]}>
        Historija kupovine ({orders.length})
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Još nema narudžbi. Počnite kupovinu u Pretrazi!
          </Text>
        }
        renderItem={({ item }) => {
          const orderItems = Array.isArray(item.items) ? item.items : [];

          const productPreview = orderItems
            .slice(0, 3)
            .map((orderItem) => orderItem.product_name || orderItem.name)
            .filter(Boolean)
            .join(", ");

          return (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{item.market_name || "Nepoznat market"}</Text>

                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {formatDate(item.created_at)}
                </Text>
              </View>

              <Text style={styles.cardSubtitle}>
                {orderItems.length} proizvoda · Ukupno {Number(item.total || 0).toFixed(2)} KM
              </Text>

              {productPreview ? (
                <Text style={{ color: colors.textSecondary, marginTop: 4, fontSize: 12 }}>
                  Proizvodi: {productPreview}
                  {orderItems.length > 3 ? "..." : ""}
                </Text>
              ) : null}

              {item.savings > 0 ? (
                <Text style={{ color: colors.success, marginTop: 6, fontWeight: "600" }}>
                  Ušteda: {Number(item.savings || 0).toFixed(2)} KM
                </Text>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}