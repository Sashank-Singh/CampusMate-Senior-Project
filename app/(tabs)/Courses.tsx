// app/(tabs)/CoursesScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { OPENROUTER_API_KEY } from '@env';


interface Course {
  id: string;
  title: string;
  type?: string;
  time: string;
  location: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CoursesScreen = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      processImageWithLlama(result.assets[0].uri);
    }
  };

  const processImageWithLlama = async (imageUri: string) => {
    try {
      setIsProcessing(true);
      
      // Convert image to base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Prepare the prompt for the vision model
      const prompt = `
        You are a course schedule analyzer. Look at this university course schedule image and extract ALL the courses shown.
        For each course, extract:
        1. Course code and section number (e.g., "ENGR 1100.15 - 406")
        2. Course type (e.g., "Lecture", "Recitation", "Laboratory")
        3. Time (e.g., "10:20AM - 11:15AM")
        4. Day of week - please infer this from the schedule layout
        5. Location (e.g., "Scott Lab E001")
        
        Format your response as a JSON array of course objects with these properties:
        - title (course code and section)
        - type (lecture/lab/recitation)
        - time (include days and time)
        - location (building and room)
        
        Do not include any explanatory text or other formatting. Return only valid JSON.
      `;
      
      // Make request to OpenRouter API
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1024
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://yourapp.com' // Replace with your app's domain
          }
        }
      );
      
      // Parse the response
      const content = response.data.choices[0].message.content;
      
      // Extract JSON from the response
      let jsonData;
      try {
        // Try to parse if it's already pure JSON
        jsonData = JSON.parse(content);
      } catch (e) {
        // If not pure JSON, attempt to extract JSON from text
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          jsonData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to extract JSON from response");
        }
      }
      
      // Map the extracted data to our Course interface
      const extractedCourses: Course[] = jsonData.map((item: any, index: number) => ({
        id: `${index + 1}`,
        title: item.title,
        type: item.type || "",
        time: item.time,
        location: item.location,
        icon: getCourseIcon(item.title)
      }));
      
      setCourses(extractedCourses);
      
      Alert.alert("Success", "Schedule processed successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert(
        "Error", 
        "Failed to process the schedule image. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to determine icon based on course title
  const getCourseIcon = (courseTitle: string): keyof typeof Ionicons.glyphMap => {
    const title = courseTitle.toLowerCase();
    
    if (title.includes("math")) return "calculator";
    if (title.includes("phys")) return "flask";
    if (title.includes("chem")) return "beaker";
    if (title.includes("bio")) return "leaf";
    if (title.includes("comp") || title.includes("cs")) return "code-slash";
    if (title.includes("engr")) return "construct";
    if (title.includes("eng")) return "document-text";
    if (title.includes("hist")) return "time";
    if (title.includes("art")) return "color-palette";
    if (title.includes("music")) return "musical-notes";
    if (title.includes("psych")) return "brain";
    
    return "school";
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
              disabled={isProcessing}
            >
              {isProcessing ? (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text style={styles.processingText}>Processing Schedule...</Text>
                </View>
              ) : image ? (
                <>
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.changeImageButton}
                    onPress={handleImagePicker}
                  >
                    <Text style={styles.changeImageText}>Change Image</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={32} color="#4CAF50" />
                  <Text style={styles.uploadText}>Upload Schedule</Text>
                  <Text style={styles.uploadSubtext}>
                    Upload an image of your class schedule to automatically extract your courses
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {courses.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Extracted Courses</Text>
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
                      {course.type && (
                        <Text style={styles.courseType}>{course.type}</Text>
                      )}
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
            </>
          )}
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
  uploadSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  changeImageButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  changeImageText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  processingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
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
    marginBottom: 4,
  },
  courseType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
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