import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from 'react-native';
import SplashScreen from "./SplashScreen";
import IntroScreen from "./Intropage";
import ExploreScreen from "./(tabs)/explore";
import CoursesScreen from "./(tabs)/Courses";
import EventsScreen from "./(tabs)/Events";
import ProfileScreen from "./(tabs)/Profile";
import HomeScreen from "./(tabs)/index";
import LoginScreen from './(auth)/LoginScreen';
import SignUpScreen from './(auth)/SignUpScreen';
import ARNavigator from "./(tabs)/ARNavigator";
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home-outline";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Courses") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Events") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          // @ts-ignore - Ionicons has these icons but TypeScript doesn't know about them
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="AR" component={ARNavigator} />
    </Tab.Navigator>
  );
};

// Main navigation component
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [splashLoading, setSplashLoading] = useState(true);

  // Show splash screen initially
  if (splashLoading) {
    return <SplashScreen onFinish={() => setSplashLoading(false)} />;
  }

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2F614A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "HomeTabs" : "Intropage"}>
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen
              name="Intropage"
              component={IntroScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : null}
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Root app component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
