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
import Constants from 'expo-constants';

// Define API key directly to avoid env variable issues - using the real key from .env.local
const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined.');
}

interface Course {
  id: string;
  title: string;
  type?: string;
  time: string;
  location: string;
  icon: string;
  days: string[]; // Array of days this course meets (e.g., ["Monday", "Wednesday"])
}

// All possible weekdays
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const CoursesScreen = () => {
  const [coursesByDay, setCoursesByDay] = useState<{[key: string]: Course[]}>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  });
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeDay, setActiveDay] = useState<string>("Monday");

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
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
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
      
      // Prepare the prompt for the vision model with emphasis on day extraction
      const prompt = `
      You are a university course schedule analyzer. Given a schedule image with a weekly timetable, extract all courses shown accurately.

      **Schedule Format Information:**
      - The image is structured as 8 columns, each representing a day of the week.
      - The columns are ordered from **left to right** as: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", (extra column)].
      - Only consider columns for **Monday through Friday**. Ignore the last two columns (Saturday and Sunday).
      - Each cell in the columns contains information about a course scheduled on that day.

      **For each course, extract the following:**
      1. **Course code and section** (e.g., "ENGR 1100.15 - 406")
      2. **Course type** (e.g., "Lecture", "Recitation", "Laboratory")
      3. **Time range** (e.g., "10:20AM - 11:15AM")
      4. **Days of the week** the course meets (detect which days it appears in the columns for Monday through Friday)
      5. **Location** (e.g., "Scott Lab E001")

      **IMPORTANT:**
      - Courses can appear on **multiple days**. You must track and merge information so that a course is only listed once, with all relevant days included.
      - Carefully analyze each weekday column (Monday to Friday) to ensure no scheduled course is missed.
      - Include **Thursday and Friday** even if they contain fewer courses.

      **Return Format:**
      Respond with only valid JSON: a JSON array of course objects, each with these properties:
      - "title" (string) — course code and section
      - "type" (string) — lecture/lab/recitation
      - "time" (string) — time range (no day)
      - "days" (array of strings) — weekdays this course meets (e.g., ["Monday", "Wednesday"])
      - "location" (string) — location string like "Stillman Hall 100"

      **Example:**
      [
        {
          "title": "MATH 1151 - 0080",
          "type": "Lecture", 
          "time": "1:50PM - 2:45PM",
          "days": ["Monday", "Wednesday", "Friday"],
          "location": "Stillman Hall 100"
        }
      ]
      `;

      
      try {
        // Make request to OpenRouter API
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'meta-llama/llama-4-maverick:free',
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
            max_tokens: 1500
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'HTTP-Referer': 'https://campusmate.example.com',
              'X-Title': 'CampusMate App',
              'Content-Type': 'application/json',
              'User-Agent': 'CampusMate/1.0.0',
              'OpenRouter-Sandbox': 'true' // Use sandbox mode to test without spending credits
            }
          }
        );
        
        // Parse the response
        const content = response.data.choices[0].message.content;
        
        console.log("API Response Content:", content);
        
        // Clean the JSON string by removing control characters
        const cleanContent = content.replace(/[\u0000-\u001F]+/g, '');
        
        // Extract JSON from the cleaned response
        let jsonData;
        try {
          // Use regex to extract JSON array from the response
          const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            jsonData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Failed to extract JSON from response");
          }
        } catch (e) {
          console.error("Error parsing JSON:", e);
          Alert.alert("Error", "Failed to extract JSON from response. Please try again.");
          return;
        }
        
        // Process courses and organize by day
        organizeCoursesByDay(jsonData);
        
        Alert.alert("Success", "Schedule processed successfully!");
      } catch (apiError: any) {
        console.error("API call failed:", apiError);
        if (apiError.response) {
          console.error("Response status:", apiError.response.status);
          console.error("Response data:", apiError.response.data);
        }
        
        // Fallback to sample data if API call fails
        const sampleData = [
          {
            "title": "MATH 1151 - 0080",
            "type": "Lecture", 
            "time": "1:50PM - 2:45PM",
            "days": ["Monday", "Wednesday", "Friday"],
            "location": "Stillman Hall 100"
          },
          {
            "title": "ENGR 1100 - 0050", 
            "type": "Lecture",
            "time": "10:20AM - 11:15AM", 
            "days": ["Tuesday", "Thursday"],
            "location": "Scott Lab E001"
          },
          {
            "title": "CSE 2221 - 0030",
            "type": "Laboratory", 
            "time": "3:00PM - 4:55PM",
            "days": ["Wednesday"],
            "location": "Dreese Lab 305"
          }
        ];
        
        // Process sample courses and organize by day
        organizeCoursesByDay(sampleData);
        
        Alert.alert(
          "Demo Mode", 
          "Using sample schedule data for demonstration. API connection failed: " + 
          (apiError.response?.data?.error?.message || apiError.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("General error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Organize courses by day of the week
  const organizeCoursesByDay = (extractedData: any[]) => {
    const newCoursesByDay: {[key: string]: Course[]} = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };
    
    let courseId = 1;
    
    extractedData.forEach(item => {
      // Process days array - ensure proper format
      const days = Array.isArray(item.days) 
        ? item.days 
        : typeof item.days === 'string'
          ? item.days.split(',').map((day: string) => day.trim())
          : [];
      
      // Normalize day names
      const normalizedDays = days.map((day: string) => {
        const dayLower = day.toLowerCase();
        if (dayLower.includes('mon')) return 'Monday';
        if (dayLower.includes('tue')) return 'Tuesday';
        if (dayLower.includes('wed')) return 'Wednesday';
        if (dayLower.includes('thu')) return 'Thursday';
        if (dayLower.includes('fri')) return 'Friday';
        return day; // Keep original if no match
      });
      
      // Create course object
      const course: Course = {
        id: `${courseId++}`,
        title: item.title || "Unknown Course",
        type: item.type || "",
        time: item.time || "Time not specified",
        location: item.location || "Location not specified",
        icon: getCourseIcon(item.title || ""),
        days: normalizedDays
      };
      
      // Add course to each relevant day
      normalizedDays.forEach((day: string) => {
        if (newCoursesByDay[day]) {
          newCoursesByDay[day].push(course);
        }
      });
    });
    
    // Sort courses by time for each day
    Object.keys(newCoursesByDay).forEach(day => {
      newCoursesByDay[day].sort((a, b) => {
        // Extract times for comparison
        const timeA = a.time.match(/(\d+):(\d+)([AP]M)/);
        const timeB = b.time.match(/(\d+):(\d+)([AP]M)/);
        
        if (!timeA || !timeB) return 0;
        
        // Convert to 24-hour format for comparison
        let hourA = parseInt(timeA[1]);
        const minuteA = parseInt(timeA[2]);
        const ampmA = timeA[3];
        
        let hourB = parseInt(timeB[1]);
        const minuteB = parseInt(timeB[2]);
        const ampmB = timeB[3];
        
        // Adjust for PM
        if (ampmA === 'PM' && hourA !== 12) hourA += 12;
        if (ampmB === 'PM' && hourB !== 12) hourB += 12;
        
        // Adjust for AM 12
        if (ampmA === 'AM' && hourA === 12) hourA = 0;
        if (ampmB === 'AM' && hourB === 12) hourB = 0;
        
        // Compare hours first
        if (hourA !== hourB) return hourA - hourB;
        
        // If hours are equal, compare minutes
        return minuteA - minuteB;
      });
    });
    
    setCoursesByDay(newCoursesByDay);
    
    // Set active day to the first day that has courses
    for (const day of WEEKDAYS) {
      if (newCoursesByDay[day] && newCoursesByDay[day].length > 0) {
        setActiveDay(day);
        break;
      }
    }
  };
  
  // Function to determine icon based on course title
  const getCourseIcon = (courseTitle: string): string => {
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
    if (title.includes("psych")) return "book";
    
    return "school";
  };

  // Get the total number of courses across all days
  const getTotalCourses = () => {
    return Object.values(coursesByDay).reduce((sum, courses) => sum + courses.length, 0);
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

          {getTotalCourses() > 0 && (
            <>
              <Text style={styles.sectionTitle}>Your Weekly Schedule</Text>
              
              {/* Day selector tabs */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.dayTabsContainer}
              >
                {WEEKDAYS.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayTab,
                      activeDay === day && styles.activeDayTab,
                      coursesByDay[day].length === 0 && styles.emptyDayTab
                    ]}
                    onPress={() => setActiveDay(day)}
                    disabled={coursesByDay[day].length === 0}
                  >
                    <Text style={[
                      styles.dayTabText,
                      activeDay === day && styles.activeDayTabText,
                      coursesByDay[day].length === 0 && styles.emptyDayTabText
                    ]}>
                      {day.slice(0, 3)}
                    </Text>
                    {coursesByDay[day].length > 0 && (
                      <View style={styles.courseBadge}>
                        <Text style={styles.courseBadgeText}>{coursesByDay[day].length}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Courses for the selected day */}
              <View style={styles.dayCoursesContainer}>
                <Text style={styles.dayTitle}>{activeDay}'s Classes</Text>
                
                {coursesByDay[activeDay].length === 0 ? (
                  <View style={styles.noCoursesContainer}>
                    <Ionicons name="calendar-outline" size={48} color="#E0E0E0" />
                    <Text style={styles.noCoursesText}>No classes on {activeDay}</Text>
                  </View>
                ) : (
                  coursesByDay[activeDay].map((course) => (
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
                  ))
                )}
              </View>
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
  dayTabsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeDayTab: {
    backgroundColor: '#E8F5E9',
  },
  emptyDayTab: {
    opacity: 0.5,
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  activeDayTabText: {
    color: '#4CAF50',
  },
  emptyDayTabText: {
    color: '#BDBDBD',
  },
  courseBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  courseBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dayCoursesContainer: {
    paddingTop: 8,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
  },
  noCoursesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    marginBottom: 20,
  },
  noCoursesText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 12,
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