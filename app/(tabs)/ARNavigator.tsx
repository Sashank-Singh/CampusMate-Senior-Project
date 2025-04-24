import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Key CSU buildings
const CSU_BUILDINGS = [
  { id: 'student_center', name: 'Student Center', latitude: 41.502063, longitude: -81.678387 },
  { id: 'library', name: 'Michael Schwartz Library', latitude: 41.502585, longitude: -81.676985 },
  { id: 'fenn_tower', name: 'Fenn Tower', latitude: 41.50132, longitude: -81.6756 },
  { id: 'wolstein_center', name: 'Wolstein Center', latitude: 41.497967, longitude: -81.677758 },
] as const;

type Building = typeof CSU_BUILDINGS[number];

export default function CSUMapWebViewScreen() {
  const navigation = useNavigation();
  const webviewRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filtered, setFiltered] = useState<Building[]>([]);

  // Filter suggestions as user types
  useEffect(() => {
    if (!searchText) setFiltered([]);
    else {
      const txt = searchText.toLowerCase();
      setFiltered(CSU_BUILDINGS.filter(b => b.name.toLowerCase().includes(txt)));
    }
  }, [searchText]);

  // Handle taps from WebView markers
  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'requestNavigation') {
        const building = CSU_BUILDINGS.find(b => b.id === msg.buildingId);
        if (!building) return;
        // Get current location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Location permission needed to navigate.');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const origin = { lat: loc.coords.latitude, lng: loc.coords.longitude };
        const destination = { lat: building.latitude, lng: building.longitude };
        webviewRef.current?.postMessage(JSON.stringify({ type: 'drawRoute', origin, destination }));
        setSearchText(building.name);
        setFiltered([]);
      }
    } catch (e) {
      console.error('Invalid message from WebView', e);
    }
  };

  // User picks suggestion
  const onSearchSelect = async (building: Building) => {
    setSearchText(building.name);
    setFiltered([]);
    // Get location and send drawRoute
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Location permission needed to navigate.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    const origin = { lat: loc.coords.latitude, lng: loc.coords.longitude };
    const destination = { lat: building.latitude, lng: building.longitude };
    webviewRef.current?.postMessage(JSON.stringify({ type: 'drawRoute', origin, destination }));
  };

  // HTML for WebView with DirectionsService
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="initial-scale=1.0, width=device-width" />
  <style>html, body, #map { height:100%; margin:0; padding:0; }</style>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDzoRCeNKfH2aQcDkiVpSZC4S4NbJzToDM"></script>
  <script>
    let map, directionsService, directionsRenderer;
    function initMap() {
      const center = { lat: ${CSU_BUILDINGS[0].latitude}, lng: ${CSU_BUILDINGS[0].longitude} };
      map = new google.maps.Map(document.getElementById('map'), { center, zoom: 16 });
      directionsService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer({ map });
      const buildings = ${JSON.stringify(CSU_BUILDINGS)};
      buildings.forEach(b => {
        const marker = new google.maps.Marker({ position: { lat: b.latitude, lng: b.longitude }, map, title: b.name });
        marker.addListener('click', () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'requestNavigation', buildingId: b.id }));
        });
      });
    }
    // Listen for drawRoute commands from React Native
    window.addEventListener('message', e => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'drawRoute') {
        directionsService.route({ origin: msg.origin, destination: msg.destination, travelMode: 'WALKING' }, (res, status) => {
          if (status === 'OK') directionsRenderer.setDirections(res);
        });
      }
    });
  </script>
</head>
<body onload="initMap()">
  <div id="map"></div>
</body>
</html>
`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and search */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search building..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      {filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          style={styles.suggestions}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSearchSelect(item)} style={styles.suggestionItem}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {/* Map WebView */}
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        onMessage={handleWebViewMessage}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#006B54" />
          <Text style={{ marginTop: 8 }}>Loading map…</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#fff' },
  backBtn: { marginRight: 8 },
  searchInput: { flex: 1, borderRadius: 8, backgroundColor: '#f0f0f0', padding: 8 },
  suggestions: { maxHeight: 150, backgroundColor: '#fff' },
  suggestionItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  webview: { flex: 1, width, height },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.8)' },
});
