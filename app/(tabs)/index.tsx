// app/(tabs)/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface WeatherData {
  temp: number;
  description: string;
  isDay: boolean;
}

const HomeScreen = () => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = 41.4993;
        const lon = -81.6944;

        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code&temperature_unit=fahrenheit`
        );

        const getWeatherDescription = (code: number) => {
          const weatherCodes: { [key: number]: string } = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Foggy",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            71: "Slight snow",
            73: "Moderate snow",
            75: "Heavy snow",
            95: "Thunderstorm",
          };
          return weatherCodes[code] || "Unknown";
        };

        setWeather({
          temp: Math.round(response.data.current.temperature_2m),
          description: getWeatherDescription(
            response.data.current.weather_code
          ),
          isDay: response.data.current.is_day === 1,
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const quickLinks: QuickLink[] = [
    {
      id: "1",
      title: "University Website",
      url: "https://www.csuohio.edu",
      icon: "school-outline",
    },
    {
      id: "2",
      title: "Student Portal",
      url: "https://mycsu.csuohio.edu",
      icon: "person-outline",
    },
    {
      id: "3",
      title: "Campus Events",
      url: "https://csuohio.presence.io/events",
      icon: "calendar-outline",
    },
    {
      id: "4",
      title: "Library",
      url: "https://library.csuohio.edu",
      icon: "book-outline",
    }, // replaced 'library' with valid icon
  ];

  const handleLinkPress = (url: string) => setSelectedUrl(url);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Sliding Menu */}
        {isMenuOpen && (
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity style={styles.menuOption}>
              <Text style={styles.menuOptionText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOption}>
              <Text style={styles.menuOptionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOption}>
              <Text style={styles.menuOptionText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOption}>
              <Text style={styles.menuOptionText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#1B5E20", "#4CAF50"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroSection}
          >
            <View style={styles.heroContent}>
              <Text style={styles.welcomeSmall}>Welcome to</Text>
              <Text style={styles.appName}>CampusMate</Text>
              <Text style={styles.universityName}>
                Cleveland State University
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>Campus Updates</Text>
            <View style={styles.statusItem}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Library Hours: 7AM - 11PM</Text>
            </View>
          </View>

          <View style={styles.widgetRow}>
            <View style={styles.weatherWidget}>
              <Ionicons
                name={weather?.isDay ? "partly-sunny" : "moon"}
                size={32}
                color="#FFA000"
              />
              <Text style={styles.temperature}>
                {weather ? `${weather.temp}°F` : "Loading..."}
              </Text>
              <Text style={styles.weatherDesc}>
                {weather ? weather.description : "Loading..."}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.newsButton}
              onPress={() =>
                setSelectedUrl(
                  "https://www.cleveland.com/#section__top_stories/"
                )
              }
            >
              <View style={styles.newsIconContainer}>
                <Ionicons name="globe-outline" size={24} color="#FFFFFF" />
                <Text style={styles.newsText}>NEWS</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.quickLinksContainer}>
            {quickLinks.map((link) => (
              <Pressable
                key={link.id}
                style={styles.linkCard}
                onPress={() => handleLinkPress(link.url)}
              >
                <View style={styles.cardGradient}>
                  <Ionicons name={link.icon} size={32} color="#4CAF50" />
                  <Text style={styles.linkTitle}>{link.title}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() =>
                setSelectedUrl("https://clevelandstate.university-tour.com/")
              }
            >
              <Ionicons name="map-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() =>
                setSelectedUrl("https://vikingfoodco.campusdish.com/")
              }
            >
              <Ionicons name="restaurant-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() =>
                setSelectedUrl(
                  "https://www.google.com/maps/dir//Cleveland+State+University"
                )
              }
            >
              <Ionicons name="bus-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.vikingText}>VIKING</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={selectedUrl !== null}
          animationType="slide"
          onRequestClose={() => setSelectedUrl(null)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.urlContainer}>
                <Text style={styles.urlText} numberOfLines={1}>
                  {selectedUrl?.replace("https://", "")}
                </Text>
              </View>
              <Pressable
                onPress={() => setSelectedUrl(null)}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
            {selectedUrl && (
              <WebView
                source={{ uri: selectedUrl }}
                style={styles.webview}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                scalesPageToFit
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                allowsFullscreenVideo
                allowsBackForwardNavigationGestures
              />
            )}
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "#242624",
    padding: 10,
    borderRadius: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuContainer: {
    position: "absolute",
    top: 0, // Adjust this to move the menu vertically
    left: 0, // Adjust this to move the menu horizontally
    width: "50%", // Width of the menu card
    height: "100%", // Height of the menu card
    backgroundColor: "#FFFFFF",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 40,
  },
  menuOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuOptionText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#424242",
  },
  heroSection: {
    paddingTop: 100,
    paddingBottom: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heroContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  welcomeSmall: {
    fontSize: 22,
    color: "#E8F5E9",
    fontWeight: "500",
    letterSpacing: 1,
  },
  appName: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 10,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  universityName: {
    fontSize: 26,
    color: "#C8E6C9",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  quickLinksContainer: { padding: 16 },
  linkCard: {
    marginBottom: 12,
    borderRadius: 30, // Smooth rounded corners
    overflow: "hidden", // Ensures content respects the rounded corners
    backgroundColor: "#424242", // Pure white background
    shadowColor: "#000", // Subtle shadow
    shadowOffset: { width: 0, height: 2 }, // Light shadow offset
    shadowOpacity: 0.1, // Light shadow transparency
    shadowRadius: 4, // Small shadow blur radius
    elevation: 2, // Light elevation for Android shadow
  },
  cardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  linkTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#424242",
    marginLeft: 16,
  },
  modalContainer: { flex: 1, backgroundColor: "#F5F5F5" },
  modalHeader: {
    height: 60,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  urlContainer: { flex: 1, marginRight: 15 },
  urlText: { fontSize: 16, color: "#666", textAlign: "center" },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    minWidth: 70,
    alignItems: "center",
  },
  closeButtonPressed: { opacity: 0.8 },
  closeButtonText: { fontSize: 16, color: "#FFFFFF", fontWeight: "bold" },
  webview: { flex: 1, backgroundColor: "#F5F5F5" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navItem: { alignItems: "center", justifyContent: "center", padding: 12 },
  vikingText: { color: "#006400", fontWeight: "bold", fontSize: 14 },
  statusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    elevation: 2,
  },
  statusTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  statusItem: { flexDirection: "row", alignItems: "center" },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  statusText: { fontSize: 16, color: "#424242" },
  widgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  weatherWidget: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginRight: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsButton: {
    backgroundColor: "#2B60DE",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsIconContainer: { flexDirection: "row", alignItems: "center" },
  newsText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  temperature: { fontSize: 24, fontWeight: "bold", marginLeft: 8 },
  weatherDesc: { fontSize: 16, color: "#424242", marginLeft: 4 },
});

export default HomeScreen;
