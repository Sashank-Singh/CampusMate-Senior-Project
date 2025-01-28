<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://csuohio.presence.io/events');
        const text = await response.text(); // Get raw response as text
        console.log(text); // Log the response to inspect it

        // If the response is JSON, parse it
        if (response.headers.get('content-type')?.includes('application/json')) {
          const data = JSON.parse(text);
          setEvents(data); // Assuming the API returns an array of events
        } else {
          throw new Error('Unexpected response format. Check the API response.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title || 'No Title'}</Text>
            <Text style={styles.eventDetails}>{item.details || 'No Details Available'}</Text>
          </View>
        )}
>>>>>>> e2af4b8fb81185af8edf69c3a8d7f597196a7e63
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
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
=======
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
>>>>>>> e2af4b8fb81185af8edf69c3a8d7f597196a7e63
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
<<<<<<< HEAD
    color: '#444',
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
=======
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
>>>>>>> e2af4b8fb81185af8edf69c3a8d7f597196a7e63
  },
});

export default EventsScreen;
