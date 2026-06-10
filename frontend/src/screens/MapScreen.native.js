import React from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import colors from "../../config/colors";
import styles from "../../config/styles";
import BranchList from "../components/BranchList";
import { useMarketBranches } from "../hooks/useMarketBranches";

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
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          ...center,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {branches.map((branch) => (
          <Marker
            key={branch.id}
            coordinate={{ latitude: branch.latitude, longitude: branch.longitude }}
            title={branch.name}
            description={branch.address}
          />
        ))}
      </MapView>

      <View style={{ maxHeight: 220 }}>
        <BranchList
          branches={branches}
          subtitle="Povucite mapu za pregled ili pogledajte listu ispod."
        />
      </View>
    </View>
  );
}
