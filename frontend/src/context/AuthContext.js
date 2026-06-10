import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, setAuthToken } from "../api/client";

const AuthContext = createContext(null);
const TOKEN_KEY = "grocery_auth_token";
const USER_KEY = "grocery_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [token, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (token && storedUser) {
          setAuthToken(token);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistSession = async (session) => {
    setAuthToken(session.access_token);
    setUser(session.user);
    await AsyncStorage.setItem(TOKEN_KEY, session.access_token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(session.user));
  };

  const login = async (email, password) => {
    const session = await api.login({ email, password });
    await persistSession(session);
    return session.user;
  };

  const register = async (name, email, password) => {
    const session = await api.register({ name, email, password });
    await persistSession(session);
    return session.user;
  };

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAuthenticated: !!user }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
