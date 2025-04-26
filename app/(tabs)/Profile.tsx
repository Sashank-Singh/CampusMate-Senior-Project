import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

// Define interface for ProfileScreen props
interface ProfileScreenProps {
  name?: string;
  csuId?: string;
  status?: string;
  profileImage?: string;
}

const ProfileScreen = (props: ProfileScreenProps) => {
  // Get auth context and navigation
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  // State for modals
  const [showSettings, setShowSettings] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [showAbout, setShowAbout] = useState(false); // State for About modal

  // Function to extract CSU ID from email

  const extractCsuIdFromEmail = (email: string): string => {
    // Common CSU email formats:
    // - 7-digit ID directly in email: 1234567@vikes.csuohio.edu
    // - ID with letter prefix: s1234567@vikes.csuohio.edu

    // First try to find a pattern of exactly 7 digits
    const sevenDigitMatch = email.match(/\b\d{7}\b/);
    if (sevenDigitMatch) {
      return sevenDigitMatch[0];
    }

    // If that fails, look for any 7 consecutive digits
    const anySevenDigits = email.match(/\d{7}/);
    if (anySevenDigits) {
      return anySevenDigits[0];
    }

    // If that fails, try to extract digits after common prefixes
    const prefixMatch = email.match(/[a-z](\d+)@/i);
    if (prefixMatch && prefixMatch[1] && prefixMatch[1].length >= 7) {
      return prefixMatch[1].substring(0, 7);
    }

    return "0000000"; // Default ID if no match found
  };

  // Initialize user data with extracted CSU ID if available
  const [userData, setUserData] = useState({
    name: user?.name || props.name || "John Doe",
    csuId: user?.email
      ? extractCsuIdFromEmail(user.email)
      : props.csuId || "0000000",
    status: props.status || "Active",
    profileImage: props.profileImage || "https://via.placeholder.com/150",
  });

  // Update user data when user changes
  useEffect(() => {
    if (user) {
      const csuId = user.email
        ? extractCsuIdFromEmail(user.email)
        : props.csuId || "0000000";

      setUserData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        csuId: csuId,
      }));
    }
  }, [user]);

  console.log("Props:", props);
  console.log("UserData:", userData);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        // Use the updated API
        mediaTypes: "images" as any,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setUploadingImage(true);
        // Simulate upload delay
        setTimeout(() => {
          setUserData((prev) => ({
            ...prev,
            profileImage: result.assets[0].uri,
          }));
          setUploadingImage(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setUploadingImage(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Help & Support Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showHelpSupport}
        onRequestClose={() => setShowHelpSupport(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowHelpSupport(false)}>
                <Ionicons name="arrow-back" size={24} color="#006633" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Help & Support</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>CALL TREE OPTIONS:</Text>
                <View style={styles.helpItem}>
                  <Text style={styles.helpProblem}>Password Reset</Text>
                  <Text style={styles.helpAction}>
                    Call x5050 select option "1"
                  </Text>
                </View>
                <View style={styles.helpItem}>
                  <Text style={styles.helpProblem}>
                    Faculty Blackboard Issues
                  </Text>
                  <Text style={styles.helpAction}>
                    Call x5050 select option "2"
                  </Text>
                </View>
                <View style={styles.helpItem}>
                  <Text style={styles.helpProblem}>
                    Technical Issues or STUDENT Blackboard Issues
                  </Text>
                  <Text style={styles.helpAction}>
                    Call x5050 select option "3"
                  </Text>
                </View>
                <View style={styles.helpItem}>
                  <Text style={styles.helpProblem}>
                    To reach a department or person by name
                  </Text>
                  <Text style={styles.helpAction}>
                    Call X5050 select option "0"
                  </Text>
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>EMERGENCIES</Text>
                <Text style={styles.helpText}>
                  To report any campus emergency dial 9-1-1 or 8-9-1-1 from any
                  campus telephone. Most CSU phones have been upgraded with a
                  dedicated "911" button near the upper right corner of the
                  phone. This button provides direct contact with a CSU Police
                  Dispatcher.
                </Text>
                <Text style={[styles.helpText, { marginTop: 10 }]}>
                  Cell phone users should dial 9-1-1 and tell the operator to
                  connect them with CSU Police.
                </Text>
                <Text
                  style={[
                    styles.helpText,
                    { marginTop: 10, fontWeight: "bold" },
                  ]}
                >
                  For non-emergencies, please call 216-687-2020.
                </Text>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>VIKING SAFETY ESCORTS</Text>
                <Text style={styles.helpText}>
                  Faculty, staff and students who feel unsure about their safety
                  while walking on campus may request a Viking Safety Escort.
                  The Viking Safety Escort Service is not a taxi service but a
                  safety option for those that have a genuine concern for their
                  personal safety.
                </Text>
                <Text style={[styles.helpText, { marginTop: 10 }]}>
                  Viking Safety Escorts are provided 24 hours a day, 7 days a
                  week, and 365 days a year by Security Officers and Student
                  Campus Safety Officers (CSOs) for on-campus and nearby
                  off-campus student housing locations only.
                </Text>
                <Text style={[styles.helpText, { marginTop: 10 }]}>
                  You may request a Viking Safety Escort through our Rave
                  Guardian safety app or by contacting CSUPD at 216-687-2020.
                </Text>
                <Text
                  style={[
                    styles.helpText,
                    { marginTop: 10, fontWeight: "bold" },
                  ]}
                >
                  Don't walk alone – use the Viking Safety Escort Service.
                </Text>
                <Text
                  style={[
                    styles.helpText,
                    {
                      marginTop: 15,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "#006633",
                      fontSize: 16,
                    },
                  ]}
                >
                  See Something Suspicious, Say Something!
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* About Modal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAbout}
        onRequestClose={() => setShowAbout(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAbout(false)}>
                <Ionicons name="arrow-back" size={24} color="#006633" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>About</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Info</Text>
                <Text style={styles.helpText}>
                  CampusMate is a student-centered app designed for Cleveland
                  State University. It helps students easily access campus
                  events, important resources, and updates — providing a
                  smarter, faster way to stay connected to campus life.
                </Text>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>License</Text>
                <Text style={styles.helpText}>
                  © 2025 CampusMate Team. All rights reserved. {"\n\n"}
                  Developed by Sashank Singh, Nithish Yenaganti,Hitesh Kukreja,
                  and Maneesh Pasupulate. {"\n\n"}
                  Licensed under the MIT License.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="arrow-back" size={24} color="#006633" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Settings</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons
                      name="notifications-outline"
                      size={24}
                      color="#006633"
                    />
                    <Text style={styles.settingText}>Notifications</Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={notificationsEnabled ? "#006633" : "#f4f3f4"}
                  />
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="moon-outline" size={24} color="#006633" />
                    <Text style={styles.settingText}>Dark Mode</Text>
                  </View>
                  <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={darkModeEnabled ? "#006633" : "#f4f3f4"}
                  />
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Account</Text>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="person-outline" size={24} color="#006633" />
                    <Text style={styles.settingText}>Edit Profile</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={24}
                      color="#006633"
                    />
                    <Text style={styles.settingText}>Change Password</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.cardContainer}>
        <LinearGradient colors={["#006633", "#008040"]} style={styles.gradient}>
          <View style={styles.swooshContainer}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
              <Path
                d="M0,100 C50,50 100,0 100,0"
                fill="none"
                stroke="#004d2d"
                strokeWidth="2"
              />
            </Svg>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.topText}>VIKING CARD</Text>
            <Text style={styles.universityText}>
              CLEVELAND STATE UNIVERSITY
            </Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>{userData.name}</Text>
              <View style={styles.idContainer}>
                <Text style={styles.detailText}>CSU ID: {userData.csuId}</Text>
                {user?.email && (
                  <Text style={styles.emailNote}>
                    {user.email.length > 25
                      ? user.email.substring(0, 22) + "..."
                      : user.email}
                  </Text>
                )}
              </View>
              <Text style={styles.detailText}>{userData.status}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={pickImage}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <>
                <Image
                  source={{ uri: userData.profileImage }}
                  style={styles.profileImage}
                  accessibilityLabel="Profile picture"
                />
                <View style={styles.uploadOverlay}>
                  <Text style={styles.uploadText}>Tap to change</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.separator} />

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            console.log("Settings button pressed");
            // Show the settings modal
            setShowSettings(true);
          }}
        >
          <Ionicons name="settings-outline" size={24} color="#006633" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            console.log("Help & Support button pressed");
            setShowHelpSupport(true);
          }}
        >
          <Ionicons name="help-circle-outline" size={24} color="#006633" />
          <Text style={styles.menuText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowAbout(true)}
        >
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#006633"
          />
          <Text style={styles.menuText}>About</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={() => {
            Alert.alert("Logout", "Are you sure you want to logout?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                  await logout();
                  // Navigation will be handled by the AuthProvider
                },
              },
            ]);
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#f5f5f5",
    paddingTop: 70,
  },
  cardContainer: {
    width: screenWidth * 0.9,
    aspectRatio: 1.6,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    transform: [{ rotate: "0deg" }],
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  swooshContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "30%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    marginRight: 100,
    justifyContent: "space-between",
  },
  topText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  universityText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  detailsContainer: {
    marginTop: "auto",
  },
  detailText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  imageContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  uploadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  uploadOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 4,
    alignItems: "center",
  },
  uploadText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
    width: "90%",
    alignSelf: "center",
  },
  menuContainer: {
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    flex: 1,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#006633",
  },
  modalScrollView: {
    flex: 1,
  },
  settingsSection: {
    backgroundColor: "#fff",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginVertical: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  // Help & Support styles
  helpItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  helpProblem: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  helpAction: {
    fontSize: 14,
    color: "#666",
  },
  helpText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  logoutText: {
    color: "#FF3B30",
  },
  idContainer: {
    marginBottom: 8,
  },
  emailNote: {
    fontSize: 10,
    color: "#FFFFFF",
    opacity: 0.8,
    marginTop: 2,
  },
});

export default ProfileScreen;
