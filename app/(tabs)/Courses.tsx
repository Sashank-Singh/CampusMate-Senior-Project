// app/(tabs)/Courses.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Course {
  id: string;
  title: string;
  time: string;
  location: string;
}

const coursesData: Course[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    time: 'Mon, Wed, Fri - 10:00 AM to 11:30 AM',
    location: 'Room 101, Main Building',
  },
  {
    id: '2',
    title: 'Data Structures and Algorithms',
    time: 'Tue, Thu - 1:00 PM to 2:30 PM',
    location: 'Room 202, Main Building',
  },
  {
    id: '3',
    title: 'Web Development',
    time: 'Mon, Wed - 3:00 PM to 4:30 PM',
    location: 'Room 303, Main Building',
  },
];

const CoursesScreen = () => {
  const [courses] = useState<Course[]>(coursesData);
  const [image, setImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Courses</Text>

        <View style={styles.formContainer}>
          <Button title="Pick an Image" onPress={handleImagePicker} />
          {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        </View>

        {courses.map((course) => (
          <View key={course.id} style={styles.courseItem}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDetails}>{course.time}</Text>
            <Text style={styles.courseDetails}>{course.location}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
    marginTop: 40,
  },
  formContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  courseItem: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#E1BEE7',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  courseDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
});

export default CoursesScreen;