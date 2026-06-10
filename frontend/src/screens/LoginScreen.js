import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import colors from "../../config/colors";
import styles from "../../config/styles";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@grocery.ba");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Greška", "Unesite email i lozinku.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert("Prijava nije uspjela", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: 48 }}>🛒</Text>
          <Text style={[styles.headerTitle, { marginTop: 12, fontSize: 28 }]}>Grocery Order</Text>
          <Text style={styles.subtitle}>Naručite namirnice online — brzo i povoljno</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Lozinka"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Prijavi se</Text>
          )}
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.secondaryButtonText}>Kreiraj novi račun</Text>
        </Pressable>

        <Text style={{ textAlign: "center", marginTop: 20, color: colors.textSecondary, fontSize: 13 }}>
          Demo: demo@grocery.ba / demo123
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
