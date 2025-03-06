import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { AppRegistry } from "react-native";
import appConfig from "./app.json"; // ✅ Correct JSON import
import SplashScreen from "./SplashScreen";
import IntroScreen from "./Intropage";
import ExploreScreen from "./(tabs)/explore";
import CoursesScreen from "./(tabs)/Courses";
import EventsScreen from "./(tabs)/Events";
import ProfileScreen from "./(tabs)/Profile";
import HomeScreen from "./(tabs)/index";
import LoginScreen from "./(auth)/LoginScreen"; // ✅ Ensure correct path
import SignUpScreen from "./(auth)/SignUpScreen"; // ✅ Added SignUpScreen

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Fix: Access name from app.json correctly
const appName = appConfig.expo.name;

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | "home-outline"
            | "home"
            | "search"
            | "search-outline"
            | "book"
            | "book-outline"
            | "calendar"
            | "calendar-outline"
            | "person"
            | "person-outline" = "home-outline"; // default value

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

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2F614A",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white", height: 60 },
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

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intropage">
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
          name="SignUp" // ✅ Added SignUp route
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

AppRegistry.registerComponent(appName, () => App); // ✅ Fixed JSON import issue
