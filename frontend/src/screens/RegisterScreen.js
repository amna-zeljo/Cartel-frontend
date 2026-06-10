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
} from "react-native";
import styles from "../../config/styles";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Greška", "Popunite sva polja.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Greška", "Lozinka mora imati najmanje 6 karaktera.");
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (error) {
      Alert.alert("Registracija nije uspjela", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 48 }}>
        <Text style={styles.headerTitle}>Registracija</Text>
        <Text style={styles.subtitle}>Kreirajte račun za praćenje narudžbi na svim uređajima</Text>

        <TextInput style={styles.input} placeholder="Ime i prezime" value={name} onChangeText={setName} />
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
          placeholder="Lozinka (min. 6)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Registruj se</Text>
          )}
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Nazad na prijavu</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
