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
  Dimensions,
  Animated,
  LayoutAnimation
} from 'react-native';
import ARNavigatorMap from './ARNavigatorMap';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Camera, CameraType } from 'expo-camera';

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

// Add after the Building interface
interface NavigationPoint {
  id: string;
  name: string;
  type: 'building' | 'landmark' | 'parking' | 'entrance';
  location: {
    latitude: number;
    longitude: number;
  };
}

interface TourStop {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  location: {
    latitude: number;
    longitude: number;
  };
  nextStop?: string; // ID of next stop
}

interface RouteStep {
  distance: string;
  duration: string;
  instructions: string;
  maneuver?: string;
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
      { id: 'sc_rm101', name: 'Viking Outfitters Bookstore', floor: 1, occupancy: 22, maxOccupancy: 50 },
      { id: 'sc_rm102', name: 'Food Court', floor: 1, occupancy: 78, maxOccupancy: 200 },
      { id: 'sc_rm103', name: 'Student Lounge', floor: 1, occupancy: 15, maxOccupancy: 30 },
      { id: 'sc_rm201', name: 'Meeting Room A', floor: 2, occupancy: 4, maxOccupancy: 20 },
      { id: 'sc_rm202', name: 'Ballroom', floor: 2, occupancy: 30, maxOccupancy: 300 },
      { id: 'sc_rm301', name: 'Student Organizations', floor: 3, occupancy: 12, maxOccupancy: 30 },
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
      { id: 'lib_rm101', name: 'Research Commons', floor: 1, occupancy: 30, maxOccupancy: 100 },
      { id: 'lib_rm102', name: 'Computer Lab', floor: 1, occupancy: 15, maxOccupancy: 50 },
      { id: 'lib_rm201', name: 'Group Study Rooms', floor: 2, occupancy: 22, maxOccupancy: 60 },
      { id: 'lib_rm301', name: 'Quiet Study Floor', floor: 3, occupancy: 45, maxOccupancy: 120 },
      { id: 'lib_rm401', name: 'Special Collections', floor: 4, occupancy: 5, maxOccupancy: 20 },
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
      { id: 'src_rm101', name: 'Chemistry Lab', floor: 1, occupancy: 18, maxOccupancy: 24 },
      { id: 'src_rm102', name: 'Physics Lab', floor: 1, occupancy: 12, maxOccupancy: 24 },
      { id: 'src_rm201', name: 'Computer Lab', floor: 2, occupancy: 15, maxOccupancy: 30 },
      { id: 'src_rm301', name: 'Research Lab', floor: 3, occupancy: 8, maxOccupancy: 15 },
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
      { id: 'bus_rm101', name: 'Lecture Hall 102', floor: 1, occupancy: 40, maxOccupancy: 120 },
      { id: 'bus_rm102', name: 'Student Success Center', floor: 1, occupancy: 12, maxOccupancy: 20 },
      { id: 'bus_rm201', name: 'Finance Lab', floor: 2, occupancy: 10, maxOccupancy: 30 },
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
      { id: 'rt_rm101', name: 'Lecture Hall RT 101', floor: 1, occupancy: 25, maxOccupancy: 80 },
      { id: 'rt_rm501', name: 'Computer Lab', floor: 5, occupancy: 15, maxOccupancy: 30 },
      { id: 'rt_rm1001', name: 'Faculty Offices', floor: 10, occupancy: 12, maxOccupancy: 20 },
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
      { id: 'rec_rm101', name: 'Main Gym', floor: 1, occupancy: 56, maxOccupancy: 200 },
      { id: 'rec_rm102', name: 'Swimming Pool', floor: 1, occupancy: 15, maxOccupancy: 50 },
      { id: 'rec_rm103', name: 'Weight Room', floor: 1, occupancy: 25, maxOccupancy: 60 },
      { id: 'rec_rm201', name: 'Indoor Track', floor: 2, occupancy: 12, maxOccupancy: 30 },
    ]
  }
];

