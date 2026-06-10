import React from "react";
import { ScrollView, Text, View } from "react-native";
import colors from "../../config/colors";
import styles from "../../config/styles";

export default function BranchList({ branches, subtitle }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.headerTitle}>Lokacije marketa</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {branches.map((branch) => (
        <View key={branch.id} style={styles.card}>
          <Text style={styles.cardTitle}>{branch.name}</Text>
          <Text style={styles.cardSubtitle}>{branch.address}</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
            {branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
