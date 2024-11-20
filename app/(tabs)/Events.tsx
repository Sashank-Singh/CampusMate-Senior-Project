import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const events = [
  { id: '1', title: 'Campus Orientation', date: '2024-12-01', location: 'Main Auditorium' },
  { id: '2', title: 'Tech Fest 2024', date: '2024-12-10', location: 'CSU Tech Park' },
  { id: '3', title: 'Sports Meet', date: '2024-12-15', location: 'Sports Ground' },
  { id: '4', title: 'Cultural Night', date: '2024-12-20', location: 'Community Hall' },
];

const EventsScreen = () => {
  const renderEvent = ({ item }) => (
    <TouchableOpacity style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDetails}>
        {item.date} - {item.location}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id} // Ensure IDs are unique and properly used
        renderItem={renderEvent}
        ListEmptyComponent={<Text style={styles.emptyText}>No events available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default EventsScreen;