const CSU_TOUR_STOPS: TourStop[] = [
  {
    id: 'stop1',
    name: 'Welcome Center',
    description: 'Start your tour at the CSU Welcome Center and learn about our university history and mission.',
    duration: 15,
    location: { latitude: 41.5018062, longitude: -81.6746577 },
    nextStop: 'stop2'
  },
  {
    id: 'stop2',
    name: 'Student Center',
    description: 'Explore the heart of campus life, featuring dining options, study spaces, and student organizations.',
    duration: 20,
    location: { latitude: 41.5018062, longitude: -81.6746577 },
    nextStop: 'stop3'
  },
  {
    id: 'stop3',
    name: 'Michael Schwartz Library',
    description: 'Visit our main library, home to extensive research resources and quiet study spaces.',
    duration: 15,
    location: { latitude: 41.5022, longitude: -81.6750 },
    nextStop: 'stop4'
  },
  {
    id: 'stop4',
    name: 'Recreation Center',
    description: 'Check out our state-of-the-art fitness facility with gyms, pools, and wellness programs.',
    duration: 20,
    location: { latitude: 41.5011, longitude: -81.6737 }
  }
];

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ARNavigator = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [isARActive, setIsARActive] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>(CSU_CAMPUS_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [mode, setMode] = useState<'buildings' | 'studyspaces' | 'directions' | 'tour'>('buildings');
  const [activeFeatures, setActiveFeatures] = useState({
    buildings: true,
    studyspaces: false,
    directions: false,
    tour: false
  });
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('satellite');
  const [zoomLevel, setZoomLevel] = useState(16);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [layoutReady, setLayoutReady] = useState(false);
  const [buttonsLayout, setButtonsLayout] = useState({
    ready: false,
    animated: new Animated.Value(0)
  });
  const [currentTourStop, setCurrentTourStop] = useState<string | null>(null);
  const [navigationTarget, setNavigationTarget] = useState<NavigationPoint | null>(null);
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
  const [routeDistance, setRouteDistance] = useState<string>('');
  const [routeDuration, setRouteDuration] = useState<string>('');
  const [directions, setDirections] = useState<Array<{latitude: number; longitude: number}> | null>(null);
  const [encodedRoute, setEncodedRoute] = useState<string | null>(null);

  useEffect(() => {
    // Add a small delay to ensure layout is ready
    const timer = setTimeout(() => {
      setLayoutReady(true);
      setButtonsLayout(prev => ({ ...prev, ready: true }));
      Animated.spring(buttonsLayout.animated, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Generate Google Maps Static API URL
  const getStaticMapUrl = () => {
    // For a more accurate screen fit, account for device pixel ratio
    const pixelRatio = Platform.OS === 'ios' ? Math.min(2, Math.round(Dimensions.get('window').scale)) : 1;
    const width = Math.floor(windowWidth * pixelRatio);
    const height = Math.floor(windowHeight * pixelRatio);
    const size = `${width}x${height}`;
    
    // Adjust zoom level based on current context
    const zoom =
      navigationTarget || currentTourStop
        ? 18
        : selectedBuilding
        ? 18
        : 16;
        
    const key = 'AIzaSyDzoRCeNKfH2aQcDkiVpSZC4S4NbJzToDM';

    // Determine the center of the map
    const currentStopObj = CSU_TOUR_STOPS.find(
      (stop) => stop.id === currentTourStop
    );
    const center = navigationTarget
      ? `${navigationTarget.location.latitude},${navigationTarget.location.longitude}`
      : currentStopObj
      ? `${currentStopObj.location.latitude},${currentStopObj.location.longitude}`
      : selectedBuilding
      ? `${selectedBuilding.location.latitude},${selectedBuilding.location.longitude}`
      : '41.5018062,-81.6746577'; // CSU campus center

    // Create marker parameters for all campus buildings with improved styling
    const buildingMarkers = buildings
      .map((bldg) => {
        const isSelected = selectedBuilding?.id === bldg.id;
        const color = isSelected ? 'red' : '0x006B54'; // CSU Green or red for selected
        const size = isSelected ? 'mid' : 'small';
        const label = bldg.name.charAt(0);
        return `markers=size:${size}|color:${color}|label:${label}|${bldg.location.latitude},${bldg.location.longitude}`;
      })
      .join('&');

    // Extra marker for navigation target (blue) or current tour stop (yellow)
    const extraMarkers: string[] = [];
    if (navigationTarget) {
      extraMarkers.push(
        `markers=size:large|color:blue|label:D|${navigationTarget.location.latitude},${navigationTarget.location.longitude}`
      );
    }
    if (currentStopObj) {
      extraMarkers.push(
        `markers=size:large|color:yellow|label:T|${currentStopObj.location.latitude},${currentStopObj.location.longitude}`
      );
    }

    // Build path parameter for active walking route (if any)
    const pathParam = encodedRoute
      ? `&path=weight:5|color:0x0000ff|enc:${encodedRoute}`
      : '';

    // Add styling parameters for a better looking map
    const mapStyle = mapType === 'satellite' ? 'satellite' : 'roadmap';
    const styleParams = mapType === 'roadmap' ? '&style=feature:poi|visibility:on&style=feature:transit|visibility:on' : '';

    // Build and return final URL
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&maptype=${mapStyle}&scale=2${styleParams}&${buildingMarkers}${
      extraMarkers.length ? '&' + extraMarkers.join('&') : ''
    }${pathParam}&key=${key}`;
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
    // Fade out first
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedBuilding(building);
      setZoomLevel(18); // Zoom in when a building is selected
      
      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Add a slight haptic feedback if available on the device
      if (Platform.OS === 'ios') {
        // This would typically use the Haptics API but we're keeping it simple here
        // You could import Haptics from 'expo-haptics' for full implementation
      }
    });
  };

  const clearSelectedBuilding = () => {
    // Fade out first
    Animated.timing(fadeAnim, {
      toValue: 0.7,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setSelectedBuilding(null);
      setZoomLevel(16); // Zoom out when clearing selection
      
      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleModeChange = (newMode: 'buildings' | 'studyspaces' | 'directions' | 'tour') => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setMode(newMode);
      setActiveFeatures({
        buildings: newMode === 'buildings',
        studyspaces: newMode === 'studyspaces',
        directions: newMode === 'directions',
        tour: newMode === 'tour'
      });
      
      // Clear selected building when switching modes
      if (selectedBuilding && newMode !== 'buildings') {
        clearSelectedBuilding();
      }
      
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
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

  const fetchDirections = async (destination: { latitude: number; longitude: number }) => {
    if (!userLocation) return;

    const apiKey = 'AIzaSyDzoRCeNKfH2aQcDkiVpSZC4S4NbJzToDM';
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&mode=walking&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        
        // Set route overview information
        setRouteDistance(leg.distance.text);
        setRouteDuration(leg.duration.text);
        
        // Process and set route steps
        const steps = leg.steps.map((step: any) => ({
          distance: step.distance.text,
          duration: step.duration.text,
          instructions: step.html_instructions.replace(/<[^>]*>/g, ''),
          maneuver: step.maneuver
        }));
        setRouteSteps(steps);
        setEncodedRoute(route.overview_polyline.points);
        // Set polyline for map
        const points = decodePolyline(route.overview_polyline.points);
        setDirections(points);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      Alert.alert('Error', 'Unable to calculate route. Please try again.');
      setEncodedRoute(null);
    }
  };

  const renderNavigationMode = () => {
    return (
      <View style={styles.navigationContainer}>
        <Text style={styles.navigationTitle}>Campus Navigation</Text>
        
        {!navigationTarget ? (
          <ScrollView style={styles.navigationList}>
            <Text style={styles.navigationPrompt}>Where would you like to go?</Text>
            {buildings.map(building => (
              <TouchableOpacity
                key={building.id}
                style={styles.navigationItem}
                onPress={() => {
                  setNavigationTarget({
                    id: building.id,
                    name: building.name,
                    type: 'building',
                    location: building.location
                  });
                  fetchDirections(building.location);
                }}
              >
                <View style={styles.navigationItemContent}>
                  <Ionicons name="business" size={24} color={CSU_GREEN} />
                  <View style={styles.navigationItemText}>
                    <Text style={styles.navigationItemTitle}>{building.name}</Text>
                    <Text style={styles.navigationItemSubtitle}>{building.address}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={CSU_GREEN} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.activeNavigationContainer}
          >
            <Text style={styles.navigationDestination}>
              Navigating to: {navigationTarget.name}
            </Text>
            <View style={styles.navigationDirections}>
              <Ionicons name="navigate" size={32} color={CSU_WHITE} />
              {routeDistance && routeDuration && (
                <View style={styles.routeOverview}>
                  <Text style={styles.routeOverviewText}>
                    {routeDistance} • {routeDuration} walking
                  </Text>
                </View>
              )}
              <View style={styles.routeSteps}>
                {routeSteps.map((step, index) => (
                  <View key={index} style={styles.routeStep}>
                    <Ionicons 
                      name={step.maneuver === 'turn-right' ? 'arrow-forward' : 
                            step.maneuver === 'turn-left' ? 'arrow-back' : 
                            'arrow-up'} 
                      size={20} 
                      color={CSU_WHITE} 
                    />
                    <Text style={styles.routeStepText}>{step.instructions}</Text>
                    <Text style={styles.routeStepDistance}>{step.distance}</Text>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={styles.cancelNavigationButton}
              onPress={() => {
                setNavigationTarget(null);
                setRouteSteps([]);
                setRouteDistance('');
                setRouteDuration('');
                setDirections(null);
                setEncodedRoute(null);
              }}
            >
              <Text style={styles.cancelNavigationText}>Cancel Navigation</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    );
  };

  const renderTourMode = () => {
    return (
      <View style={styles.tourContainer}>
        <Text style={styles.tourTitle}>Campus Tour</Text>
        
        {!currentTourStop ? (
          <View style={styles.tourIntro}>
            <Text style={styles.tourDescription}>
              Take a guided tour of Cleveland State University. Visit key locations and learn about our campus history.
            </Text>
            <View style={styles.tourDetails}>
              <Text style={styles.tourLength}>Duration: ~70 minutes</Text>
              <Text style={styles.tourStops}>4 Stops</Text>
            </View>
            <TouchableOpacity
              style={styles.startTourButton}
              onPress={() => setCurrentTourStop('stop1')}
            >
              <Text style={styles.startTourButtonText}>Start Tour</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activeTourContainer}>
            <ScrollView 
              style={styles.tourStopsList}
              showsVerticalScrollIndicator={false}
            >
              {CSU_TOUR_STOPS.map((stop, index) => (
                <View 
                  key={stop.id}
                  style={[
                    styles.tourStop,
                    currentTourStop === stop.id && styles.activeTourStop
                  ]}
                >
                  <View style={styles.tourStopNumber}>
                    <Text style={styles.tourStopNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.tourStopContent}>
                    <Text style={styles.tourStopName}>{stop.name}</Text>
                    <Text style={styles.tourStopDescription}>{stop.description}</Text>
                    <Text style={styles.tourStopDuration}>{stop.duration} minutes</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.tourControls}>
              <TouchableOpacity
                style={styles.tourControlButton}
                onPress={() => {
                  const currentIndex = CSU_TOUR_STOPS.findIndex(stop => stop.id === currentTourStop);
                  if (currentIndex > 0) {
                    setCurrentTourStop(CSU_TOUR_STOPS[currentIndex - 1].id);
                  }
                }}
              >
                <Ionicons name="chevron-back" size={24} color={CSU_WHITE} />
                <Text style={styles.tourControlText}>Previous</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.tourControlButton}
                onPress={() => {
                  const currentStop = CSU_TOUR_STOPS.find(stop => stop.id === currentTourStop);
                  if (currentStop?.nextStop) {
                    setCurrentTourStop(currentStop.nextStop);
                  }
                }}
              >
                <Text style={styles.tourControlText}>Next</Text>
                <Ionicons name="chevron-forward" size={24} color={CSU_WHITE} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.endTourButton}
              onPress={() => setCurrentTourStop(null)}
            >
              <Text style={styles.endTourButtonText}>End Tour</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderModeContent = () => {
    return (
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {mode === 'buildings' && !selectedBuilding && renderBuildingsList()}
        {mode === 'buildings' && selectedBuilding && renderBuildingInfoCard(selectedBuilding)}
        {mode === 'studyspaces' && renderStudySpaces()}
        {mode === 'directions' && renderNavigationMode()}
        {mode === 'tour' && renderTourMode()}
      </Animated.View>
    );
  };

  const renderModeButtons = () => (
    <View style={styles.modeButtons}>
      <TouchableOpacity
        style={[
          styles.modeButton,
          mode === 'buildings' && styles.activeModeButton,
          {
            transform: [{
              scale: buttonsLayout.animated.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, mode === 'buildings' ? 1.1 : 1]
              })
            }]
          }
        ]}
        onPress={() => handleModeChange('buildings')}
      >
        <View style={styles.modeButtonInner}>
          <View style={styles.modeButtonIconContainer}>
            <Ionicons 
              name="business" 
              size={32} 
              color={mode === 'buildings' ? CSU_WHITE : '#E8F5E9'} 
            />
          </View>
          <Text style={[
            styles.modeButtonText,
            mode === 'buildings' && styles.activeModeButtonText
          ]}>Buildings</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          mode === 'studyspaces' && styles.activeModeButton,
          {
            transform: [{
              scale: buttonsLayout.animated.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, mode === 'studyspaces' ? 1.1 : 1]
              })
            }]
          }
        ]}
        onPress={() => handleModeChange('studyspaces')}
      >
        <View style={styles.modeButtonInner}>
          <View style={styles.modeButtonIconContainer}>
            <Ionicons 
              name="book" 
              size={32} 
              color={mode === 'studyspaces' ? CSU_WHITE : '#E8F5E9'} 
            />
          </View>
          <Text style={[
            styles.modeButtonText,
            mode === 'studyspaces' && styles.activeModeButtonText
          ]}>Study</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          mode === 'directions' && styles.activeModeButton,
          {
            transform: [{
              scale: buttonsLayout.animated.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, mode === 'directions' ? 1.1 : 1]
              })
            }]
          }
        ]}
        onPress={() => handleModeChange('directions')}
      >
        <View style={styles.modeButtonInner}>
          <View style={styles.modeButtonIconContainer}>
            <Ionicons 
              name="navigate" 
              size={32} 
              color={mode === 'directions' ? CSU_WHITE : '#E8F5E9'} 
            />
          </View>
          <Text style={[
            styles.modeButtonText,
            mode === 'directions' && styles.activeModeButtonText
          ]}>Navigate</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          mode === 'tour' && styles.activeModeButton,
          {
            transform: [{
              scale: buttonsLayout.animated.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, mode === 'tour' ? 1.1 : 1]
              })
            }]
          }
        ]}
        onPress={() => handleModeChange('tour')}
      >
        <View style={styles.modeButtonInner}>
          <View style={styles.modeButtonIconContainer}>
            <Ionicons 
              name="walk" 
              size={32} 
              color={mode === 'tour' ? CSU_WHITE : '#E8F5E9'} 
            />
          </View>
          <Text style={[
            styles.modeButtonText,
            mode === 'tour' && styles.activeModeButtonText
          ]}>Tour</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // AR view with static Google Maps
  const renderARView = () => {
    // Create a unique key that will change whenever relevant state changes
    const mapKey = `${selectedBuilding?.id || ''}-${navigationTarget?.id || ''}-${currentTourStop || ''}-${mapType}-${mode}`;
    
    return (
      <View style={[styles.arContainer, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
        {/* Add key prop to force re-render when state changes */}
        <Image
          key={mapKey}
          source={{ uri: getStaticMapUrl() }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        
        {/* Add map transition overlay effect */}
        <Animated.View 
          style={[
            styles.mapTransition,
            { opacity: fadeAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.7, 0.3, 0]
              })
            }
          ]}
        />
        
        <View style={styles.arOverlay}>
          {renderModeContent()}
          
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
          
          <Animated.View style={[
            styles.modeButtons,
            {
              opacity: buttonsLayout.animated,
              transform: [{
                translateY: buttonsLayout.animated.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}>
            {renderModeButtons()}
          </Animated.View>
        </View>
      </View>
    );
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
    padding: 0,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  mapTransition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 10,
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 20,
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
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  modeButton: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    height: 65,
    width: 65,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  modeButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  modeButtonIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  modeButtonText: {
    color: '#E8F5E9',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeModeButton: {
    backgroundColor: CSU_GREEN,
    borderColor: CSU_WHITE,
    borderWidth: 2,
  },
  activeModeButtonText: {
    color: CSU_WHITE,
    fontWeight: 'bold',
  },
  buildingInfoCard: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buildingName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buildingDetails: {
    color: '#E8F5E9',
    fontSize: 16,
    marginBottom: 12,
  },
  buildingDescription: {
    color: '#E8F5E9',
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 22,
  },
  buildingAddress: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 8,
  },
  buildingYearBuilt: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 18,
  },
  closeInfoButton: {
    backgroundColor: CSU_GREEN,
    padding: 12,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 25,
  },
  closeInfoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  studySpacesContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 15,
    padding: 20,
    maxHeight: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  studySpacesList: {
    maxHeight: 280,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
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
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 15,
    padding: 16,
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  tourTitle: {
    color: CSU_WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tourIntro: {
    alignItems: 'center',
  },
  tourDescription: {
    color: CSU_WHITE,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  tourDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  tourLength: {
    color: CSU_WHITE,
    fontSize: 13,
  },
  tourStops: {
    color: CSU_WHITE,
    fontSize: 13,
  },
  startTourButton: {
    backgroundColor: CSU_GREEN,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  startTourButtonText: {
    color: CSU_WHITE,
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeTourContainer: {
    flex: 1,
  },
  tourStopsList: {
    maxHeight: 200,
  },
  tourStop: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
  },
  activeTourStop: {
    backgroundColor: CSU_GREEN,
  },
  tourStopNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tourStopNumberText: {
    color: CSU_WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tourStopContent: {
    flex: 1,
  },
  tourStopName: {
    color: CSU_WHITE,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  tourStopDescription: {
    color: '#E8F5E9',
    fontSize: 13,
    marginBottom: 3,
    lineHeight: 18,
  },
  tourStopDuration: {
    color: '#CCC',
    fontSize: 11,
  },
  tourControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
  },
  tourControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  tourControlText: {
    color: CSU_WHITE,
    fontSize: 13,
    marginHorizontal: 4,
  },
  endTourButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    alignSelf: 'center',
  },
  endTourButtonText: {
    color: CSU_WHITE,
    fontSize: 13,
    fontWeight: '500',
  },
  navigationContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 20,
    padding: 20,
    margin: 15,
    marginBottom: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  navigationTitle: {
    color: CSU_WHITE,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  navigationList: {
    maxHeight: 500,
  },
  navigationPrompt: {
    color: CSU_WHITE,
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
  },
  navigationItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navigationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  navigationItemText: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  navigationItemTitle: {
    color: CSU_WHITE,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  navigationItemSubtitle: {
    color: '#CCC',
    fontSize: 14,
  },
  activeNavigationContainer: {
    alignItems: 'center',
    padding: 25,
  },
  navigationDestination: {
    color: CSU_WHITE,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  navigationDirections: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    width: '100%',
  },
  navigationDistance: {
    color: CSU_WHITE,
    fontSize: 18,
    marginTop: 15,
    fontWeight: '500',
  },
  cancelNavigationButton: {
    backgroundColor: CSU_GREEN,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cancelNavigationText: {
    color: CSU_WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  routeOverview: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 20,
    width: '100%',
  },
  routeOverviewText: {
    color: CSU_WHITE,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  routeSteps: {
    width: '100%',
    gap: 15,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  routeStepText: {
    color: CSU_WHITE,
    fontSize: 14,
    flex: 1,
  },
  routeStepDistance: {
    color: '#CCC',
    fontSize: 12,
  },
});

export default ARNavigator; 