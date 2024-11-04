// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';

const HomeScreen = () => {
  const quickLinks = [
    { id: '1', title: 'University Website', url: 'https://www.csuohio.edu' },
    { id: '2', title: 'Student Portal', url: 'https://mycsu.csuohio.edu' },
    { id: '3', title: 'Campus Events', url: 'https://www.csuohio.edu/events' },
    { id: '4', title: 'Library', url: 'https://library.csuohio.edu' },
  ];

  const handleLinkPress = (url: string) => {
    router.push({
      pathname: "/webview",
      params: { url }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to CampusMate</Text>
      <Text style={styles.subHeader}>Cleveland State University</Text>
      <Text style={styles.description}>
        Your one-stop app for all things CSU. Stay updated with news, events, and resources.
      </Text>
      <Text style={styles.quickLinksHeader}>Quick Links</Text>
      <FlatList
        data={quickLinks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleLinkPress(item.url)}>
            <View style={styles.linkItem}>
              <Text style={styles.linkText}>{item.title}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
    marginTop: 40,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  quickLinksHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  linkItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#E1BEE7',
    borderRadius: 10,
  },
  linkText: {
    fontSize: 18,
    color: '#000',
  },
});

export default HomeScreen;