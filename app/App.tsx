import "./shim.js";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";

import SplashScreen from "./SplashScreen";
import IntroScreen from "./Intropage";
import ExploreScreen from "./(tabs)/explore";
import CoursesScreen from "./(tabs)/Courses";
import EventsScreen from "./(tabs)/Events";
import ProfileScreen from "./(tabs)/Profile";
import HomeScreen from "./(tabs)/index";
import LoginScreen from "./(auth)/LoginScreen";
import SignUpScreen from "./(auth)/SignUpScreen";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = "home-outline";

        switch (route.name) {
          case "Home":
            iconName = focused ? "home" : "home-outline";
            break;
          case "Explore":
            iconName = focused ? "search" : "search-outline";
            break;
          case "Courses":
            iconName = focused ? "book" : "book-outline";
            break;
          case "Events":
            iconName = focused ? "calendar" : "calendar-outline";
            break;
          case "Profile":
            iconName = focused ? "person" : "person-outline";
            break;
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
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

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [splashLoading, setSplashLoading] = useState(true);

  if (splashLoading) {
    return <SplashScreen onFinish={() => setSplashLoading(false)} />;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2F614A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "HomeTabs" : "Intropage"}
      >
        {!isAuthenticated && (
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
        )}
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default App;

AppRegistry.registerComponent(appName, () => App); // ✅ Fixed JSON import issue
