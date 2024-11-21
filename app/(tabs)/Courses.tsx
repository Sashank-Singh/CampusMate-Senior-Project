import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  SafeAreaView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Course {
  id: string;
  title: string;
  time: string;
  location: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const coursesData: Course[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    time: 'Mon, Wed, Fri - 10:00 AM to 11:30 AM',
    location: 'Room 101, Main Building',
    icon: 'code-slash',
  },
  {
    id: '2',
    title: 'Data Structures and Algorithms',
    time: 'Tue, Thu - 1:00 PM to 2:30 PM',
    location: 'Room 202, Main Building',
    icon: 'git-branch',
  },
  {
    id: '3',
    title: 'Web Development',
    time: 'Mon, Wed - 3:00 PM to 4:30 PM',
    location: 'Room 303, Main Building',
    icon: 'globe',
  },
];

const CoursesScreen = () => {
  const [courses] = useState<Course[]>(coursesData);
  const [image, setImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#1B5E20', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerSmall}>Your</Text>
            <Text style={styles.header}>Courses</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.uploadCard}>
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={handleImagePicker}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={32} color="#4CAF50" />
                  <Text style={styles.uploadText}>Upload Schedule</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {courses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseCard}>
              <LinearGradient
                colors={['#ffffff', '#f5f5f5']}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={course.icon} size={24} color="#4CAF50" />
                </View>
                <View style={styles.courseContent}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <View style={styles.courseDetails}>
                    <Ionicons name="time" size={16} color="#757575" />
                    <Text style={styles.detailText}>{course.time}</Text>
                  </View>
                  <View style={styles.courseDetails}>
                    <Ionicons name="location" size={16} color="#757575" />
                    <Text style={styles.detailText}>{course.location}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    padding: 20,
  },
  headerSmall: {
    fontSize: 16,
    color: '#E8F5E9',
    fontWeight: '500',
  },
  header: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  content: {
    padding: 16,
    marginTop: -30,
  },
  uploadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  courseCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#ffffff',
  },
  cardGradient: {
    flexDirection: 'row',
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
  },
});

export default CoursesScreen;