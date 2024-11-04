// app/(tabs)/explore.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ExploreScreen = () => {
  const items = [
    { id: '1', title: 'Library' },
    { id: '2', title: 'Cafeteria' },
    { id: '3', title: 'Gym' },
    { id: '4', title: 'Student Center' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Campus</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50', // Header color
    marginTop: 40,
  },
  item: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#E1BEE7', // Light purple background
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4, // For Android shadow
  },
  itemText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000', // Text color
  },
});

export default ExploreScreen;