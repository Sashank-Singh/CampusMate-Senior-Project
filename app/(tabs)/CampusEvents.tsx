import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MobilePreview = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const API_URL = "https://web-scraper-events.onrender.com/events";

  const CACHE_KEY = "cachedEvents";
  const CACHE_TIMESTAMP_KEY = "cachedEventsTimestamp";
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Fetch from server manually
  const refreshEvents = async (forceRefresh = false) => {
    console.log("</> Refresh clicked");
    setIsRefreshing(true);

    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      const cachedTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      const now = new Date().getTime();

      if (
        cachedData &&
        cachedTimestamp &&
        !forceRefresh &&
        now - parseInt(cachedTimestamp) < ONE_DAY
      ) {
        console.log(" Loading events from local cache.");
        setEvents(JSON.parse(cachedData));
      } else {
        console.log("🌐 Fetching events from server...");
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status === "success") {
          setEvents(data.events);
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data.events));
          await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
        } else {
          console.error("Error in server response:", data.message);
        }
      }
    } catch (error) {
      console.error("Error refreshing events:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load cached events silently when app loads (no server call)
  const loadCachedEvents = async () => {
    console.log("🛠 Loading cached events on startup...");
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setEvents(JSON.parse(cachedData));
        console.log("✅ Loaded events from local cache.");
      } else {
        console.log("❌ No cached events found.");
      }
    } catch (error) {
      console.error("Error loading cached events:", error);
    }
  };

  useEffect(() => {
    setModalVisible(false); // ensure modal is closed initially
    loadCachedEvents(); // load cache only, no server fetch
  }, []);

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 16 }}>
      {/* ✅ Page Heading */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        Events
      </Text>

      {/* Search Box */}
      <View
        style={{
          backgroundColor: "#e0e0e0",
          borderRadius: 20,
          padding: 10,
          marginBottom: 16,
        }}
      >
        <TextInput placeholder="Search events..." style={{ fontSize: 16 }} />
      </View>

      {/* ✅ Refresh Button */}
      <TouchableOpacity
        onPress={() => refreshEvents(true)}
        style={{
          backgroundColor: "#4CAF50",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 30,
          alignSelf: "flex-end",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ marginRight: 8 }}
          />
        ) : (
          <Text style={{ fontSize: 18, marginRight: 8 }}>🔄</Text>
        )}
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Text>
      </TouchableOpacity>

      {/* ✅ Events List */}
      <ScrollView>
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            onPress={() => openModal(event)}
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Image
              source={{ uri: event.image }}
              style={{ width: "100%", height: 150, borderRadius: 10 }}
              resizeMode="cover"
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
              {event.title}
            </Text>
            <Text>
              {event.date} {event.time ? `- ${event.time}` : ""}
            </Text>
            <Text>📍 {event.location}</Text>
            <Text>👥 {event.attendees} attending</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ✅ Event Modal */}
      <Modal
        visible={modalVisible && selectedEvent !== null}
        transparent
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "100%",
              maxWidth: 400,
            }}
          >
            {selectedEvent && (
              <>
                <Image
                  source={{ uri: selectedEvent.image }}
                  style={{ width: "100%", height: 200, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <Text
                  style={{ fontSize: 22, fontWeight: "bold", marginTop: 10 }}
                >
                  {selectedEvent.title}
                </Text>
                <Text style={{ fontSize: 16, marginVertical: 5 }}>
                  📅 {selectedEvent.date}{" "}
                  {selectedEvent.time ? `| ⏰ ${selectedEvent.time}` : ""}
                </Text>
                <Text style={{ fontSize: 16 }}>
                  📍 {selectedEvent.location}
                </Text>
                <Text style={{ marginVertical: 10 }}>
                  {selectedEvent.description}
                </Text>
                <Text style={{ fontWeight: "bold" }}>Category:</Text>
                <Text>{selectedEvent.category}</Text>
                <Text style={{ fontWeight: "bold", marginTop: 10 }}>Tags:</Text>
                <Text>{selectedEvent.tags.join(", ")}</Text>
                <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                  Attendees:
                </Text>
                <Text>👥 {selectedEvent.attendees}</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={{
                    marginTop: 20,
                    backgroundColor: "darkgreen",
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MobilePreview;
