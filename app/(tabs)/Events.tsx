// app/(tabs)/Events.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const EventsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cleveland State University Events</Text>
      <Text style={styles.event}>
        🎉 CSU Open House - Nov 25, 2024
      </Text>
      <Text style={styles.event}>
        🏀 Vikings Basketball Game - Dec 1, 2024
      </Text>
      <Text style={styles.event}>
        📚 Finals Study Session - Dec 10, 2024
      </Text>
      <Text style={styles.footer}>
        Go Vikings! 🐾
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#005F2F', // CSU Green
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White
    marginBottom: 20,
    textAlign: 'center',
  },
  event: {
    fontSize: 18,
    color: '#F1F1F1', // Light text for contrast
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: '#003B24', // Darker CSU Green
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  footer: {
    marginTop: 30,
    fontSize: 16,
    color: '#FFFFFF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default EventsScreen;
