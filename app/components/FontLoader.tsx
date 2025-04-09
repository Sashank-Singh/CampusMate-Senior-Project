import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

interface FontLoaderProps {
  children: React.ReactNode;
}

export const FontLoader: React.FC<FontLoaderProps> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        console.log('Loading fonts...');
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialIcons.font,
          ...FontAwesome.font,
        });
        console.log('Fonts loaded successfully!');
        setFontsLoaded(true);
      } catch (e) {
        console.error('Error loading fonts:', e);
        setError(e instanceof Error ? e.message : 'Unknown error loading fonts');
      }
    }

    loadFonts();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error loading fonts: {error}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Loading fonts...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default FontLoader; 