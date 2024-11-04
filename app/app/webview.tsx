import React from 'react';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function WebViewScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();

  return (
    <WebView
      source={{ uri: url }} // Load the URL passed from the previous screen
      style={styles.container} // Use styles for better organization
      javaScriptEnabled={true} // Enable JavaScript for the web content
      domStorageEnabled={true} // Enable DOM storage for better performance
      mediaPlaybackRequiresUserAction={false} // Allow media playback without user action
      onLoadStart={() => console.log('Loading started...')} // Log when loading starts
      onLoadEnd={() => console.log('Loading finished!')} // Log when loading ends
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent); // Log any WebView errors
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('HTTP error: ', nativeEvent); // Log HTTP errors
      }}
    />
  );
}

// Styles for the WebView container
const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the WebView take the full screen
  },
});