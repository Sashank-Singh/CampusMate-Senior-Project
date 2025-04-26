import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

interface Building {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  floors: number;
  rooms: any[];
  description: string;
  image?: any;
  yearBuilt?: string;
  address?: string;
}

interface ARNavigatorMapProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  onSelectBuilding: (b: Building) => void;
}

const ARNavigatorMap: React.FC<ARNavigatorMapProps> = ({ buildings, selectedBuilding, onSelectBuilding }) => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [directions, setDirections] = useState<any | null>(null);

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

  useEffect(() => {
    if (selectedBuilding && location) {
      fetchDirections(selectedBuilding.location);
    }
  }, [selectedBuilding, location]);

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

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text>{errorMsg || 'Loading location...'}</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      showsUserLocation={true}
    >
      {buildings.map((building) => (
        <Marker
          key={building.id}
          coordinate={building.location}
          title={building.name}
          onPress={() => onSelectBuilding(building)}
        />
      ))}
      {directions && (
        <Polyline
          coordinates={directions}
          strokeColor="#006B54"
          strokeWidth={4}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.7,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ARNavigatorMap;
