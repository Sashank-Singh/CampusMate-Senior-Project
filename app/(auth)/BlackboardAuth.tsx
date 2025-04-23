import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import BlackboardService from '../services/BlackboardService';

export default function BlackboardAuth() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Direct authentication with client credentials
  useEffect(() => {
    const authenticate = async () => {
      setAuthenticating(true);
      try {
        const success = await BlackboardService.getClientCredentialsToken();
        if (success) {
          navigation.goBack();
        } else {
          setError("Failed to authenticate with client credentials");
        }
      } catch (err) {
        setError("Authentication error");
        console.error(err);
      } finally {
        setAuthenticating(false);
      }
    };
    
    authenticate();
  }, [navigation]);

  // Alternative manual authentication
  const handleManualAuth = async () => {
    setAuthenticating(true);
    try {
      const success = await BlackboardService.getClientCredentialsToken();
      if (success) {
        navigation.goBack();
      } else {
        setError("Failed to authenticate manually");
      }
    } catch (err) {
      setError("Manual authentication error");
      console.error(err);
    } finally {
      setAuthenticating(false);
    }
  };

  if (authenticating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Connecting to Blackboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blackboard Authentication</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleManualAuth}
          >
            <Text style={styles.buttonText}>Retry Authentication</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Initializing authentication...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#555',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});