import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebViewScreenProps {
  route: {
    params: {
      url: string;
    };
  };
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState={true} // Show loading indicator while loading
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
        onError={() => alert('Failed to load the page.')}
        onHttpError={() => alert('HTTP error occurred.')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewScreen;