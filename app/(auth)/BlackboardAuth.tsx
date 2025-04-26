import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const BLACKBOARD_AUTH_URL =
  "https://bb-csuohio.blackboard.com/learn/api/public/v1/oauth2/authorizationcode";
const BLACKBOARD_TOKEN_URL =
  "https://bb-csuohio.blackboard.com/learn/api/public/v1/oauth2/token";
const CLIENT_ID = "c6237abf-e3ae-4af6-bad6-d70b7a666792"; // Replace with actual Client ID
const REDIRECT_URI = "campusmate://auth/callback";

export default function BlackboardAuth() {
  const navigation = useNavigation();
  const [authUrl, setAuthUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [showWebView, setShowWebView] = useState(true);

  useEffect(() => {
    const url = `${BLACKBOARD_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;
    setAuthUrl(url);
    setLoading(false);
  }, []);

  const handleNavigationStateChange = async (navState: any) => {
    if (navState.url.startsWith(REDIRECT_URI)) {
      const url = new URL(navState.url);
      const code = url.searchParams.get("code");
      if (code) {
        await exchangeCodeForToken(code);
      } else {
        setError("Authorization code not found");
      }
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await axios.post(
        BLACKBOARD_TOKEN_URL,
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = response.data;
      if (access_token) {
        await SecureStore.setItemAsync("blackboard_token", access_token);
        await fetchCourses(access_token);
        setShowWebView(false);
      } else {
        setError("Access token not received");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to exchange code for token");
    }
  };

  const fetchCourses = async (accessToken: string) => {
    try {
      const response = await axios.get(
        "https://bb-csuohio.blackboard.com/learn/api/public/v1/courses",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const coursesFetched = response.data.results;
      console.log("Fetched Courses:", coursesFetched);

      setCourses(coursesFetched);
      Alert.alert("Success", "Courses Fetched!");
    } catch (err) {
      console.error("Error fetching courses", err);
      Alert.alert("Failed to fetch courses.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setError(null)}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {showWebView ? (
        <WebView
          source={{ uri: authUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color="#4CAF50"
              style={{ marginTop: 20 }}
            />
          )}
        />
      ) : (
        <ScrollView style={{ padding: 16 }}>
          {courses.map((course: any) => (
            <View key={course.id} style={styles.courseCard}>
              <Text style={styles.courseTitle}>
                {course.name || course.courseId}
              </Text>
              <Text style={styles.courseSubtitle}>
                {course.externalId || "No External ID"}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#555",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    minWidth: 200,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  courseCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  courseSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
