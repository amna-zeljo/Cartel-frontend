import React from "react";
import { ActivityIndicator, Linking, Pressable, Text, View } from "react-native";
import { createElement } from "react-native-web";
import colors from "../../config/colors";
import styles from "../../config/styles";
import BranchList from "../components/BranchList";
import { useMarketBranches } from "../hooks/useMarketBranches";

function WebMap({ branches, center }) {
  if (!branches.length) return null;

  const lats = branches.map((b) => b.latitude);
  const lngs = branches.map((b) => b.longitude);
  const padding = 0.02;
  const bbox = [
    Math.min(...lngs) - padding,
    Math.min(...lats) - padding,
    Math.max(...lngs) + padding,
    Math.max(...lats) + padding,
  ].join("%2C");

  const markers = branches
    .map((b) => `marker=${b.latitude}%2C${b.longitude}`)
    .join("&");

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&${markers}`;

  return createElement("iframe", {
    title: "Mapa lokacija",
    src,
    style: {
      width: "100%",
      height: 360,
      border: "none",
      borderRadius: 12,
    },
  });
}

export default function MapScreen({ route }) {
  const { marketId } = route.params;
  const { branches, loading, center } = useMarketBranches(marketId);

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <WebMap branches={branches} center={center} />
        {branches.map((branch) => (
          <Pressable
            key={branch.id}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`
              )
            }
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: colors.primary, fontSize: 13, textAlign: "center" }}>
              Otvori {branch.name} u Google Maps →
            </Text>
          </Pressable>
        ))}
      </View>
      <BranchList
        branches={branches}
        subtitle="Kliknite link iznad za navigaciju ili pogledajte listu lokacija."
      />
    </View>
  );
}
