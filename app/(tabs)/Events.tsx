import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

const EventsScreen = () => {
  interface Event {
    id: string;
    title: string;
    details: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://csuohio.presence.io/events");
        const text = await response.text(); // Get raw response as text
        console.log(text); // Log the response to inspect it

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // If the response is JSON, parse it
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const data = JSON.parse(text);

          // Check if API returns an array or wrapped data
          if (Array.isArray(data)) {
            setEvents(data);
          } else if (data.events && Array.isArray(data.events)) {
            setEvents(data.events);
          } else {
            throw new Error(
              "Unexpected response structure. Check the API response."
            );
          }
        } else {
          throw new Error("Invalid response format. Expected JSON.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
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
      {events.length === 0 ? (
        <Text style={styles.noEventsText}>No events found.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              <Text style={styles.eventTitle}>{item.title || "No Title"}</Text>
              <Text style={styles.eventDetails}>
                {item.details || "No Details Available"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  eventCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default EventsScreen;
