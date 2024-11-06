   // app/SplashScreen.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';

   const SplashScreen = () => {
     return (
       <View style={styles.container}>
         <Text style={styles.title}>CampusMate</Text>
         <Text style={styles.subtitle}>Your Companion for Campus Life</Text>
       </View>
     );
   };

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: '#4CAF50', // Change to your preferred color
     },
     title: {
       fontSize: 36,
       fontWeight: 'bold',
       color: '#FFFFFF',
     },
     subtitle: {
       fontSize: 18,
       color: '#FFFFFF',
     },
   });

   export default SplashScreen;