

// app/App.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './SplashScreen';
import ExploreScreen from './(tabs)/explore';
import NotFoundScreen from './+not-found';
import CoursesScreen from './(tabs)/Courses';
import EventsScreen from './(tabs)/Events';
import ProfileScreen from './(tabs)/Profile';
import HomeScreen from './(tabs)/index'; // Import the index.tsx directly

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
          <Stack.Screen name="Home" component={HomeScreen} /> {/* Home Screen */}
          <Stack.Screen name="WebView" component={WebViewScreen} options={{ headerShown: true }} /> {/* WebView Screen */}
          <Stack.Screen name="Explore" component={ExploreScreen} />
          <Stack.Screen name="Courses" component={CoursesScreen} />
          <Stack.Screen name="Events" component={EventsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;