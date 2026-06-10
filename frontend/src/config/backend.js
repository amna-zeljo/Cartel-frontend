import Constants from "expo-constants";
import { Platform } from "react-native";

const BACKEND_PORT = 8000;

/**
 * Resolves the backend host automatically:
 * - Physical phone (Expo Go QR): same LAN IP as the Metro bundler
 * - Android emulator: 10.0.2.2 (maps to host machine)
 * - iOS simulator / web: localhost
 *
 * Override manually in app.json → expo.extra.backendUrl if needed.
 */
function getDevBackendHost() {
  const manualUrl = Constants.expoConfig?.extra?.backendUrl;
  if (manualUrl) {
    return manualUrl.replace(/\/$/, "");
  }

  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoConfig?.hostUri?.split("/")[0] ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:${BACKEND_PORT}`;
    }
  }

  if (Platform.OS === "android") {
    return `http://10.0.2.2:${BACKEND_PORT}`;
  }

  return `http://localhost:${BACKEND_PORT}`;
}

const BACKEND_URL = __DEV__ ? getDevBackendHost() : "http://localhost:8000";

if (__DEV__) {
  console.log("[Grocery App] Backend URL:", BACKEND_URL);
}

export default BACKEND_URL;
