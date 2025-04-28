
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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BlackboardService from "../services/BlackboardService";

export default function BlackboardAuth() {
  const navigation = useNavigation();
  const [authUrl, setAuthUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [showWebView, setShowWebView] = useState(true);

  // Function to go back to the main app
  const goBack = () => {
    console.log("Navigating back to main app");
    // @ts-ignore
    navigation.goBack();
  };

  // Function to handle successful authentication
  const handleSuccess = () => {
    console.log("Authentication successful, returning to main app");
    Alert.alert(
      "Success",
      "Blackboard connected successfully!",
      [{ text: "OK", onPress: goBack }]
    );
  };

  // First useEffect - Load authorization URL and set timeout
  useEffect(() => {
    // Get authorization URL from BlackboardService
    const url = BlackboardService.getAuthorizationUrl();
    console.log("Auth URL:", url);
    setAuthUrl(url);
    setLoading(false);

    // Set a timeout to automatically return to the app if authentication takes too long
    const timeoutId = setTimeout(() => {
      if (showWebView) {
        console.log("Authentication timeout reached, showing alert");
        Alert.alert(
          "Authentication Timeout",
          "The authentication process is taking longer than expected. Would you like to continue waiting or return to the app?",
          [
            { text: "Continue Waiting", style: "default" },
            { text: "Return to App", style: "cancel", onPress: goBack }
          ]
        );
      }
    }, 60000); // 60 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [showWebView]);

  // Second useEffect - Handle successful authentication
  useEffect(() => {
    // If we have courses and we're not showing the WebView, we've successfully authenticated
    if (courses.length > 0 && !showWebView) {
      // Add a slight delay before showing the success alert
      const timer = setTimeout(() => {
        handleSuccess();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [courses, showWebView]);

  const handleNavigationStateChange = async (navState: any) => {
    // Check if the URL is the callback URL
    if (navState.url.startsWith("campusmate://auth/callback")) {
      console.log("Callback URL detected:", navState.url);
      const url = new URL(navState.url);
      const code = url.searchParams.get("code");
      if (code) {
        console.log("Authorization code received:", code);
        await exchangeCodeForToken(code);
      } else {
        console.error("No authorization code found in callback URL");
        setError("Authorization code not found");
      }
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      console.log("Exchanging code for token...");
      // Use BlackboardService to exchange code for token
      const success = await BlackboardService.getTokenFromCode(code);

      if (success) {
        console.log("Token exchange successful");
        await fetchCourses();
        setShowWebView(false);
      } else {
        console.error("Token exchange failed");
        setError("Failed to get access token");
      }
    } catch (err) {
      console.error("Error exchanging code for token:", err);
      setError("Failed to exchange code for token");
    }
  };

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses...");
      // Use BlackboardService to fetch courses
      const coursesResponse = await BlackboardService.getCourses();

      if (coursesResponse && coursesResponse.results) {
        const coursesFetched = coursesResponse.results;
        console.log("Fetched Courses:", coursesFetched);

        setCourses(coursesFetched);
        Alert.alert("Success", "Courses Fetched!");
      } else {
        console.error("No courses found in response");
        Alert.alert("No courses found");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      Alert.alert("Failed to fetch courses");
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
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blackboard Login</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => setError(null)}
            >
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={goBack}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }





  useEffect(() => {
    // If we have courses and we're not showing the WebView, we've successfully authenticated
    if (courses.length > 0 && !showWebView) {
      // Add a slight delay before showing the success alert
      const timer = setTimeout(() => {
        handleSuccess();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [courses, showWebView]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blackboard Login</Text>
        <View style={{ width: 24 }} />
      </View>

      {showWebView ? (
        <>
          <Text style={styles.instructions}>
            Please log in to your Blackboard account. You will be automatically returned to the app after successful login.
          </Text>
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
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error:', nativeEvent);
              setError(`WebView error: ${nativeEvent.description}`);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView HTTP error:', nativeEvent);
              if (nativeEvent.statusCode >= 400) {
                setError(`HTTP error ${nativeEvent.statusCode}: ${nativeEvent.description}`);
              }
            }}
          />
        </>
      ) : (
        <>
          <Text style={styles.successText}>Authentication successful!</Text>
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
          <TouchableOpacity style={styles.returnButton} onPress={goBack}>
            <Text style={styles.buttonText}>Return to App</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  backButton: {
    padding: 8,
  },
  instructions: {
    padding: 16,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    margin: 12,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: 16,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    minWidth: 140,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    minWidth: 140,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#f44336",
    fontWeight: "bold",
    fontSize: 16,
  },
  returnButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    margin: 16,
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
