import React from "react";
import { Pressable, Text, View } from "react-native";
import colors from "../../config/colors";
import styles from "../../config/styles";

export default function MarketCard({ market, selected, onPress }) {
  return (
    <Pressable
      style={[
        styles.card,
        selected && { borderColor: colors.primary, borderWidth: 2, backgroundColor: "#E8F5E9" },
      ]}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: market.color || colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 18 }}>
            {market.name.charAt(0)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{market.name}</Text>
          <Text style={styles.cardSubtitle}>{market.description}</Text>
        </View>
        {selected ? <Text style={{ color: colors.primary, fontWeight: "700" }}>✓</Text> : null}
      </View>
    </Pressable>
  );
}
