// app/(tabs)/explore.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface ExploreItem {
  id: string;
  title: string;
}

const ExploreScreen = () => {
  const items: ExploreItem[] = [
    { id: '1', title: 'Library' },
    { id: '2', title: 'Cafeteria' },
    { id: '3', title: 'Gym' },
    { id: '4', title: 'Student Center' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Explore Campus</Text>
        {items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
    marginTop: 40,
  },
  item: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#E1BEE7',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
});

export default ExploreScreen;