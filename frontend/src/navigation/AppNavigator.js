import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import colors from "../../config/colors";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartScreen from "../screens/CartScreen";
import ChooseMarketScreen from "../screens/ChooseMarketScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import MapScreen from "../screens/MapScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SearchScreen from "../screens/SearchScreen";

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function TabIcon({ label }) {
  const icons = { Početna: "🏠", Pretraga: "🔍", Korpa: "🛒" };
  return <Text style={{ fontSize: 20 }}>{icons[label] || "•"}</Text>;
}

function MainTabs() {
  const { totalItems } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: { paddingBottom: 4, height: 58 },
        tabBarIcon: () => <TabIcon label={route.name} />,
        tabBarBadge: route.name === "Korpa" && totalItems > 0 ? totalItems : undefined,
      })}
    >
      <Tab.Screen name="Početna" component={HomeScreen} />
      <Tab.Screen name="Pretraga" component={SearchScreen} />
      <Tab.Screen name="Korpa" component={CartScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppStack() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: "Detalji proizvoda" }}
      />
      <RootStack.Screen
        name="ChooseMarket"
        component={ChooseMarketScreen}
        options={{ title: "Odaberi market" }}
      />
      <RootStack.Screen name="Map" component={MapScreen} options={{ title: "Lokacije" }} />
    </RootStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
