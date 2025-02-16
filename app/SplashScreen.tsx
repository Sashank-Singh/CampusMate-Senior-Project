import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const ballPosition = useRef(new Animated.Value(0)).current;
  const splashScale = useRef(new Animated.Value(1)).current;
  const splashOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const ballOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const moveBall = Animated.sequence([
      Animated.timing(ballPosition, {
        toValue: 100,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(ballPosition, {
        toValue: -100,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(ballPosition, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    moveBall.start(() => {
      Animated.parallel([
        Animated.timing(splashScale, {
          toValue: 50,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(splashOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(ballOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          // Ensure text stays visible for at least 4s before proceeding
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 4000);
        });
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Moving Ball */}
      <Animated.View
        style={[
          styles.ball,
          {
            transform: [{ translateX: ballPosition }],
            opacity: ballOpacity,
          },
        ]}
      />

      {/* Expanding Splash */}
      <Animated.View
        style={[
          styles.splash,
          {
            transform: [{ scale: splashScale }],
            opacity: splashOpacity,
          },
        ]}
      />

      {/* Text */}
      <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
        CampusMate
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#047857", // Emerald-800
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  ball: {
    position: "absolute",
    width: 16,
    height: 16,
    backgroundColor: "white",
    borderRadius: 50,
  },
  splash: {
    position: "absolute",
    width: "200%",
    height: "200%",
    backgroundColor: "white",
    borderRadius: 1000,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#047857",
  },
});

export default SplashScreen;
