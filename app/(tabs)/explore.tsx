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

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const exploreItems = [
    {
      id: "1",
      title: "Library",
      icon: "book-outline",
    },
    {
      id: "2",
      title: "Cafeteria",
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
        {exploreItems.map((item) => (
          <Pressable key={item.id} style={styles.card}>
            <Ionicons name={item.icon} size={32} color="#4CAF50" />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </Pressable>
        ))}
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
    padding: 80, // Increased padding for a larger header
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
    textAlign: "center",
  },
});

export default ExploreScreen;
