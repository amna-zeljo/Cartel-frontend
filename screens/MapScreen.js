import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { SARAJEVO_CENTER, STORES } from '../data/stores';

const PROFILES = [
  { key: 'driving', label: 'Driving' },
  { key: 'walking', label: 'Walking' },
  { key: 'cycling', label: 'Cycling' },
];

function distanceKm(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function closestPerType(from) {
  const best = new Map();
  STORES.forEach((store, index) => {
    const d = distanceKm(from, store);
    const current = best.get(store.storeType);
    if (!current || d < current.distanceKm) {
      best.set(store.storeType, { index, store, distanceKm: d });
    }
  });
  return Array.from(best.values()).sort((a, b) => a.store.storeType.localeCompare(b.store.storeType));
}

function buildHtml() {
  const storesJson = JSON.stringify(STORES);
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>html,body,#map{height:100%;margin:0;padding:0;background:#eee;}</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const stores = ${storesJson};
    const map = L.map('map').setView([${SARAJEVO_CENTER.latitude}, ${SARAJEVO_CENTER.longitude}], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    const markerLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);
    let userMarker = null;

    const highlightIcon = L.divIcon({
      className: '',
      html: '<div style="background:#208AEF;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:700;border:2px solid white;box-shadow:0 0 6px rgba(0,0,0,0.5);">&#9733;</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
    const userIcon = L.divIcon({
      className: '',
      html: '<div style="background:#E53935;border-radius:50%;width:18px;height:18px;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,0.5);"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    function renderMarkers(highlighted) {
      const set = new Set(highlighted || []);
      markerLayer.clearLayers();
      stores.forEach((s, i) => {
        const m = set.has(i)
          ? L.marker([s.latitude, s.longitude], { icon: highlightIcon })
          : L.marker([s.latitude, s.longitude], { opacity: 0.7 });
        m.bindPopup('<b>' + s.name + '</b><br/>' + s.storeType + '<br/>' + s.address);
        m.addTo(markerLayer);
      });
    }
    renderMarkers(null);

    const PROFILE_CONFIG = {
      driving: { base: 'routed-car', osrm: 'driving' },
      walking: { base: 'routed-foot', osrm: 'foot' },
      cycling: { base: 'routed-bike', osrm: 'bike' },
    };

    function postToHost(msg) {
      const json = JSON.stringify(msg);
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(json);
      else if (window.parent && window.parent !== window) window.parent.postMessage(json, '*');
    }

    async function drawRoute(from, to, profile, storeIndex) {
      const cfg = PROFILE_CONFIG[profile] || PROFILE_CONFIG.driving;
      const url = 'https://routing.openstreetmap.de/' + cfg.base + '/route/v1/' + cfg.osrm + '/'
        + from[1] + ',' + from[0] + ';' + to[1] + ',' + to[0]
        + '?overview=full&geometries=geojson';
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
          L.polyline(coords, { color: '#208AEF', weight: 4, opacity: 0.85 }).addTo(routeLayer);
          postToHost({ type: 'routeDistance', storeIndex, profile, distanceKm: route.distance / 1000 });
          return;
        }
      } catch (e) {}
      L.polyline([from, to], { color: '#208AEF', weight: 3, opacity: 0.6, dashArray: '6 6' }).addTo(routeLayer);
      postToHost({ type: 'routeDistance', storeIndex, profile, distanceKm: null });
    }

    let lastRun = null;

    window.showResults = async function(userLat, userLng, ids, profile) {
      lastRun = { userLat, userLng, ids, profile };
      routeLayer.clearLayers();
      renderMarkers(ids);

      if (userMarker) userMarker.remove();
      userMarker = L.marker([userLat, userLng], { icon: userIcon })
        .bindPopup('You are here')
        .addTo(map);

      const points = [[userLat, userLng]];
      ids.forEach(i => points.push([stores[i].latitude, stores[i].longitude]));
      map.fitBounds(points, { padding: [60, 60], maxZoom: 15 });

      const runId = lastRun;
      for (const i of ids) {
        if (lastRun !== runId) return;
        await drawRoute([userLat, userLng], [stores[i].latitude, stores[i].longitude], profile, i);
      }
    };

    window.setProfile = function(profile) {
      if (!lastRun) return;
      window.showResults(lastRun.userLat, lastRun.userLng, lastRun.ids, profile);
    };
  </script>
</body>
</html>`;
}

export default function MapScreen() {
  const [closest, setClosest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState('driving');
  const [routeDistances, setRouteDistances] = useState({});
  const webRef = useRef(null);
  const iframeRef = useRef(null);
  const profileRef = useRef(profile);
  const html = useMemo(buildHtml, []);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  function handleHostMessage(raw) {
    try {
      const msg = JSON.parse(raw);
      if (msg.type !== 'routeDistance') return;
      if (msg.profile !== profileRef.current) return;
      setRouteDistances((prev) => ({ ...prev, [msg.storeIndex]: msg.distanceKm }));
    } catch {}
  }

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    function onMessage(e) {
      if (typeof e.data === 'string') handleHostMessage(e.data);
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function callShowResults(lat, lng, ids, next) {
    if (Platform.OS === 'web') {
      iframeRef.current?.contentWindow?.showResults?.(lat, lng, ids, next);
    } else {
      webRef.current?.injectJavaScript(
        `window.showResults(${lat}, ${lng}, ${JSON.stringify(ids)}, ${JSON.stringify(next)}); true;`,
      );
    }
  }

  function callSetProfile(next) {
    if (Platform.OS === 'web') {
      iframeRef.current?.contentWindow?.setProfile?.(next);
    } else {
      webRef.current?.injectJavaScript(`window.setProfile(${JSON.stringify(next)}); true;`);
    }
  }

  function handleSelectProfile(next) {
    setProfile(next);
    setRouteDistances({});
    if (closest) callSetProfile(next);
  }

  async function handleFindClosest() {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let origin = SARAJEVO_CENTER;
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        origin = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } else {
        Alert.alert('Using Sarajevo center', 'Location permission denied - falling back to city center.');
      }
      const result = closestPerType(origin);
      setClosest(result);
      setRouteDistances({});
      const ids = result.map((c) => c.index);
      callShowResults(origin.latitude, origin.longitude, ids, profile);
    } catch (err) {
      Alert.alert('Could not find location', String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <iframe
          ref={iframeRef}
          title="Store map"
          srcDoc={html}
          style={{ border: 0, width: '100%', height: '100%' }}
        />
      ) : (
        <WebView
          ref={webRef}
          originWhitelist={['*']}
          source={{ html }}
          style={StyleSheet.absoluteFill}
          onMessage={(e) => handleHostMessage(e.nativeEvent.data)}
        />
      )}

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View pointerEvents="box-none" style={styles.topSpacer} />

        <View style={styles.profileRow}>
          {PROFILES.map((p) => {
            const active = p.key === profile;
            return (
              <Pressable
                key={p.key}
                onPress={() => handleSelectProfile(p.key)}
                style={[styles.profileChip, active && styles.profileChipActive]}>
                <Text style={[styles.profileChipText, active && styles.profileChipTextActive]}>{p.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {closest && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Closest per store type ({profile})</Text>
            {closest.map((c) => {
              const route = routeDistances[c.index];
              const distanceLabel =
                route === undefined
                  ? `~ ${c.distanceKm.toFixed(2)} km`
                  : route === null
                    ? 'route unavailable'
                    : `${route.toFixed(2)} km`;
              return (
                <Text key={c.store.storeType} style={styles.resultRow}>
                  <Text style={styles.resultType}>{c.store.storeType}:</Text> {c.store.name} ({distanceLabel})
                </Text>
              );
            })}
          </View>
        )}

        <Pressable
          onPress={handleFindClosest}
          disabled={loading}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, loading && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>{loading ? 'Finding...' : 'Find closest'}</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'flex-end', padding: 16, gap: 12 },
  topSpacer: { flex: 1 },
  button: {
    backgroundColor: '#208AEF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  resultTitle: { fontWeight: '700', marginBottom: 4 },
  resultRow: { fontSize: 14, color: '#111' },
  resultType: { fontWeight: '600' },
  profileRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  profileChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileChipActive: { backgroundColor: '#208AEF' },
  profileChipText: { color: '#111', fontWeight: '600' },
  profileChipTextActive: { color: 'white' },
});
