// app/(tabs)/ExploreScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CampusLocationModal from './../components/CampusLocationModal';

// Define location data
const locationData = {
  library: {
    title: 'Library',
    icon: 'library',
    description: "The campus library is a state-of-the-art facility designed to support student learning and research. With multiple floors of study spaces, extensive collections, and digital resources, it serves as the intellectual hub of the university.",
    details: {
      hours: 'Monday-Friday: 7:00 AM - 12:00 AM\nSaturday-Sunday: 9:00 AM - 10:00 PM\nExtended hours during finals week',
      location: 'Central Campus, Building 12\nNext to the Student Union',
      amenities: [
        'Silent study areas',
        'Group study rooms',
        'Computer labs',
        'Printing services',
        'Research assistance',
        'Coffee shop'
      ],
      contact: 'Phone: (555) 123-4567\nEmail: library@university.edu'
    }
  },
  cafeteria: {
    title: 'Cafeteria',
    icon: 'restaurant',
    description: "Our campus cafeteria offers a diverse range of dining options to satisfy every palate. From healthy salads to comfort food, international cuisine to grab-and-go snacks, we provide nutritious and delicious meals for the entire campus community.",
    details: {
      hours: 'Breakfast: 7:00 AM - 10:30 AM\nLunch: 11:00 AM - 2:30 PM\nDinner: 5:00 PM - 9:00 PM\nGrab & Go: 7:00 AM - 9:00 PM',
      location: 'North Campus, Dining Hall\nFirst floor of Residence Hall A',
      amenities: [
        'Multiple food stations',
        'Vegetarian and vegan options',
        'Allergen-free zone',
        'Meal plan accepted',
        'Mobile ordering',
        'Outdoor seating area'
      ],
      contact: 'Phone: (555) 123-8910\nEmail: dining@university.edu'
    }
  },
  gym: {
    title: 'Gym',
    icon: 'fitness',
    description: "The campus recreation center features modern fitness equipment, group exercise studios, and athletic facilities to promote health and wellness. Whether you're a casual exerciser or competitive athlete, our gym has everything you need for your fitness journey.",
    details: {
      hours: 'Monday-Friday: 6:00 AM - 11:00 PM\nSaturday-Sunday: 8:00 AM - 9:00 PM\nPool hours may vary',
      location: 'West Campus, Recreation Center\nAdjacent to the Athletic Fields',
      amenities: [
        'Cardio and weight equipment',
        'Indoor track',
        'Swimming pool',
        'Basketball courts',
        'Group fitness classes',
        'Personal training services'
      ],
      contact: 'Phone: (555) 123-5678\nEmail: recreation@university.edu'
    }
  },
  studentCenter: {
    title: 'Student Center',
    icon: 'people',
    description: "The Student Center is the heart of campus life, offering spaces for socializing, studying, and accessing essential services. It houses student organizations, administrative offices, and various amenities to enhance your college experience.",
    details: {
      hours: 'Monday-Friday: 7:00 AM - 11:00 PM\nSaturday-Sunday: 9:00 AM - 10:00 PM',
      location: 'Central Campus, Student Union Building\nBetween the Quad and Main Hall',
      amenities: [
        'Student organization offices',
        'Lounge areas',
        'Game room',
        'Meeting spaces',
        'Campus store',
        'Banking services',
        'Information desk'
      ],
      contact: 'Phone: (555) 123-9012\nEmail: studentcenter@university.edu'
    }
  }
};

const ExploreScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const openModal = (location: string) => {
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

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
            onPress={() => openModal('library')}
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
            onPress={() => openModal('cafeteria')}
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
            onPress={() => openModal('gym')}
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
            onPress={() => openModal('studentCenter')}
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

      {/* Modal Component */}
      <CampusLocationModal
        visible={modalVisible}
        onClose={closeModal}
        locationInfo={selectedLocation ? locationData[selectedLocation as keyof typeof locationData] : null}
      />
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