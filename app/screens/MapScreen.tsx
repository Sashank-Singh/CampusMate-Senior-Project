import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';

interface Room {
  id: string;
  name: string;
  floor: number;
  occupancy: number;
  maxOccupancy: number;
  buildingName?: string;
}

interface Building {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  floors: number;
  rooms: Room[];
  description: string;
  image?: any;
  yearBuilt?: string;
  address?: string;
}

const CSU_CAMPUS_BUILDINGS: Building[] = [
  {
    id: 'bldg1',
    name: 'Student Center',
    location: { latitude: 41.5018062, longitude: -81.6746577 },
    floors: 3,
    description: 'The heart of campus life with dining options, student services, and study spaces.',
    address: '2121 Euclid Ave, Cleveland, OH 44115',
    yearBuilt: '2010',
    rooms: [
      { id: 'rm101', name: 'Viking Outfitters Bookstore', floor: 1, occupancy: 22, maxOccupancy: 50 },
      { id: 'rm102', name: 'Food Court', floor: 1, occupancy: 78, maxOccupancy: 200 },
      { id: 'rm103', name: 'Student Lounge', floor: 1, occupancy: 15, maxOccupancy: 30 },
      { id: 'rm201', name: 'Meeting Room A', floor: 2, occupancy: 4, maxOccupancy: 20 },
      { id: 'rm202', name: 'Ballroom', floor: 2, occupancy: 30, maxOccupancy: 300 },
      { id: 'rm301', name: 'Student Organizations', floor: 3, occupancy: 12, maxOccupancy: 30 },
    ]
  },
  // Add more buildings here...
];

const openInMaps = (building: Building) => {
  if (!location) return;
  const destination = `${building.location.latitude},${building.location.longitude}`;
  let url = '';
  if (Platform.OS === 'ios') {
    url = `http://maps.apple.com/?daddr=${destination}`;
  } else {
    url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  }
  Linking.openURL(url);
};

const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const [directions, setDirections] = useState<any | null>(null);

  const fetchDirections = async (destination: { latitude: number; longitude: number }) => {
    if (!location) return;

    const apiKey = 'AIzaSyDzoRCeNKfH2aQcDkiVpSZC4S4NbJzToDM';
    const origin = `${location.latitude},${location.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setDirections(points);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const decodePolyline = (encoded: string) => {
    let points: { latitude: number; longitude: number }[] = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  const handleMarkerPress = async (building: Building) => {
    setSelectedBuilding(building);
    await fetchDirections(building.location);
  };

  return (
    <View style={styles.container}>
      {location && (
        <View style={styles.map}>
          {/* Optionally show a static image or just the button */}
          <Text style={{textAlign:'center',margin:10}}>Tap a building below to get directions in your native Maps app.</Text>
        </View>
      )}
      {!location && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{errorMsg || 'Loading...'}</Text>
        </View>
      )}
      {selectedBuilding && (
        <View style={styles.buildingInfoCard}>
          <Text style={styles.buildingName}>{selectedBuilding.name}</Text>
          <Text style={styles.buildingDetails}>{selectedBuilding.floors} Floors • {selectedBuilding.rooms.length} Rooms</Text>
          <Text style={styles.buildingDescription}>{selectedBuilding.description}</Text>
          <TouchableOpacity
            style={{backgroundColor:'#006B54',padding:10,borderRadius:8,marginTop:10}}
            onPress={() => openInMaps(selectedBuilding)}
          >
            <Text style={{color:'white',fontWeight:'bold'}}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buildingInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 10,
  },
  buildingName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buildingDetails: {
    color: '#E8F5E9',
    fontSize: 14,
    marginBottom: 8,
  },
  buildingDescription: {
    color: '#E8F5E9',
    fontSize: 14,
  },
});



export default MapScreen;
