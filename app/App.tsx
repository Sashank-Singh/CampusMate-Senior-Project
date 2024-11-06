    // app/App.tsx
    import React, { useState, useEffect } from 'react';
    import { NavigationContainer } from '@react-navigation/native';
    import { createStackNavigator } from '@react-navigation/stack';
    import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
    import { Ionicons } from '@expo/vector-icons'; // Import icons
    import SplashScreen from './SplashScreen';
    import ExploreScreen from './(tabs)/explore';
    import CoursesScreen from './(tabs)/Courses';
    import EventsScreen from './(tabs)/Events';
    import ProfileScreen from './(tabs)/Profile';
    import HomeScreen from './(tabs)/index'; 
 
    

    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();

    const HomeTabs = () => {
      return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Explore') {
                iconName = focused ? 'search' : 'search-outline';
              } else if (route.name === 'Courses') {
                iconName = focused ? 'book' : 'book-outline';
              } else if (route.name === 'Events') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Explore" component={ExploreScreen} />
          <Tab.Screen name="Courses" component={CoursesScreen} />
          <Tab.Screen name="Events" component={EventsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      );
    };

    const App = () => {
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 3000); // 3 seconds for splash screen

        return () => clearTimeout(timer);
      }, []);

      return (
        <NavigationContainer>
          {isLoading ? (
            <Stack.Navigator initialRouteName="Splash">
              <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
              {/* <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{ title: 'Web View' }} /> */}
            </Stack.Navigator>
          )}
        </NavigationContainer>
      );
    };

    export default App;