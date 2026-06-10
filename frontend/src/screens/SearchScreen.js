import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import colors from "../../config/colors";
import styles from "../../config/styles";
import { api } from "../api/client";
import MarketCard from "../components/MarketCard";
import ProductCard from "../components/ProductCard";

export default function SearchScreen({ navigation }) {
  const [tab, setTab] = useState("products");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "products") {
        const data = await api.getProducts(search, selectedMarket?.id);
        setProducts(data);
      } else {
        const data = await api.getMarkets(search);
        setMarkets(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [tab, search, selectedMarket]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleMarketSelect = (market) => {
    if (selectedMarket?.id === market.id) {
      setSelectedMarket(null);
    } else {
      setSelectedMarket(market);
      setTab("products");
    }
  };

  return (
    <View style={styles.screenPadded}>
      <Text style={styles.headerTitle}>Pretraga</Text>
      <Text style={styles.subtitle}>
        Pronađite proizvode ili odaberite market za filtriranje
      </Text>

      {selectedMarket ? (
        <Pressable
          style={{
            backgroundColor: "#E8F5E9",
            padding: 10,
            borderRadius: 8,
            marginBottom: 12,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          onPress={() => setSelectedMarket(null)}
        >
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            Filter: {selectedMarket.name}
          </Text>
          <Text style={{ color: colors.primary }}>✕ Ukloni</Text>
        </Pressable>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder={tab === "products" ? "Pretraži proizvode..." : "Pretraži markete..."}
        value={search}
        onChangeText={setSearch}
      />

      <View style={{ flexDirection: "row", marginBottom: 16, gap: 8 }}>
        {["products", "markets"].map((key) => (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: tab === key ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: tab === key ? colors.primary : colors.border,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: tab === key ? "#FFF" : colors.text,
                fontWeight: "600",
              }}
            >
              {key === "products" ? "Proizvodi" : "Marketi"}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : tab === "products" ? (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text style={styles.emptyText}>Nema pronađenih proizvoda</Text>}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
            />
          )}
        />
      ) : (
        <FlatList
          data={markets}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text style={styles.emptyText}>Nema pronađenih marketa</Text>}
          renderItem={({ item }) => (
            <MarketCard
              market={item}
              selected={selectedMarket?.id === item.id}
              onPress={() => handleMarketSelect(item)}
            />
          )}
        />
      )}
    </View>
  );
}
