import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator, Alert } from "react-native";
import SplashScreen from "./SplashScreen";
import IntroScreen from "./Intropage";
import ExploreScreen from "./(tabs)/explore";
import CoursesScreen from "./(tabs)/Courses";
import EventsScreen from "./(tabs)/Exchange";
import ProfileScreen from "./(tabs)/Profile";
import HomeScreen from "./(tabs)/index";
import LoginScreen from "./(auth)/LoginScreen";
import SignUpScreen from "./(auth)/SignUpScreen";
import ARNavigator from "./(tabs)/ARNavigator";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import BlackboardAuth from "./(auth)/BlackboardAuth";
import CampusEventsScreen from "./(tabs)/CampusEvents";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CampusEvents from "./(tabs)/CampusEvents";

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
          } else if (route.name === "Exchange") {
            iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Exchange" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="AR" component={ARNavigator} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [splashLoading, setSplashLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<null | boolean>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          await AsyncStorage.setItem("hasLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (err) {
        console.log("Error checking first launch:", err);
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  if (splashLoading) {
    return <SplashScreen onFinish={() => setSplashLoading(false)} />;
  }

  if (isLoading || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2F614A" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "HomeTabs" : "Intropage"}
    >
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
      <Stack.Screen
        name="CampusEvents"
        component={CampusEventsScreen}
        options={{
          title: "Campus Events",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="BlackboardAuth"
        component={BlackboardAuth}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Root app component with AuthProvider and NavigationContainer
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
