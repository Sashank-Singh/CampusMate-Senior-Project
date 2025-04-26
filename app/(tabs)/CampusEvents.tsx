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

const MobilePreview = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const API_URL = "https://web-scraper-events.onrender.com/events";

  const refreshEvents = () => {
    console.log("🔄 Refresh clicked");
    setIsRefreshing(true); // Start loading
    const cacheBuster = `?_=${Date.now()}`; // bust cache
    fetch(`${API_URL}${cacheBuster}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEvents(data.events);
        } else {
          console.error("Error in response:", data.message);
        }
      })
      .catch((err) => console.error("Error fetching events:", err))
      .finally(() => {
        setIsRefreshing(false); // Stop loading
      });
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Events
      </Text>

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

      {/* 🔥 Improved Refresh Button */}
      <TouchableOpacity
        onPress={refreshEvents}
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
              {event.date} - {event.time}
            </Text>
            <Text>📍 {event.location}</Text>
            <Text>👥 {event.attendees} attending</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🔥 Event Details Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
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
                  📅 {selectedEvent.date} | ⏰ {selectedEvent.time}
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
                  onPress={() => setModalVisible(false)}
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
