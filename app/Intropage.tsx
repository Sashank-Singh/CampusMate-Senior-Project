import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

interface IntroScreenProps {
  navigation: NavigationProp<any>;
}

const Intropage = ({ navigation }: IntroScreenProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Fade-in for the screen
  const imageFadeAnim = useRef(new Animated.Value(1)).current; // Image fading transition

  const images = [
    require("./assets/images/suffle1.jpg"),
    require("./assets/images/suffle2.jpg"),
    require("./assets/images/suffle3.jpg"),
  ];

  useEffect(() => {
    // Fade-in when the screen is mounted
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Image shuffle animation
    const shuffleImages = () => {
      Animated.timing(imageFadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        Animated.timing(imageFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    };

    const interval = setInterval(shuffleImages, 3000); // Change image every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Curved Image Container */}
      <View style={styles.imageContainer}>
        <Animated.Image
          source={images[currentImageIndex]}
          style={[styles.backgroundImage, { opacity: imageFadeAnim }]}
          resizeMode="cover"
        />
        {/* Custom curved shape */}
        <View style={styles.curveShape} />
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to{"\n"}CampusMate</Text>
          <Text style={styles.subtitle}>We help you find your way</Text>
        </View>

        {/* Navigate to HomeScreen on Press */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HomeTabs")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    height: height * 0.5,
    overflow: "hidden",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  curveShape: {
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "white",
    borderTopLeftRadius: width * 1.5,
    borderTopRightRadius: width * 1.5,
    transform: [{ scaleX: 1.5 }],
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2F614A",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default Intropage;
