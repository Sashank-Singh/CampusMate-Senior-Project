// app/(tabs)/ExploreScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ExploreScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#1B5E20', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerSmall}>Discover</Text>
            <Text style={styles.header}>Explore Campus</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <TouchableOpacity  
            style={styles.card}
            onPress={() => {
              // Add your navigation logic here
            }}
          >
            <LinearGradient
              colors={['#ffffff', '#f5f5f5']}
              style={styles.cardGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="library" size={32} color="#4CAF50" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Library</Text>
                <Text style={styles.cardDescription}>Study spaces, books, and resources</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#757575" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => {
              // Add your navigation logic here
            }}
          >
            <LinearGradient
              colors={['#ffffff', '#f5f5f5']}
              style={styles.cardGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="restaurant" size={32} color="#4CAF50" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Cafeteria</Text>
                <Text style={styles.cardDescription}>Campus dining and meal options</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#757575" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => {
              // Add your navigation logic here
            }}
          >
            <LinearGradient
              colors={['#ffffff', '#f5f5f5']}
              style={styles.cardGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="fitness" size={32} color="#4CAF50" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Gym</Text>
                <Text style={styles.cardDescription}>Recreation center and fitness facilities</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#757575" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => {
              // Add your navigation logic here
            }}
          >
            <LinearGradient
              colors={['#ffffff', '#f5f5f5']}
              style={styles.cardGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="people" size={32} color="#4CAF50" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Student Center</Text>
                <Text style={styles.cardDescription}>Student services and gathering spaces</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#757575" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    padding: 20,
  },
  headerSmall: {
    fontSize: 16,
    color: '#E8F5E9',
    fontWeight: '500',
  },
  header: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  content: {
    padding: 16,
    marginTop: -30,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#ffffff',
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#757575',
  },
});

export default ExploreScreen;