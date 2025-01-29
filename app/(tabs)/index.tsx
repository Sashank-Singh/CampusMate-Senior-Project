// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}

interface WeatherData {
  temp: number;
  description: string;
  isDay: boolean;
}

const HomeScreen = () => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Cleveland coordinates
        const lat = 41.4993;
        const lon = -81.6944;
        
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code&temperature_unit=fahrenheit`
        );

        // Convert weather code to description
        const getWeatherDescription = (code: number) => {
          const weatherCodes: { [key: number]: string } = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            95: 'Thunderstorm',
          };
          return weatherCodes[code] || 'Unknown';
        };
        
        setWeather({
          temp: Math.round(response.data.current.temperature_2m),
          description: getWeatherDescription(response.data.current.weather_code),
          isDay: response.data.current.is_day === 1
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const quickLinks: QuickLink[] = [
    
    { id: '1', title: 'University Website', url: 'https://www.csuohio.edu', icon: 'school' },
    { id: '2', title: 'Student Portal', url: 'https://mycsu.csuohio.edu', icon: 'person' },
    { id: '3', title: 'Campus Events', url: 'https://csuohio.presence.io/events', icon: 'calendar' },
    { id: '4', title: 'Library', url: 'https://library.csuohio.edu', icon: 'library' },
  ];

  const handleLinkPress = (url: string) => {
    setSelectedUrl(url);
  };

  const handleFabPress = () => {
    // Handle FAB press action here
    console.log("FAB Pressed");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1B5E20', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.welcomeSmall}>Welcome to</Text>
            <Text style={styles.appName}>CampusMate</Text>
            <Text style={styles.universityName}>Cleveland State University</Text>
          </View>
        </LinearGradient>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Campus Updates</Text>
          <View style={styles.statusItem}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Library Hours: 7AM - 11PM</Text>
          </View>
        </View>

        <View style={styles.weatherWidget}>
          <Ionicons 
            name={weather?.isDay ? 'partly-sunny' : 'moon'} 
            size={32} 
            color="#FFA000" 
          />
          <Text style={styles.temperature}>
            {weather ? `${weather.temp}°F` : 'Loading...'}
          </Text>
          <Text style={styles.weatherDesc}>
            {weather ? weather.description : 'Loading...'}
          </Text>
        </View>

        <View style={styles.quickLinksContainer}>
          {quickLinks.map((link) => (
            <Pressable
              key={link.id}
              style={styles.linkCard}
              onPress={() => handleLinkPress(link.url)}
            >
              <LinearGradient
                colors={['#ffffff', '#f5f5f5']}
                style={styles.cardGradient}
              >
                <Ionicons name={link.icon} size={32} color="#4CAF50" />
                <Text style={styles.linkTitle}>{link.title}</Text>
                <Ionicons name="chevron-forward" size={24} color="#757575" />
              </LinearGradient>
            </Pressable>
          ))}
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
                {selectedUrl?.replace('https://', '')}
              </Text>
            </View>
            <Pressable
              onPress={() => setSelectedUrl(null)}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed
              ]}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
          {selectedUrl && (
            <WebView
              source={{ uri: selectedUrl }}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              allowsFullscreenVideo={true}
              allowsBackForwardNavigationGestures={true}
            />
          )}
        </SafeAreaView>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Ionicons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  heroContent: {
    padding: 20,
  },
  welcomeSmall: {
    fontSize: 16,
    color: '#E8F5E9',
    fontWeight: '500',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 8,
  },
  universityName: {
    fontSize: 24,
    color: '#E8F5E9',
    fontWeight: '600',
  },
  quickLinksContainer: {
    padding: 16,
  },
  linkCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  linkTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginLeft: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    height: 60,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  urlContainer: {
    flex: 1,
    marginRight: 15,
  },
  urlText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    minWidth: 70,
    alignItems: 'center',
  },
  closeButtonPressed: {
    opacity: 0.8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  statusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#424242',
  },
  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    margin: 16,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  weatherDesc: {
    fontSize: 16,
    color: '#424242',
    marginLeft: 4,
  },
});

export default HomeScreen;