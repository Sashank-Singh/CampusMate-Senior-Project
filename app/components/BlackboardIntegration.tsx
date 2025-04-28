import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BlackboardService from '../services/BlackboardService';

interface BlackboardCourse {
  id: string;
  courseId: string;
  name: string;
  progress: number;
  grade: string | null;
  creditHours?: number;
}

interface BlackboardAssignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'completed' | 'upcoming' | 'late';
  score?: number;
  possibleScore?: number;
}

export default function BlackboardIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<BlackboardCourse[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<BlackboardAssignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen focused, checking auth status");
      checkAuthenticationStatus();
      return () => {};
    }, [])
  );

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    setIsLoading(true);
    try {
      console.log("Checking Blackboard authentication status...");

      // First check if we're already authenticated
      let authenticated = BlackboardService.isAuthenticated();
      console.log("Initial authentication status:", authenticated);

      // If not authenticated, try to get a token
      if (!authenticated) {
        console.log("Not authenticated, attempting to get client credentials token...");
        const success = await BlackboardService.getClientCredentialsToken();
        console.log("Token acquisition result:", success);

        // Check authentication status again
        authenticated = BlackboardService.isAuthenticated();
        console.log("Authentication status after token attempt:", authenticated);
      }

      setIsConnected(authenticated);

      if (authenticated) {
        console.log("Authenticated, loading Blackboard data...");
        await loadBlackboardData();
      } else {
        console.log("Not authenticated after token attempt");
      }
    } catch (err) {
      setError('Failed to check authentication status');
      console.error("Authentication check error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlackboardData = async () => {
    try {
      console.log("Loading Blackboard data...");

      // Load courses
      console.log("Fetching courses...");
      const coursesData = await BlackboardService.getCourses();
      console.log("Courses data received:", coursesData ? "Yes" : "No");

      if (!coursesData || !coursesData.results) {
        console.error("No courses data received");
        setError('Failed to load courses data');
        return;
      }

      console.log(`Found ${coursesData.results.length} courses`);

      // Process course data
      const processedCourses: BlackboardCourse[] = [];

      for (const course of coursesData.results) {
        try {
          console.log(`Processing course: ${course.name} (${course.id})`);

          // Get grades for each course
          console.log(`Fetching grades for course ${course.id}...`);
          const gradesData = await BlackboardService.getCourseGrades(course.id);

          // Calculate progress based on completed assignments
          console.log(`Fetching grade columns for course ${course.id}...`);
          const columnsData = await BlackboardService.getGradeColumns(course.id);

          // Simple progress calculation based on available grades
          const totalItems = columnsData.results ? columnsData.results.length : 0;
          const gradedItems = gradesData.results ?
            gradesData.results.filter(g => g.score !== null).length : 0;
          const progress = totalItems > 0 ? gradedItems / totalItems : 0;

          console.log(`Course progress: ${progress * 100}% (${gradedItems}/${totalItems})`);

          // Calculate overall grade if available
          const overallGrade = gradesData.results ?
            gradesData.results.find(g => g.columnId === 'overall') : null;

          processedCourses.push({
            id: course.id,
            courseId: course.courseId,
            name: course.name,
            progress: progress,
            grade: overallGrade ? `${overallGrade.score}%` : null,
            creditHours: 3, // Default
          });

          console.log(`Added course to processed list: ${course.name}`);
        } catch (courseError) {
          console.error(`Error processing course ${course.id}:`, courseError);
        }
      }

      console.log(`Processed ${processedCourses.length} courses`);
      setCourses(processedCourses);

      // Load calendar/upcoming assignments
      console.log("Fetching calendar items...");
      const now = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(now.getDate() + 14);

      const calendarData = await BlackboardService.getCalendarItems({
        since: now.toISOString(),
        until: twoWeeksFromNow.toISOString(),
        limit: 10
      });

      console.log("Calendar data received:", calendarData ? "Yes" : "No");

      if (!calendarData || !calendarData.results) {
        console.log("No calendar data available");
        return; // Continue without calendar data
      }

      // Process calendar items
      console.log(`Found ${calendarData.results.length} calendar items`);
      const gradableItems = calendarData.results.filter(item => item.type === 'GradableItem');
      console.log(`Found ${gradableItems.length} gradable items`);

      const processedAssignments = gradableItems.map(item => ({
        id: item.id,
        title: item.title,
        dueDate: item.end,
        status: (new Date(item.end) < now ? 'late' : 'upcoming') as 'late' | 'upcoming',
      }));

      console.log(`Processed ${processedAssignments.length} assignments`);
      setUpcomingAssignments(processedAssignments as BlackboardAssignment[]);

      console.log("Blackboard data loading complete");
    } catch (err) {
      setError('Failed to load Blackboard data');
      console.error("Error loading Blackboard data:", err);
    }
  };

  const connectToBlackboard = () => {
    // @ts-ignore
    navigation.navigate('BlackboardAuth');
  };

  const disconnectFromBlackboard = async () => {
    try {
      await BlackboardService.logout();
      setIsConnected(false);
      setCourses([]);
      setUpcomingAssignments([]);
    } catch (err) {
      setError('Failed to disconnect from Blackboard');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Blackboard data...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.connectContainer}>
        <Ionicons name="school-outline" size={48} color="#4CAF50" />
        <Text style={styles.connectTitle}>Connect to Blackboard</Text>
        <Text style={styles.connectDescription}>
          Link your Blackboard account to see your courses, assignments, and grades in real-time.
        </Text>
        <TouchableOpacity style={styles.connectButton} onPress={connectToBlackboard}>
          <Text style={styles.connectButtonText}>Connect Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Ionicons name="close-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blackboard Integration</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadBlackboardData}>
          <Ionicons name="refresh" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Courses from Blackboard</Text>
        {courses.length === 0 ? (
          <Text style={styles.emptyText}>No courses found.</Text>
        ) : (
          courses.map(course => (
            <View key={course.id} style={styles.courseItem}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseName}>{course.name}</Text>
                {course.grade && (
                  <Text style={styles.courseGrade}>{course.grade}</Text>
                )}
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, {width: `${course.progress * 100}%`}]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(course.progress * 100)}% complete
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
        {upcomingAssignments.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming assignments.</Text>
        ) : (
          upcomingAssignments.map(assignment => (
            <View key={assignment.id} style={styles.assignmentItem}>
              <View style={styles.assignmentHeader}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text
                  style={[
                    styles.assignmentStatus,
                    { color: assignment.status === 'late' ? '#f44336' : '#4CAF50' }
                  ]}
                >
                  {assignment.status === 'late' ? 'Late' : 'Upcoming'}
                </Text>
              </View>
              <Text style={styles.assignmentDue}>
                Due: {new Date(assignment.dueDate).toLocaleDateString()} at {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {assignment.score !== undefined && (
                <Text style={styles.assignmentScore}>
                  Score: {assignment.score}/{assignment.possibleScore}
                </Text>
              )}
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.disconnectButton} onPress={disconnectFromBlackboard}>
        <Text style={styles.disconnectButtonText}>Disconnect from Blackboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  connectContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  connectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  connectDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorBanner: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4CAF50',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
  courseItem: {
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseName: {
    fontWeight: 'bold',
    flex: 1,
  },
  courseGrade: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  assignmentItem: {
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  assignmentTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  assignmentStatus: {
    fontWeight: 'bold',
  },
  assignmentDue: {
    fontSize: 14,
    color: '#666',
  },
  assignmentScore: {
    marginTop: 4,
    fontWeight: 'bold',
  },
  disconnectButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disconnectButtonText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
});