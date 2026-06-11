import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import colors from "../../config/colors";
import styles from "../../config/styles";

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={{ width: 72, height: 72, borderRadius: 8, backgroundColor: colors.border }}
          />
        ) : (
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 8,
              backgroundColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 24 }}>🛒</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{product.name}</Text>
          <Text style={styles.cardSubtitle}>
            {product.category} · {product.unit}
          </Text>
          {product.on_sale ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>AKCIJA</Text>
            </View>
          ) : null}
          <Text style={[styles.price, { marginTop: 8 }]}>
            od {product.lowest_price.toFixed(2)} KM
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
