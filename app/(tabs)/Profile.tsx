import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { supabase } from '../utils/supabase';

const screenWidth = Dimensions.get('window').width;

// Define interface for ProfileScreen props
interface ProfileScreenProps {
  // These will now be optional as we'll fetch them from Supabase auth
  name?: string;
  vikingId?: string;
  csuId?: string;
  status?: string;
  profileImage?: any;
}

const ProfileScreen = (props: ProfileScreenProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: props.name || 'Loading...',
    vikingId: props.vikingId || 'Loading...',
    csuId: props.csuId || 'Loading...',
    status: props.status || 'Active',
    profileImage: props.profileImage || { uri: 'https://via.placeholder.com/150' }
  });

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        
        // Get the current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No user session found');
          return;
        }
        
        // Get user metadata
        const { user } = session;
        const metadata = user.user_metadata;
        
        setUserData({
          name: metadata?.full_name || `${metadata?.first_name || ''} ${metadata?.last_name || ''}`.trim() || 'No Name',
          vikingId: metadata?.student_id || 'No ID',
          csuId: metadata?.csu_id || 'No CSU ID',
          status: 'Active',
          profileImage: { uri: 'https://via.placeholder.com/150' }
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      console.log('User signed out successfully');
      // Auth state listener in App.tsx will handle the navigation
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sign Out Button at the top */}
      <TouchableOpacity 
        style={styles.signOutButton} 
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2F614A" style={styles.loader} />
      ) : (
        <View style={styles.cardContainer}>
          <LinearGradient colors={['#006633', '#008040']} style={styles.gradient}>
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
              <Text style={styles.universityText}>CLEVELAND STATE UNIVERSITY</Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>{userData.name}</Text>
                <Text style={styles.detailText}>VIKING ID: {userData.vikingId}</Text>
                <Text style={styles.detailText}>CSU ID: {userData.csuId}</Text>
                <Text style={styles.detailText}>{userData.status}</Text>
              </View>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={userData.profileImage}
                style={styles.profileImage}
                accessibilityLabel="Profile picture"
              />
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    marginTop: 100,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    position: 'absolute',
    bottom: 30,
    right: 0,
    zIndex: 10,
  },
  signOutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContainer: {
    width: screenWidth * 0.95,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    transform: [{ rotate: '2deg' }],
  },
  gradient: {
    padding: 20,
  },
  swooshContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '30%',
    height: '100%',
  },
  textContainer: {
    marginRight: 100,
  },
  topText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  universityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  imageContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});

export default ProfileScreen;