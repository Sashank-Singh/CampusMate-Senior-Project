import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { AppRegistry, View, Text, FlatList } from 'react-native';
import SplashScreen from "./SplashScreen";
import IntroScreen from "./Intropage";
import ExploreScreen from "./(tabs)/explore";
import CoursesScreen from "./(tabs)/Courses";
import EventsScreen from "./(tabs)/Events";
import ProfileScreen from "./(tabs)/Profile";
import HomeScreen from "./(tabs)/index";
import LoginScreen from './(auth)/LoginScreen'; // Adjust the path as necessary
import 'react-native-url-polyfill/auto';
// Remove duplicate AsyncStorage import
// import AsyncStorage from '@react-native-async-storage/async-storage';
// Remove duplicate createClient import
// import { createClient } from '@supabase/supabase-js';

// Import Supabase client from utils
import { supabase } from './utils/supabase';
import { User } from '@supabase/supabase-js';

// Remove duplicate Supabase client creation
// export const supabase = createClient(
//   process.env.EXPO_PUBLIC_SUPABASE_URL || "",
//   process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
//   {
//     auth: {
//       storage: AsyncStorage,
//       autoRefreshToken: true,
//       persistSession: true,
//       detectSessionInUrl: false,
//     },
//   }
// );

// import 'dotenv/config';  
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Removing the Todo type since we're not using it anymore
// interface Todo {
//   id: number;
//   title: string;
//   // Add other todo properties as needed
// }

// Wrapper component for ProfileScreen to handle props
const ProfileWrapper = () => {
  // These are default values or you can fetch them from a context/state
  return <ProfileScreen 
    name="User Name" 
    vikingId="VID123" 
    csuId="CSU456" 
    status="Active" 
    profileImage="https://example.com/default-profile.jpg" 
  />;
};

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
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileWrapper} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Remove todos state since we're not using it
  // const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [appKey, setAppKey] = useState(0);

  useEffect(() => {
    // Check for existing session and set user state
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Session check:', data.session ? 'User logged in' : 'No user session');
        setUser(data.session?.user || null);
        if (data.session?.user) {
          console.log('User authenticated:', data.session.user.email);
          setAppKey(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        setUser(session?.user || null);
        
        // Force re-render on authentication changes
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          console.log(`Auth state changed: ${event}`);
          setAppKey(prev => prev + 1);
        }
      }
    );

    return () => {
      // Clean up the subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Remove the todos fetch effect
  // useEffect(() => {
  //   const getTodos = async () => {
  //     try {
  //       const { data: todos, error } = await supabase.from('todos').select();
  //
  //       if (error) {
  //         console.error('Error fetching todos:', error.message);
  //         return;
  //       }
  //
  //       if (todos && todos.length > 0) {
  //         setTodos(todos as Todo[]);
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.error('Error fetching todos:', error.message);
  //       } else {
  //         console.error('Unknown error fetching todos');
  //       }
  //     }
  //   };
  //
  //   getTodos();
  // }, []);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <NavigationContainer key={appKey}>
      <Stack.Navigator initialRouteName={user ? "HomeTabs" : "Intropage"}>
        {user ? (
          // Authenticated routes
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
        ) : (
          // Non-authenticated routes
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
            {/* Add other auth-related screens here */}
          </>
        )}
      </Stack.Navigator>

      {/* Remove the Todo list UI */}
      {/* {user && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Todo List</Text>
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Text key={item.id}>{item.title}</Text>}
          />
        </View>
      )} */}
    </NavigationContainer>
  );
};

export default App;

// Fix the app.json import issue
const appName = 'campusmate';
AppRegistry.registerComponent(appName, () => App);
