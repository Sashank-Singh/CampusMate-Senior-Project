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
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@expo/vector-icons/Feather"; // Feather icons (search, refresh)

const MobilePreview = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "https://web-scraper-events.onrender.com/events";
  const CACHE_KEY = "cachedEvents";
  const CACHE_TIMESTAMP_KEY = "cachedEventsTimestamp";
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
        console.log("✅ Loading events from local cache.");
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

  useEffect(() => {
    console.log("🛠 MobilePreview mounted");
    setModalVisible(false);
    refreshEvents(); // Load events on start
  }, []);

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  // Filter events based on search
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* ✅ Header */}
      <View
        style={{
          backgroundColor: "#059669",
          paddingTop: 48,
          paddingBottom: 24,
          paddingHorizontal: 16,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Events
        </Text>
      </View>

      {/* ✅ Content */}
      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16 }}>
        {/* ✅ Search Box */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 12,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Feather name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search events..."
            placeholderTextColor="#666"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={{
              marginLeft: 8,
              flex: 1,
              fontSize: 16,
              color: "#000",
            }}
          />
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
              color="#ffffff"
              style={{ marginRight: 8 }}
            />
          ) : (
            <Feather
              name="refresh-cw"
              size={22}
              color="#ffffff"
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>

        {/* ✅ Events List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              onPress={() => openModal(event)}
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 16,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 3,
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
      </View>

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
    </SafeAreaView>
  );
};

export default MobilePreview;
