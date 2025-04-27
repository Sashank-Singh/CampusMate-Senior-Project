import React, { useState, useEffect } from 'react';
import * as Linking from 'expo-linking';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import ARNavigatorMap from './ARNavigatorMap';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

// CSU colors
const CSU_GREEN = '#006B54';
const CSU_DARK_GREEN = '#004B3C'; 
const CSU_LIGHT_GREEN = '#3A9776';
const CSU_WHITE = '#FFFFFF'; 

// Define interfaces for building data
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

// Cleveland State University campus buildings data
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
  {
    id: 'bldg2',
    name: 'Michael Schwartz Library',
    location: { latitude: 41.5022, longitude: -81.6750 },
    floors: 4,
    description: 'The university library with extensive resources, computer labs, and quiet study spaces.',
    address: '2121 Euclid Ave, Cleveland, OH 44115',
    yearBuilt: '1978',
    rooms: [
      { id: 'rm101', name: 'Research Commons', floor: 1, occupancy: 30, maxOccupancy: 100 },
      { id: 'rm102', name: 'Computer Lab', floor: 1, occupancy: 15, maxOccupancy: 50 },
      { id: 'rm201', name: 'Group Study Rooms', floor: 2, occupancy: 22, maxOccupancy: 60 },
      { id: 'rm301', name: 'Quiet Study Floor', floor: 3, occupancy: 45, maxOccupancy: 120 },
      { id: 'rm401', name: 'Special Collections', floor: 4, occupancy: 5, maxOccupancy: 20 },
    ]
  },
  {
    id: 'bldg3',
    name: 'Science & Research Center',
    location: { latitude: 41.5026, longitude: -81.6738 },
    floors: 4,
    description: 'Home to science labs, research facilities, and classroom spaces for STEM majors.',
    address: '2351 Euclid Ave, Cleveland, OH 44115',
    yearBuilt: '1997',
    rooms: [
      { id: 'rm101', name: 'Chemistry Lab', floor: 1, occupancy: 18, maxOccupancy: 24 },
      { id: 'rm102', name: 'Physics Lab', floor: 1, occupancy: 12, maxOccupancy: 24 },
      { id: 'rm201', name: 'Computer Lab', floor: 2, occupancy: 15, maxOccupancy: 30 },
      { id: 'rm301', name: 'Research Lab', floor: 3, occupancy: 8, maxOccupancy: 15 },
    ]
  },
  {
    id: 'bldg4',
    name: 'Business Building',
    location: { latitude: 41.5031, longitude: -81.6751 },
    floors: 3,
    description: 'Monte Ahuja College of Business with modern classrooms and collaborative spaces.',
    address: '1860 E 18th St, Cleveland, OH 44114',
    yearBuilt: '2010', 
    rooms: [
      { id: 'rm101', name: 'Lecture Hall 102', floor: 1, occupancy: 40, maxOccupancy: 120 },
      { id: 'rm102', name: 'Student Success Center', floor: 1, occupancy: 12, maxOccupancy: 20 },
      { id: 'rm201', name: 'Finance Lab', floor: 2, occupancy: 10, maxOccupancy: 30 },
    ]
  },
  {
    id: 'bldg5',
    name: 'Rhodes Tower',
    location: { latitude: 41.5024, longitude: -81.6755 },
    floors: 20,
    description: 'Tallest building on campus with faculty offices, classrooms, and administrative services.',
    address: '1860 E 22nd St, Cleveland, OH 44115',
    yearBuilt: '1971',
    rooms: [
      { id: 'rm101', name: 'Lecture Hall RT 101', floor: 1, occupancy: 25, maxOccupancy: 80 },
      { id: 'rm501', name: 'Computer Lab', floor: 5, occupancy: 15, maxOccupancy: 30 },
      { id: 'rm1001', name: 'Faculty Offices', floor: 10, occupancy: 12, maxOccupancy: 20 },
    ]
  },
  {
    id: 'bldg6',
    name: 'Recreation Center',
    location: { latitude: 41.5011, longitude: -81.6737 },
    floors: 2,
    description: 'State-of-the-art fitness facility with gyms, pools, and wellness programs.',
    address: '2420 Chester Ave, Cleveland, OH 44115',
    yearBuilt: '2006',
    rooms: [
      { id: 'rm101', name: 'Main Gym', floor: 1, occupancy: 56, maxOccupancy: 200 },
      { id: 'rm102', name: 'Swimming Pool', floor: 1, occupancy: 15, maxOccupancy: 50 },
      { id: 'rm103', name: 'Weight Room', floor: 1, occupancy: 25, maxOccupancy: 60 },
      { id: 'rm201', name: 'Indoor Track', floor: 2, occupancy: 12, maxOccupancy: 30 },
    ]
  }
];

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ARNavigator = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants?.Type?.back || 'back');
  const [isARActive, setIsARActive] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>(CSU_CAMPUS_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [mode, setMode] = useState<'buildings' | 'studyspaces' | 'directions' | 'tour'>('buildings');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('satellite');
  const [zoomLevel, setZoomLevel] = useState(16);

  // Generate Google Maps Static API URL
  const getStaticMapUrl = () => {
    const width = Math.floor(windowWidth);
    const height = Math.floor(windowHeight);
    const size = `${width}x${height}`;
    const zoom = selectedBuilding ? 18 : 16;
    const key = 'AIzaSyDzoRCeNKfH2aQcDkiVpSZC4S4NbJzToDM';
    
    // Center coordinates - either selected building or campus center
    const center = selectedBuilding 
      ? `${selectedBuilding.location.latitude},${selectedBuilding.location.longitude}` 
      : '41.5018062,-81.6746577'; // CSU campus center
    
    // Create marker parameters for all buildings
    const markers = buildings.map(building => {
      const color = selectedBuilding?.id === building.id ? 'red' : '0x006B54'; // CSU Green or red for selected
      return `markers=color:${color}|label:${building.name.charAt(0)}|${building.location.latitude},${building.location.longitude}`;
    }).join('&');
    
    // Build the URL
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&maptype=${mapType}&${markers}&key=${key}`;
  };

  useEffect(() => {
    (async () => {
      try {
        // Request camera permissions
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        
        // Request location permissions
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        
        setHasPermission(cameraStatus === 'granted' && locationStatus === 'granted');
        
        if (locationStatus === 'granted') {
          try {
            const location = await Location.getCurrentPositionAsync({});
            setUserLocation(location.coords);
          } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Location Error', 'Unable to determine your location on campus. Please check your device settings.');
          }
        }
      } catch (error) {
        console.error('Permission error:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  const startARExperience = () => {
    setIsARActive(true);
  };

  const exitARExperience = () => {
    setIsARActive(false);
    setSelectedBuilding(null);
  };

  const selectBuilding = (building: Building) => {
    setSelectedBuilding(building);
    setZoomLevel(18); // Zoom in when a building is selected
  };

  const clearSelectedBuilding = () => {
    setSelectedBuilding(null);
    setZoomLevel(16); // Zoom out when clearing selection
  };

  const renderBuildingInfoCard = (building: Building) => {
    return (
      <View style={styles.buildingInfoCard}>
        <Text style={styles.buildingName}>{building.name}</Text>
        <Text style={styles.buildingDetails}>{building.floors} Floors • {building.rooms.length} Rooms</Text>
        <Text style={styles.buildingDescription}>{building.description}</Text>
        {building.address && (
          <Text style={styles.buildingAddress}>{building.address}</Text>
        )}
        {building.yearBuilt && (
          <Text style={styles.buildingYearBuilt}>Built: {building.yearBuilt}</Text>
        )}
        
        <TouchableOpacity 
          style={styles.closeInfoButton}
          onPress={clearSelectedBuilding}
        >
          <Text style={styles.closeInfoButtonText}>View All Buildings</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStudySpaces = () => {
    const allRooms = CSU_CAMPUS_BUILDINGS.flatMap(building => 
      building.rooms.map(room => ({
        ...room,
        buildingName: building.name
      }))
    );
    
    const studySpaces = allRooms.filter(room => 
      room.name.toLowerCase().includes('study') || 
      room.name.toLowerCase().includes('library') ||
      room.name.toLowerCase().includes('lounge') ||
      room.name.toLowerCase().includes('lab') ||
      room.name.toLowerCase().includes('commons')
    );
    
    // Sort spaces by availability (lowest occupancy percentage first)
    studySpaces.sort((a, b) => 
      (a.occupancy / a.maxOccupancy) - (b.occupancy / b.maxOccupancy)
    );
    
    return (
      <View style={styles.studySpacesContainer}>
        <Text style={styles.sectionTitle}>Available CSU Study Spaces</Text>
        <ScrollView style={styles.studySpacesList}>
          {studySpaces.map(space => (
            <View key={space.id} style={styles.studySpaceItem}>
              <View style={styles.spaceInfo}>
                <Text style={styles.spaceName}>{space.name}</Text>
                <Text style={styles.spaceLocation}>{space.buildingName}, Floor {space.floor}</Text>
              </View>
              <View style={styles.occupancyContainer}>
                <Text style={styles.occupancyText}>
                  {space.occupancy}/{space.maxOccupancy}
                </Text>
                <View style={styles.occupancyBar}>
                  <View 
                    style={[
                      styles.occupancyFill, 
                      { 
                        width: `${(space.occupancy / space.maxOccupancy) * 100}%`,
                        backgroundColor: space.occupancy < space.maxOccupancy * 0.7 ? CSU_GREEN : '#FFA000'
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderBuildingsList = () => {
    return (
      <View style={styles.buildingsListContainer}>
        <Text style={styles.sectionTitle}>CSU Campus Buildings</Text>
        <ScrollView style={styles.buildingsList}>
          {buildings.map(building => (
            <TouchableOpacity 
              key={building.id} 
              style={[
                styles.buildingListItem,
                selectedBuilding?.id === building.id && styles.selectedBuildingListItem
              ]}
              onPress={() => selectBuilding(building)}
            >
              <View style={styles.buildingListItemContent}>
                <Ionicons 
                  name="business" 
                  size={24} 
                  color={selectedBuilding?.id === building.id ? CSU_WHITE : CSU_GREEN} 
                />
                <View style={styles.buildingListItemText}>
                  <Text style={[
                    styles.buildingListItemTitle,
                    selectedBuilding?.id === building.id && { color: CSU_WHITE }
                  ]}>
                    {building.name}
                  </Text>
                  <Text style={[
                    styles.buildingListItemSubtitle,
                    selectedBuilding?.id === building.id && { color: CSU_WHITE }
                  ]}>
                    {building.floors} Floors • {building.rooms.length} Rooms
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // AR view with static Google Maps
  const renderARView = () => {
    // IMPORTANT: AR IMPLEMENTATION BEGINS HERE
    // This section should be replaced with actual AR camera implementation
    return (
      <View style={styles.arContainer}>
        {/* Google Maps implementation using Static API */}
        <Image
          source={{ uri: getStaticMapUrl() }}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* IMPORTANT NOTE: Real AR implementation would replace Image with:
            1. Camera feed from user's device
            2. AR overlay to identify buildings in view
            3. Real-time information about building details
            4. Custom AR markers for navigation
        */}

        <View style={styles.arOverlay}>
          {/* Show different views based on mode */}
          {mode === 'buildings' && !selectedBuilding && renderBuildingsList()}
          {mode === 'buildings' && selectedBuilding && renderBuildingInfoCard(selectedBuilding)}
          
          {mode === 'studyspaces' && renderStudySpaces()}
          
          {mode === 'directions' && (
            <View style={styles.directionsContainer}>
              <Text style={styles.directionsTitle}>Directions</Text>
              <Text style={styles.directionsText}>
                Select a building on the map to get directions.
              </Text>
              <ARNavigatorMap
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                onSelectBuilding={selectBuilding}
              />
              {selectedBuilding && (
                <View style={styles.directionsInfo}>
                  <Text style={styles.directionsDestination}>
                    Destination: {selectedBuilding.name}
                  </Text>
                  <Text style={styles.directionsAddress}>
                    {selectedBuilding.address}
                  </Text>
                  <TouchableOpacity 
                    style={styles.closeInfoButton}
                    onPress={clearSelectedBuilding}
                  >
                    <Text style={styles.closeInfoButtonText}>Choose Another Building</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          
          {mode === 'tour' && (
            <View style={styles.tourContainer}>
              <Text style={styles.tourTitle}>CSU Campus Tour</Text>
              <Text style={styles.tourText}>
                Take a self-guided tour of Cleveland State University. 
                The tour highlights key buildings and landmarks around campus.
              </Text>
              <TouchableOpacity style={styles.tourStartButton}>
                <Text style={styles.tourStartButtonText}>Start Tour</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Map type toggle button */}
          <TouchableOpacity
            style={styles.mapTypeButton}
            onPress={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          >
            <Ionicons 
              name={mapType === 'roadmap' ? 'globe-outline' : 'map-outline'} 
              size={32} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitButton}
            onPress={exitARExperience}
          >
            <Ionicons name="close-circle" size={44} color="white" />
          </TouchableOpacity>
          
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'buildings' && styles.activeModeButton]}
              onPress={() => setMode('buildings')}
            >
              <Ionicons name="business" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, mode === 'studyspaces' && styles.activeModeButton]}
              onPress={() => setMode('studyspaces')}
            >
              <Ionicons name="book" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, mode === 'directions' && styles.activeModeButton]}
              onPress={() => setMode('directions')}
            >
              <Ionicons name="navigate" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, mode === 'tour' && styles.activeModeButton]}
              onPress={() => setMode('tour')}
            >
              <Ionicons name="walk" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
    // IMPORTANT: AR IMPLEMENTATION ENDS HERE
  };

  // Loading state
  if (hasPermission === null) {
    return <View style={styles.container}><ActivityIndicator size="large" color={CSU_GREEN} /></View>;
  }
  
  // Permission denied state
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera or location</Text>
        <Text style={styles.errorSubtext}>This feature requires camera and location permissions to function.</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => Alert.alert('Permissions Required', 'Please enable camera and location permissions in your device settings to use the CSU AR Navigator.')}
        >
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isARActive ? (
        renderARView()
      ) : (
        <View style={styles.welcomeContainer}>
          <LinearGradient
            colors={[CSU_DARK_GREEN, CSU_GREEN]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <Text style={styles.welcomeTitle}>CSU Campus Navigator</Text>
            <Text style={styles.welcomeText}>
              Explore Cleveland State University in augmented reality. Point your camera at buildings to see what's inside,
              find study spaces, and get directions to your next class.
            </Text>
            
            <View style={styles.featureItems}>
              <View style={styles.featureItem}>
                <Ionicons name="business" size={32} color="#E8F5E9" />
                <Text style={styles.featureText}>Campus Buildings</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="navigate" size={32} color="#E8F5E9" />
                <Text style={styles.featureText}>Viking Directions</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="book" size={32} color="#E8F5E9" />
                <Text style={styles.featureText}>CSU Study Spaces</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="walk" size={32} color="#E8F5E9" />
                <Text style={styles.featureText}>Campus Tours</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.startButton}
              onPress={startARExperience}
            >
              <Text style={styles.startButtonText}>Start CSU Explorer</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#E8F5E9',
    textAlign: 'center',
    marginBottom: 30,
  },
  featureItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  featureItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  startButtonText: {
    color: CSU_GREEN,
    fontSize: 18,
    fontWeight: 'bold',
  },
  arContainer: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  mapTypeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
    zIndex: 100,
  },
  exitButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 100,
  },
  modeButtons: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 100,
  },
  modeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  activeModeButton: {
    backgroundColor: CSU_GREEN,
  },
  buildingInfoCard: {
    position: 'absolute',
    bottom: 100,
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
    marginBottom: 8,
  },
  buildingAddress: {
    color: '#CCC',
    fontSize: 12,
    marginBottom: 4,
  },
  buildingYearBuilt: {
    color: '#CCC',
    fontSize: 12,
    marginBottom: 12,
  },
  closeInfoButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 8,
  },
  closeInfoButtonText: {
    color: 'white',
    fontSize: 14,
  },
  studySpacesContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 15,
    padding: 15,
    maxHeight: 300,
  },
  studySpacesList: {
    maxHeight: 240,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  studySpaceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  spaceInfo: {
    flex: 1,
  },
  spaceName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  spaceLocation: {
    color: '#AAA',
    fontSize: 14,
  },
  occupancyContainer: {
    alignItems: 'flex-end',
    width: 100,
  },
  occupancyText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  occupancyBar: {
    height: 6,
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  occupancyFill: {
    height: 6,
    borderRadius: 3,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B00020',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  permissionButton: {
    backgroundColor: CSU_GREEN,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  buildingsListContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 15,
    padding: 15,
    maxHeight: '60%',
  },
  buildingsList: {
    maxHeight: 300,
  },
  buildingListItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedBuildingListItem: {
    backgroundColor: CSU_GREEN,
  },
  buildingListItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  buildingListItemText: {
    marginLeft: 10,
    flex: 1,
  },
  buildingListItemTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  buildingListItemSubtitle: {
    color: '#CCC',
    fontSize: 12,
  },
  directionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 15,
    padding: 15,
  },
  directionsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  directionsText: {
    color: '#E8F5E9',
    fontSize: 14,
    marginBottom: 20,
  },
  directionsInfo: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  directionsDestination: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  directionsAddress: {
    color: '#CCC',
    fontSize: 12,
    marginBottom: 8,
  },
  tourContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 15,
    padding: 15,
  },
  tourTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tourText: {
    color: '#E8F5E9',
    fontSize: 14,
    marginBottom: 20,
  },
  tourStartButton: {
    backgroundColor: CSU_GREEN,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  tourStartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ARNavigator; 