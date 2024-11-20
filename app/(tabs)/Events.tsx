// app/(tabs)/Events.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const events = [
  { id: '1', title: 'Campus Orientation', date: '2024-12-01', location: 'Main Auditorium' },
  { id: '2', title: 'Tech Fest 2024', date: '2024-12-10', location: 'CSU Tech Park' },
  { id: '3', title: 'Sports Meet', date: '2024-12-15', location: 'Sports Ground' },
  { id: '4', title: 'Cultural Night', date: '2024-12-20', location: 'Community Hall' },
];

const EventsScreen = () => {
  const renderEvent = ({ item }: { item: { title: string; date: string; location: string } }) => (
    <TouchableOpacity style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDetails}>{item.date} - {item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  list: {
    paddingHorizontal: 16,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default EventsScreen;
