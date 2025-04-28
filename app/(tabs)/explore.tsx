import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ExploreDetailsModal from "../screens/ExploreDetailsModal";

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const exploreItems = [
    {
      id: "1",
      title: "Library",
      icon: "book-outline",
    },
    {
      id: "2",
      title: "Viking Marketplace (Cafeteria)",
      icon: "restaurant-outline",
    },
    {
      id: "3",
      title: "Gym",
      icon: "fitness-outline",
    },
    {
      id: "4",
      title: "Student Center",
      icon: "home-outline",
    },
    {
      id: "5",
      title: "Wolstein Center",
      icon: "basketball-outline",
    },
    {
      id: "6",
      title: "Health and Wellness Center",
      icon: "medkit-outline",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <LinearGradient colors={["#1B5E20", "#4CAF50"]} style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>
          Discover essential services and facilities on campus.
        </Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#757575" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Items List */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {exploreItems
          .filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((item) => (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => {
                setSelectedItem(item);
                setModalVisible(true);
              }}
            >
              <Ionicons name={item.icon} size={32} color="#4CAF50" />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </Pressable>
          ))}
        <ExploreDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          item={selectedItem}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232622",
  },
  header: {
    padding: 85, // Increased padding for a larger header
    borderBottomLeftRadius: 30, // Smooth rounded corners
    borderBottomRightRadius: 30,
    marginBottom: -1,
    alignItems: "stretch", // Center-align the text
  },
  headerTitle: {
    fontSize: 37, // Larger font size for the title
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 18, // Slightly larger subtitle
    color: "#E8F5E9",
    marginTop: 8,
    textAlign: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#424242",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    marginTop: 7,
    fontSize: 15,
    fontWeight: "600",
    color: "#424242",
    textAlign: "center",
  },
});

export default ExploreScreen;