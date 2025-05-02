import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  Switch,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// Import local images
const images = {
  computer_science: require("../assets/images/suffle1.jpg"),
  mathematics: require("../assets/images/suffle2.jpg"),
  biology: require("../assets/images/suffle3.jpg"),
  physics: require("../assets/images/logo.png"),
  tutoring: require("../assets/images/suffle1.jpg"),
  items: require("../assets/images/suffle2.jpg"),
  services: require("../assets/images/suffle3.jpg"),
};

type Tab = "academics" | "exchange";

const AcademicsExchange = () => {
  const [activeTab, setActiveTab] = useState<Tab>("academics");
  const [modalVisible, setModalVisible] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New state variables for editable academic data
  const [academicModalVisible, setAcademicModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [addCourseModalVisible, setAddCourseModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  
  // Editable academic overview data
  const [academicData, setAcademicData] = useState({
    gpa: "3.78",
    totalCredits: 120,
    earnedCredits: 65,
    currentCourses: 4,
    semester: "Spring 2025",
    standing: "Good Standing",
    nextDeadline: "Midterm Exam - May 10, 2025"
  });
  
  // Form for adding/editing courses
  const [courseForm, setCourseForm] = useState({
    code: "",
    title: "",
    progress: "0",
    credits: "3",
    difficulty: "Medium",
    recommendedStudyHours: "6",
    nextDeadline: ""
  });

  // Form state for adding new listings
  const [newItemForm, setNewItemForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "items", // Default category
  });

  // Editable degree progress
  const [degreeProgress, setDegreeProgress] = useState({
    totalCredits: 120,
    completedCredits: 65,
    requiredCourses: 18,
    completedRequiredCourses: 12,
    electiveCourses: 10,
    completedElectiveCourses: 6,
  });

  // Academic Progress Data - Make it editable
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: "CS101",
      title: "Introduction to Programming",
      progress: 0.75,
      credits: 3,
      difficulty: "Medium",
      recommendedStudyHours: 6,
      nextDeadline: "Assignment #3 - May 15, 2025",
      image: images.computer_science,
    },
    {
      id: 2,
      code: "MATH201",
      title: "Calculus II",
      progress: 0.5,
      credits: 4,
      difficulty: "High",
      recommendedStudyHours: 8,
      nextDeadline: "Midterm Exam - May 10, 2025",
      image: images.mathematics,
    },
    {
      id: 3,
      code: "BIO150",
      title: "Cell Biology",
      progress: 0.9,
      credits: 3,
      difficulty: "Medium",
      recommendedStudyHours: 5,
      nextDeadline: "Lab Report - May 18, 2025",
      image: images.biology,
    },
    {
      id: 4,
      code: "PHYS120",
      title: "Physics for Engineers",
      progress: 0.3,
      credits: 4,
      difficulty: "High",
      recommendedStudyHours: 9,
      nextDeadline: "Problem Set #5 - May 12, 2025",
      image: images.physics,
    },
  ]);

  // Skill Exchange Data
  const [exchangeItems, setExchangeItems] = useState({
    tutoring: [
      {
        id: 1,
        title: "Calculus Tutoring",
        provider: "Alex Johnson",
        rating: 4.8,
        price: "$25/hour",
        description:
          "Experienced math tutor specializing in calculus and differential equations.",
        availability: "Mon, Wed, Fri evenings",
        image: images.tutoring,
      },
      {
        id: 2,
        title: "Programming Help - Python & Java",
        provider: "Samantha Lee",
        rating: 4.9,
        price: "$30/hour",
        description:
          "CS major offering help with programming assignments and concepts.",
        availability: "Weekends and Thursday evenings",
        image: images.tutoring,
      },
    ],
    services: [
      {
        id: 1,
        title: "Essay Proofreading & Editing",
        provider: "Michael Chen",
        rating: 4.7,
        price: "$15/paper",
        description:
          "English major offering proofreading for essays and papers.",
        turnaround: "48 hours",
        image: images.services,
      },
      {
        id: 2,
        title: "Resume Design & Review",
        provider: "Jasmine Williams",
        rating: 4.6,
        price: "$20",
        description: "Business student with experience in HR and recruitment.",
        turnaround: "3 days",
        image: images.services,
      },
    ],
    items: [
      {
        id: 1,
        title: "Calculus Textbook - 11th Edition",
        seller: "Ryan Cooper",
        price: "$60",
        condition: "Like New",
        description: "Barely used. No highlighting or notes.",
        image: images.items,
      },
      {
        id: 2,
        title: "Scientific Calculator - TI-84",
        seller: "Emma Lewis",
        price: "$45",
        condition: "Good",
        description: "Works perfectly. Minor scratches on the case.",
        image: images.items,
      },
    ],
  });

  const [exchangeCategory, setExchangeCategory] = useState<
    "tutoring" | "services" | "items"
  >("tutoring");

  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const addNewListing = () => {
    // Create a new listing based on the form data
    const newId =
      Math.max(
        ...exchangeItems[
          newItemForm.category as keyof typeof exchangeItems
        ].map((item) => item.id)
      ) + 1;

    const newListing = {
      id: newId,
      title: newItemForm.title,
      price: `$${newItemForm.price}`,
      description: newItemForm.description,
      image: images[newItemForm.category as keyof typeof images],
      // Add category-specific properties
      ...(newItemForm.category === "tutoring"
        ? {
            provider: "You",
            rating: 5.0,
            availability: "Contact for availability",
          }
        : {}),
      ...(newItemForm.category === "services"
        ? {
            provider: "You",
            rating: 5.0,
            turnaround: "To be discussed",
          }
        : {}),
      ...(newItemForm.category === "items"
        ? {
            seller: "You",
            condition: "Used",
          }
        : {}),
    };

    // Add the new listing to the appropriate category
    setExchangeItems((prev) => ({
      ...prev,
      [newItemForm.category]: [
        ...prev[newItemForm.category as keyof typeof prev],
        newListing,
      ],
    }));

    // Reset the form and close the modal
    setNewItemForm({
      title: "",
      price: "",
      description: "",
      category: "items",
    });
    setAddItemModalVisible(false);
  };

  // Filter items based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExchangeItems = {
    tutoring: exchangeItems.tutoring.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    services: exchangeItems.services.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    items: exchangeItems.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  // Now add the edit functions
  const editAcademicData = () => {
    setAcademicModalVisible(true);
  };

  const editDegreeProgress = () => {
    setProgressModalVisible(true);
  };

  const addCourse = () => {
    setCourseForm({
      code: "",
      title: "",
      progress: "0",
      credits: "3",
      difficulty: "Medium",
      recommendedStudyHours: "6",
      nextDeadline: ""
    });
    setEditingCourse(null);
    setAddCourseModalVisible(true);
  };

  const editCourse = (course: any) => {
    setCourseForm({
      code: course.code,
      title: course.title,
      progress: (course.progress * 100).toString(),
      credits: course.credits.toString(),
      difficulty: course.difficulty,
      recommendedStudyHours: course.recommendedStudyHours.toString(),
      nextDeadline: course.nextDeadline
    });
    setEditingCourse(course);
    setAddCourseModalVisible(true);
  };

  const saveCourse = () => {
    const newCourse = {
      id: editingCourse ? editingCourse.id : Math.max(0, ...courses.map(c => c.id)) + 1,
      code: courseForm.code,
      title: courseForm.title,
      progress: parseFloat(courseForm.progress) / 100,
      credits: parseInt(courseForm.credits),
      difficulty: courseForm.difficulty,
      recommendedStudyHours: parseInt(courseForm.recommendedStudyHours),
      nextDeadline: courseForm.nextDeadline,
      image: editingCourse ? editingCourse.image : images.computer_science,
    };

    if (editingCourse) {
      // Update existing course
      setCourses(courses.map(c => c.id === editingCourse.id ? newCourse : c));
    } else {
      // Add new course
      setCourses([...courses, newCourse]);
      // Update current courses count
      setAcademicData({
        ...academicData,
        currentCourses: academicData.currentCourses + 1
      });
    }
    setAddCourseModalVisible(false);
  };
  
  const deleteCourse = (courseId: number) => {
    setCourses(courses.filter(c => c.id !== courseId));
    setAcademicData({
      ...academicData,
      currentCourses: academicData.currentCourses - 1
    });
    setAddCourseModalVisible(false);
  };

  const renderAcademicsContent = () => (
    <ScrollView>
      {/* Manual Academic Progress with Edit Button */}
      <View style={styles.academicSummaryCard}>
        <View style={styles.academicHeaderRow}>
          <View style={styles.academicIconContainer}>
            <Ionicons name="school" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.academicHeaderText}>Academic Overview</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={editAcademicData}
          >
            <Ionicons name="create-outline" size={22} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.academicStatsRow}>
          <View style={styles.academicStatItem}>
            <Text style={styles.academicStatValue}>{academicData.gpa}</Text>
            <Text style={styles.academicStatLabel}>GPA</Text>
          </View>
          <View style={styles.academicStatItem}>
            <Text style={styles.academicStatValue}>{academicData.earnedCredits}/{academicData.totalCredits}</Text>
            <Text style={styles.academicStatLabel}>Credits</Text>
          </View>
          <View style={styles.academicStatItem}>
            <Text style={styles.academicStatValue}>{academicData.currentCourses}</Text>
            <Text style={styles.academicStatLabel}>Current Courses</Text>
          </View>
        </View>
        
        <View style={styles.academicInfoRow}>
          <View style={styles.academicInfoItem}>
            <Text style={styles.academicInfoLabel}>Semester:</Text>
            <Text style={styles.academicInfoValue}>{academicData.semester}</Text>
          </View>
          <View style={styles.academicInfoItem}>
            <Text style={styles.academicInfoLabel}>Status:</Text>
            <Text style={styles.academicInfoValue}>{academicData.standing}</Text>
          </View>
        </View>
        
        <View style={styles.academicCalendarRow}>
          <Ionicons name="calendar" size={20} color="#4CAF50" />
          <Text style={styles.academicCalendarText}>
            Next deadline: {academicData.nextDeadline}
          </Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Degree Progress</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={editDegreeProgress}
          >
            <Ionicons name="create-outline" size={22} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <View style={styles.progressContainer}>
          <Text>
            Total Credits: {degreeProgress.completedCredits}/
            {degreeProgress.totalCredits}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (degreeProgress.completedCredits /
                      degreeProgress.totalCredits) *
                    100
                  }%`,
                },
              ]}
            />
          </View>

          <Text>
            Required Courses: {degreeProgress.completedRequiredCourses}/
            {degreeProgress.requiredCourses}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (degreeProgress.completedRequiredCourses /
                      degreeProgress.requiredCourses) *
                    100
                  }%`,
                },
              ]}
            />
          </View>

          <Text>
            Elective Courses: {degreeProgress.completedElectiveCourses}/
            {degreeProgress.electiveCourses}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (degreeProgress.completedElectiveCourses /
                      degreeProgress.electiveCourses) *
                    100
                  }%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Current Courses</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addCourse}
        >
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      {filteredCourses.length === 0 ? (
        <View style={styles.emptyCoursesContainer}>
          <Ionicons name="book" size={48} color="#E0E0E0" />
          <Text style={styles.emptyCoursesText}>No courses found</Text>
          <TouchableOpacity 
            style={styles.addCourseButton}
            onPress={addCourse}
          >
            <Text style={styles.addCourseButtonText}>Add Your First Course</Text>
          </TouchableOpacity>
        </View>
      ) : (
        filteredCourses.map((course) => (
          <TouchableOpacity
            key={course.id}
            onPress={() => openModal(course)}
            style={styles.card}
          >
            <LinearGradient
              colors={["#ffffff", "#f5f5f5"]}
              style={styles.cardGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="book" size={32} color="#4CAF50" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {course.code}: {course.title}
                </Text>
                <Text style={styles.cardDescription}>
                  Progress: {Math.round(course.progress * 100)}% | Difficulty:{" "}
                  {course.difficulty} | Study: {course.recommendedStudyHours}{" "}
                  hrs/week
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => editCourse(course)}
                style={styles.editIconButton}
              >
                <Ionicons name="create-outline" size={24} color="#757575" />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  const renderExchangeContent = () => (
    <>
      <ScrollView>
        <View style={styles.categorySwitcher}>
          {["tutoring", "services", "items"].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setExchangeCategory(category as any)}
              style={[
                styles.categoryButton,
                exchangeCategory === category
                  ? styles.activeCategoryButton
                  : {},
              ]}
            >
              <Text
                style={
                  exchangeCategory === category ? styles.activeButtonText : {}
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredExchangeItems[exchangeCategory].length === 0 ? (
          <View style={styles.emptyResultsContainer}>
            <Ionicons name="search-outline" size={48} color="#aaa" />
            <Text style={styles.emptyResultsText}>No results found</Text>
          </View>
        ) : (
          filteredExchangeItems[exchangeCategory].map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => openModal(item)}
              style={styles.card}
            >
              <LinearGradient
                colors={["#ffffff", "#f5f5f5"]}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={
                      exchangeCategory === "tutoring"
                        ? "school"
                        : exchangeCategory === "services"
                        ? "construct"
                        : "cart"
                    }
                    size={32}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>
                    {"provider" in item
                      ? item.provider
                      : item.seller
                      ? item.seller
                      : "N/A"}{" "}
                    | {item.price}
                    {"rating" in item && ` | ⭐ ${item.rating}`}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#757575" />
              </LinearGradient>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button for Adding New Listings */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setAddItemModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#1B5E20", "#4CAF50"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerSmall}>My</Text>
          <Text style={styles.header}>
            {activeTab === "academics" ? "Academic Progress" : "Skill Exchange"}
          </Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#757575"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder={
              activeTab === "academics"
                ? "Search courses..."
                : "Search listings..."
            }
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["academics", "exchange"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as Tab)}
            style={[
              styles.tabButton,
              activeTab === tab ? styles.activeTabButton : {},
            ]}
          >
            <Text style={{ color: activeTab === tab ? "#fff" : "#000" }}>
              {tab === "academics" ? "Academic Progress" : "Skill Exchange"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === "academics"
          ? renderAcademicsContent()
          : renderExchangeContent()}
      </View>

      {/* Details Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Image
                  source={selectedItem.image}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <Text style={styles.modalTitle}>
                  {selectedItem.title ||
                    selectedItem.code + ": " + selectedItem.title}
                </Text>

                {activeTab === "academics" ? (
                  // Course details
                  <>
                    <Text style={styles.modalSubtitle}>Course Details</Text>
                    <Text>Credits: {selectedItem.credits}</Text>
                    <Text>Difficulty: {selectedItem.difficulty}</Text>
                    <Text>
                      Recommended Study: {selectedItem.recommendedStudyHours}{" "}
                      hours/week
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      Progress: {Math.round(selectedItem.progress * 100)}%
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${selectedItem.progress * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.modalSubtitle}>Next Deadline:</Text>
                    <Text>{selectedItem.nextDeadline}</Text>
                  </>
                ) : (
                  // Exchange item details
                  <>
                    {selectedItem.provider && (
                      <Text>Provider: {selectedItem.provider}</Text>
                    )}
                    {selectedItem.seller && (
                      <Text>Seller: {selectedItem.seller}</Text>
                    )}
                    {selectedItem.rating && (
                      <Text>Rating: ⭐ {selectedItem.rating}</Text>
                    )}
                    <Text style={styles.modalPrice}>{selectedItem.price}</Text>
                    <Text style={styles.modalSubtitle}>Description:</Text>
                    <Text>{selectedItem.description}</Text>
                    {selectedItem.availability && (
                      <>
                        <Text style={styles.modalSubtitle}>Availability:</Text>
                        <Text>{selectedItem.availability}</Text>
                      </>
                    )}
                    {selectedItem.turnaround && (
                      <>
                        <Text style={styles.modalSubtitle}>
                          Turnaround Time:
                        </Text>
                        <Text>{selectedItem.turnaround}</Text>
                      </>
                    )}
                    {selectedItem.condition && (
                      <>
                        <Text style={styles.modalSubtitle}>Condition:</Text>
                        <Text>{selectedItem.condition}</Text>
                      </>
                    )}
                  </>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.buttonText}>
                      {activeTab === "academics" ? "View Details" : "Contact"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add New Listing Modal */}
      <Modal visible={addItemModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Listing</Text>

            <Text style={styles.formLabel}>Category</Text>
            <View style={styles.categorySwitcher}>
              {["tutoring", "services", "items"].map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setNewItemForm({ ...newItemForm, category })}
                  style={[
                    styles.categoryButton,
                    newItemForm.category === category
                      ? styles.activeCategoryButton
                      : {},
                  ]}
                >
                  <Text
                    style={
                      newItemForm.category === category
                        ? styles.activeButtonText
                        : {}
                    }
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>Title</Text>
            <TextInput
              style={styles.formInput}
              value={newItemForm.title}
              onChangeText={(text) =>
                setNewItemForm({ ...newItemForm, title: text })
              }
              placeholder="Enter listing title"
            />

            <Text style={styles.formLabel}>Price</Text>
            <TextInput
              style={styles.formInput}
              value={newItemForm.price}
              onChangeText={(text) =>
                setNewItemForm({ ...newItemForm, price: text })
              }
              placeholder="Enter price"
              keyboardType="numeric"
            />

            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={newItemForm.description}
              onChangeText={(text) =>
                setNewItemForm({ ...newItemForm, description: text })
              }
              placeholder="Enter description"
              multiline
              numberOfLines={4}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setAddItemModalVisible(false)}
                style={styles.secondaryButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addNewListing}
                style={[
                  styles.primaryButton,
                  !newItemForm.title ||
                  !newItemForm.price ||
                  !newItemForm.description
                    ? styles.disabledButton
                    : {},
                ]}
                disabled={
                  !newItemForm.title ||
                  !newItemForm.price ||
                  !newItemForm.description
                }
              >
                <Text style={styles.buttonText}>Create Listing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Academic Overview Edit Modal */}
      <Modal visible={academicModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Academic Overview</Text>

                <Text style={styles.formLabel}>GPA</Text>
                <TextInput
                  style={styles.formInput}
                  value={academicData.gpa}
                  onChangeText={(text) => setAcademicData({ ...academicData, gpa: text })}
                  keyboardType="decimal-pad"
                />

                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Earned Credits</Text>
                    <TextInput
                      style={styles.formInput}
                      value={academicData.earnedCredits.toString()}
                      onChangeText={(text) => 
                        setAcademicData({ ...academicData, earnedCredits: parseInt(text) || 0 })
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Total Credits</Text>
                    <TextInput
                      style={styles.formInput}
                      value={academicData.totalCredits.toString()}
                      onChangeText={(text) =>
                        setAcademicData({ ...academicData, totalCredits: parseInt(text) || 0 })
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <Text style={styles.formLabel}>Semester</Text>
                <TextInput
                  style={styles.formInput}
                  value={academicData.semester}
                  onChangeText={(text) => setAcademicData({ ...academicData, semester: text })}
                />

                <Text style={styles.formLabel}>Academic Standing</Text>
                <TextInput
                  style={styles.formInput}
                  value={academicData.standing}
                  onChangeText={(text) => setAcademicData({ ...academicData, standing: text })}
                />

                <Text style={styles.formLabel}>Next Deadline</Text>
                <TextInput
                  style={styles.formInput}
                  value={academicData.nextDeadline}
                  onChangeText={(text) => setAcademicData({ ...academicData, nextDeadline: text })}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setAcademicModalVisible(false)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setAcademicModalVisible(false)}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Degree Progress Edit Modal */}
      <Modal visible={progressModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Degree Progress</Text>

                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Completed Credits</Text>
                    <TextInput
                      style={styles.formInput}
                      value={degreeProgress.completedCredits.toString()}
                      onChangeText={(text) =>
                        setDegreeProgress({
                          ...degreeProgress,
                          completedCredits: parseInt(text) || 0,
                        })
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Total Credits</Text>
                    <TextInput
                      style={styles.formInput}
                      value={degreeProgress.totalCredits.toString()}
                      onChangeText={(text) =>
                        setDegreeProgress({
                          ...degreeProgress,
                          totalCredits: parseInt(text) || 0,
                        })
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Completed Required</Text>
                    <TextInput
                      style={styles.formInput}
                      value={degreeProgress.completedRequiredCourses.toString()}
                      onChangeText={(text) =>
                        setDegreeProgress({
                          ...degreeProgress,
                          completedRequiredCourses: parseInt(text) || 0,
                        })
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Total Required</Text>
                    <TextInput
                      style={styles.formInput}
                      value={degreeProgress.requiredCourses.toString()}
                      onChangeText={(text) =>
                        setDegreeProgress({
                          ...degreeProgress,
                          requiredCourses: parseInt(text) || 0,
                        })
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Completed Electives</Text>
                    <TextInput
                      style={styles.formInput}
                      value={degreeProgress.completedElectiveCourses.toString()}
                      onChangeText={(text) =>
                        setDegreeProgress({
                          ...degreeProgress,
                          completedElectiveCourses: parseInt(text) || 0,
                        })
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Total Electives</Text>
                    <TextInput
                      style={styles.formInput}
                      value={degreeProgress.electiveCourses.toString()}
                      onChangeText={(text) =>
                        setDegreeProgress({
                          ...degreeProgress,
                          electiveCourses: parseInt(text) || 0,
                        })
                      }
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setProgressModalVisible(false)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setProgressModalVisible(false)}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add/Edit Course Modal */}
      <Modal visible={addCourseModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </Text>

                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Course Code</Text>
                    <TextInput
                      style={styles.formInput}
                      value={courseForm.code}
                      onChangeText={(text) => setCourseForm({ ...courseForm, code: text })}
                      placeholder="E.g. CS101"
                    />
                  </View>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Credits</Text>
                    <TextInput
                      style={styles.formInput}
                      value={courseForm.credits}
                      onChangeText={(text) => setCourseForm({ ...courseForm, credits: text })}
                      keyboardType="number-pad"
                      placeholder="3"
                    />
                  </View>
                </View>

                <Text style={styles.formLabel}>Course Title</Text>
                <TextInput
                  style={styles.formInput}
                  value={courseForm.title}
                  onChangeText={(text) => setCourseForm({ ...courseForm, title: text })}
                  placeholder="Introduction to Computer Science"
                />

                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Difficulty</Text>
                    <View style={styles.pickerContainer}>
                      <TouchableOpacity
                        style={[
                          styles.difficultyButton,
                          courseForm.difficulty === "Low" && styles.activeDifficultyButton,
                        ]}
                        onPress={() => setCourseForm({ ...courseForm, difficulty: "Low" })}
                      >
                        <Text style={courseForm.difficulty === "Low" ? styles.activeDifficultyText : {}}>Low</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.difficultyButton,
                          courseForm.difficulty === "Medium" && styles.activeDifficultyButton,
                        ]}
                        onPress={() => setCourseForm({ ...courseForm, difficulty: "Medium" })}
                      >
                        <Text style={courseForm.difficulty === "Medium" ? styles.activeDifficultyText : {}}>Medium</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.difficultyButton,
                          courseForm.difficulty === "High" && styles.activeDifficultyButton,
                        ]}
                        onPress={() => setCourseForm({ ...courseForm, difficulty: "High" })}
                      >
                        <Text style={courseForm.difficulty === "High" ? styles.activeDifficultyText : {}}>High</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Study Hours/Week</Text>
                    <TextInput
                      style={styles.formInput}
                      value={courseForm.recommendedStudyHours}
                      onChangeText={(text) => setCourseForm({ ...courseForm, recommendedStudyHours: text })}
                      keyboardType="number-pad"
                      placeholder="6"
                    />
                  </View>
                  <View style={styles.formColumn}>
                    <Text style={styles.formLabel}>Progress (%)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={courseForm.progress}
                      onChangeText={(text) => setCourseForm({ ...courseForm, progress: text })}
                      keyboardType="number-pad"
                      placeholder="0-100"
                    />
                  </View>
                </View>

                <Text style={styles.formLabel}>Next Deadline</Text>
                <TextInput
                  style={styles.formInput}
                  value={courseForm.nextDeadline}
                  onChangeText={(text) => setCourseForm({ ...courseForm, nextDeadline: text })}
                  placeholder="E.g. Assignment #3 - May 15, 2025"
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setAddCourseModalVisible(false)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>

                  {editingCourse && (
                    <TouchableOpacity
                      onPress={() => deleteCourse(editingCourse.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={saveCourse}
                    style={[
                      styles.primaryButton,
                      (!courseForm.code || !courseForm.title) && styles.disabledButton,
                    ]}
                    disabled={!courseForm.code || !courseForm.title}
                  >
                    <Text style={styles.buttonText}>
                      {editingCourse ? "Update Course" : "Add Course"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 0 : 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    padding: 20,
  },
  headerSmall: {
    fontSize: 16,
    color: "#E8F5E9",
    fontWeight: "500",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 8,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    marginTop: -25,
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: "darkgreen",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  summaryContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 8,
  },
  progressFill: {
    height: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: "#ffffff",
  },
  cardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#757575",
  },
  categorySwitcher: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeCategoryButton: {
    backgroundColor: "#4CAF50",
  },
  activeButtonText: {
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#424242",
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#616161",
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: "#9E9E9E",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7", // Lighter green
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  fabButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
    color: "#616161",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  emptyResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyResultsText: {
    marginTop: 10,
    fontSize: 16,
    color: "#757575",
  },
  academicSummaryCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  academicHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  academicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  academicHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#424242",
  },
  academicStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  academicStatItem: {
    alignItems: "center",
    flex: 1,
  },
  academicStatValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  academicStatLabel: {
    fontSize: 12,
    color: "#757575",
  },
  academicInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  academicInfoItem: {
    flex: 1,
  },
  academicInfoLabel: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 2,
  },
  academicInfoValue: {
    fontSize: 15,
    color: "#424242",
    fontWeight: "500",
  },
  academicCalendarRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 8,
  },
  academicCalendarText: {
    marginLeft: 8,
    color: "#424242",
    fontSize: 14,
  },
  editButton: {
    padding: 5,
    marginLeft: 'auto',
  },
  addButton: {
    padding: 5,
  },
  emptyCoursesContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
    marginVertical: 20,
  },
  emptyCoursesText: {
    fontSize: 16,
    color: "#757575",
    marginTop: 15,
    marginBottom: 20,
  },
  addCourseButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addCourseButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  formColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginHorizontal: 2,
    alignItems: "center",
  },
  activeDifficultyButton: {
    backgroundColor: "#4CAF50",
  },
  activeDifficultyText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  editIconButton: {
    padding: 8,
  },
});

export default AcademicsExchange;
