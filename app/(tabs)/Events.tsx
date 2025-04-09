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
import { FontAwesome } from "@expo/vector-icons"; // ✅ Fixed Import

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
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 16 }}>
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Events
      </Text>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#e0e0e0",
          borderRadius: 20,
          padding: 10,
          marginBottom: 16,
        }}
      >
        <FontAwesome
          name="search"
          size={16}
          color="gray"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search events..."
          style={{ fontSize: 16, flex: 1 }}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <FontAwesome name="times-circle" size={16} color="gray" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        {["ongoing", "upcoming", "past"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as Tab)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: activeTab === tab ? "darkgreen" : "#e0e0e0",
              alignItems: "center",
              marginHorizontal: 5,
            }}
          >
            <Text style={{ color: activeTab === tab ? "#fff" : "#000" }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
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
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
            }}
          >
            {/* Event Image */}
            <Image
              source={event.image}
              style={{ width: "100%", height: 150, borderRadius: 10 }}
              resizeMode="cover"
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
              {event.title}
            </Text>
            <Text>{`${event.date} - ${event.time}`}</Text>
            <Text>{event.location}</Text>
            <Text>{event.attendees} attending</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Event Modal */}
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
                  source={selectedEvent.image}
                  style={{ width: "100%", height: 200, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <Text
                  style={{ fontSize: 22, fontWeight: "bold", marginTop: 10 }}
                >
                  {selectedEvent.title}
                </Text>
                <Text
                  style={{ fontSize: 16, marginVertical: 5 }}
                >{`${selectedEvent.date} | ${selectedEvent.time}`}</Text>
                <Text style={{ fontSize: 16 }}>{selectedEvent.location}</Text>
                <Text style={{ marginVertical: 10 }}>
                  {selectedEvent.description}
                </Text>
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
