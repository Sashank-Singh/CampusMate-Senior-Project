import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

// Import local images
const eventImages = {
  tech_summit: require("../assets/images/suffle1.jpg"),
  health_expo: require("../assets/images/suffle2.jpg"),
  business_forum: require("../assets/images/suffle3.jpg"),
  environment_summit: require("../assets/images/logo.png"),
};

type Tab = "ongoing" | "upcoming" | "past";

const MobilePreview = () => {
  const [activeTab, setActiveTab] = useState<Tab>("ongoing");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    category: string;
    attendees: number;
    tags: string[];
    image: any;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const events = {
    ongoing: [
      {
        id: 1,
        title: "Tech Innovation Summit 2025",
        date: "Feb 17 - Feb 20, 2025",
        time: "9:00 AM - 5:00 PM",
        location: "Innovation Hub",
        description:
          "Join industry leaders in exploring cutting-edge technologies.",
        category: "Technology",
        attendees: 450,
        tags: ["AI", "Blockchain", "IoT"],
        image: eventImages.tech_summit,
      },
      {
        id: 2,
        title: "Health & Wellness Expo",
        date: "Feb 22, 2025",
        time: "10:00 AM - 6:00 PM",
        location: "City Convention Center",
        description:
          "Discover the latest in health, fitness, and wellness trends.",
        category: "Health",
        attendees: 600,
        tags: ["Fitness", "Nutrition", "Mental Health"],
        image: eventImages.health_expo,
      },
    ],
    upcoming: [
      {
        id: 3,
        title: "Global Business Forum",
        date: "Mar 1, 2025",
        time: "10:00 AM - 4:00 PM",
        location: "Business Center",
        description:
          "Connect with industry leaders and explore new opportunities.",
        category: "Business",
        attendees: 300,
        tags: ["Networking", "Business", "Career"],
        image: eventImages.business_forum,
      },
      {
        id: 4,
        title: "Environmental Sustainability Summit",
        date: "Mar 10, 2025",
        time: "9:00 AM - 3:00 PM",
        location: "Green Future Hall",
        description:
          "Learn about sustainable practices and innovative eco-friendly solutions.",
        category: "Environment",
        attendees: 350,
        tags: ["Sustainability", "Climate Change", "Eco-Friendly"],
        image: eventImages.environment_summit,
      },
    ],
    past: [
      {
        id: 5,
        title: "Digital Marketing Conference",
        date: "Jan 15, 2025",
        time: "9:00 AM - 4:00 PM",
        location: "Digital Hub Center",
        description:
          "A successful conference covering the latest digital marketing trends.",
        category: "Marketing",
        attendees: 275,
        tags: ["Digital Marketing", "SEO", "Social Media"],
        image: eventImages.tech_summit,
      },
    ],
  };

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const filteredEvents = events[activeTab].filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={["#f0fff0", "#ffffff"]}
      style={{ flex: 1, padding: 24 }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
          fontFamily: "Poppins",
        }}
      >
        Events
      </Text>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 20,
          padding: 12,
          marginBottom: 20,
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        <Icon name="search" size={18} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search events..."
          style={{ fontSize: 16, flex: 1, fontFamily: "Poppins" }}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="times-circle" size={18} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {["ongoing", "upcoming", "past"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as Tab)}
            style={{
              flex: 1,
              paddingVertical: 12,
              alignItems: "center",
              marginHorizontal: 5,
            }}
          >
            <Text
              style={{
                color: activeTab === tab ? "#006400" : "#333",
                fontFamily: "Poppins",
                fontSize: 16,
                fontWeight: activeTab === tab ? "bold" : "normal",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && (
              <View
                style={{
                  height: 2,
                  backgroundColor: "#006400",
                  width: "80%",
                  marginTop: 5,
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Event List */}
      <ScrollView>
        {filteredEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            onPress={() => openModal(event)}
            style={{
              backgroundColor: "white",
              borderRadius: 15,
              padding: 16,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              source={event.image}
              style={{ width: "100%", height: 160, borderRadius: 10 }}
              resizeMode="cover"
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 12,
                fontFamily: "Poppins",
              }}
            >
              {event.title}
            </Text>
            <Text style={{ fontFamily: "Poppins", color: "#666" }}>
              {event.date} - {event.time}
            </Text>
            <Text style={{ fontFamily: "Poppins", color: "#666" }}>
              {event.location}
            </Text>
            <Text style={{ fontFamily: "Poppins", color: "#006400" }}>
              {event.attendees} attending
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Event Details Modal */}
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
              padding: 24,
              borderRadius: 15,
              width: "100%",
              maxWidth: 400,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {selectedEvent && (
              <>
                <Image
                  source={selectedEvent.image}
                  style={{ width: "100%", height: 200, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  >
                    {selectedEvent.title}
                  </Text>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 16, fontFamily: "Poppins" }}>
                    {selectedEvent.date} | {selectedEvent.time}
                  </Text>
                  <Text style={{ fontSize: 16, fontFamily: "Poppins" }}>
                    {selectedEvent.location}
                  </Text>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 16, fontFamily: "Poppins" }}>
                    {selectedEvent.description}
                  </Text>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{ fontWeight: "bold", fontFamily: "Poppins" }}
                  >
                    Category:
                  </Text>
                  <Text style={{ fontFamily: "Poppins" }}>
                    {selectedEvent.category}
                  </Text>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{ fontWeight: "bold", fontFamily: "Poppins" }}
                  >
                    Tags:
                  </Text>
                  <Text style={{ fontFamily: "Poppins" }}>
                    {selectedEvent.tags.join(", ")}
                  </Text>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{ fontWeight: "bold", fontFamily: "Poppins" }}
                  >
                    Attendees:
                  </Text>
                  <Text style={{ fontFamily: "Poppins" }}>
                    {selectedEvent.attendees}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 20,
                    backgroundColor: "#006400",
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default MobilePreview;