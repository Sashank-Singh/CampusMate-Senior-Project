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
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BlackboardIntegration from '../components/BlackboardIntegration';

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
  
  // Form state for adding new listings
  const [newItemForm, setNewItemForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "items", // Default category
  });

  // Academic Progress Data
  const courses = [
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
  ];

  // Degree Requirements
  const degreeProgress = {
    totalCredits: 120,
    completedCredits: 65,
    requiredCourses: 18,
    completedRequiredCourses: 12,
    electiveCourses: 10,
    completedElectiveCourses: 6,
  };

  // Skill Exchange Data
  const [exchangeItems, setExchangeItems] = useState({
    tutoring: [
      {
        id: 1,
        title: "Calculus Tutoring",
        provider: "Alex Johnson",
        rating: 4.8,
        price: "$25/hour",
        description: "Experienced math tutor specializing in calculus and differential equations.",
        availability: "Mon, Wed, Fri evenings",
        image: images.tutoring,
      },
      {
        id: 2,
        title: "Programming Help - Python & Java",
        provider: "Samantha Lee",
        rating: 4.9,
        price: "$30/hour",
        description: "CS major offering help with programming assignments and concepts.",
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
        description: "English major offering proofreading for essays and papers.",
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

  const [exchangeCategory, setExchangeCategory] = useState<'tutoring' | 'services' | 'items'>('tutoring');

  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const addNewListing = () => {
    // Create a new listing based on the form data
    const newId = Math.max(...exchangeItems[newItemForm.category as keyof typeof exchangeItems].map(item => item.id)) + 1;
    
    const newListing = {
      id: newId,
      title: newItemForm.title,
      price: `$${newItemForm.price}`,
      description: newItemForm.description,
      image: images[newItemForm.category as keyof typeof images],
      // Add category-specific properties
      ...(newItemForm.category === 'tutoring' ? {
        provider: "You", 
        rating: 5.0,
        availability: "Contact for availability",
      } : {}),
      ...(newItemForm.category === 'services' ? {
        provider: "You",
        rating: 5.0,
        turnaround: "To be discussed",
      } : {}),
      ...(newItemForm.category === 'items' ? {
        seller: "You",
        condition: "Used",
      } : {})
    };

    // Add the new listing to the appropriate category
    setExchangeItems(prev => ({
      ...prev,
      [newItemForm.category]: [...prev[newItemForm.category as keyof typeof prev], newListing]
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
  const filteredCourses = courses.filter(course =>
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExchangeItems = {
    tutoring: exchangeItems.tutoring.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    services: exchangeItems.services.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    items: exchangeItems.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  const renderAcademicsContent = () => (
    <ScrollView>
      {/* Blackboard Integration */}
      <BlackboardIntegration />
      
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Degree Progress</Text>
        <View style={styles.progressContainer}>
          <Text>Total Credits: {degreeProgress.completedCredits}/{degreeProgress.totalCredits}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                {width: `${(degreeProgress.completedCredits/degreeProgress.totalCredits) * 100}%`}
              ]} 
            />
          </View>
          
          <Text>Required Courses: {degreeProgress.completedRequiredCourses}/{degreeProgress.requiredCourses}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                {width: `${(degreeProgress.completedRequiredCourses/degreeProgress.requiredCourses) * 100}%`}
              ]} 
            />
          </View>
          
          <Text>Elective Courses: {degreeProgress.completedElectiveCourses}/{degreeProgress.electiveCourses}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                {width: `${(degreeProgress.completedElectiveCourses/degreeProgress.electiveCourses) * 100}%`}
              ]} 
            />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Current Courses</Text>
      {filteredCourses.map((course) => (
        <TouchableOpacity
          key={course.id}
          onPress={() => openModal(course)}
          style={styles.card}
        >
          <LinearGradient
            colors={['#ffffff', '#f5f5f5']}
            style={styles.cardGradient}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="book" size={32} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{course.code}: {course.title}</Text>
              <Text style={styles.cardDescription}>
                Progress: {Math.round(course.progress * 100)}% | 
                Difficulty: {course.difficulty} | 
                Study: {course.recommendedStudyHours} hrs/week
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#757575" />
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderExchangeContent = () => (
    <>
      <ScrollView>
        <View style={styles.categorySwitcher}>
          {['tutoring', 'services', 'items'].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setExchangeCategory(category as any)}
              style={[
                styles.categoryButton,
                exchangeCategory === category ? styles.activeCategoryButton : {}
              ]}
            >
              <Text style={exchangeCategory === category ? styles.activeButtonText : {}}>
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
                colors={['#ffffff', '#f5f5f5']}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={
                      exchangeCategory === 'tutoring' ? "school" : 
                      exchangeCategory === 'services' ? "construct" : "cart"
                    } 
                    size={32} 
                    color="#4CAF50" 
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>
                    {item.provider || item.seller} | {item.price}
                    {item.rating && ` | ⭐ ${item.rating}`}
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
        colors={['#1B5E20', '#4CAF50']}
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
          <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
          <TextInput 
            placeholder={activeTab === "academics" ? "Search courses..." : "Search listings..."} 
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
              activeTab === tab ? styles.activeTabButton : {}
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
        {activeTab === "academics" ? renderAcademicsContent() : renderExchangeContent()}
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
                  {selectedItem.title || (selectedItem.code + ': ' + selectedItem.title)}
                </Text>
                
                {activeTab === "academics" ? (
                  // Course details
                  <>
                    <Text style={styles.modalSubtitle}>Course Details</Text>
                    <Text>Credits: {selectedItem.credits}</Text>
                    <Text>Difficulty: {selectedItem.difficulty}</Text>
                    <Text>Recommended Study: {selectedItem.recommendedStudyHours} hours/week</Text>
                    <Text style={styles.modalSubtitle}>Progress: {Math.round(selectedItem.progress * 100)}%</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, {width: `${selectedItem.progress * 100}%`}]} />
                    </View>
                    <Text style={styles.modalSubtitle}>Next Deadline:</Text>
                    <Text>{selectedItem.nextDeadline}</Text>
                  </>
                ) : (
                  // Exchange item details
                  <>
                    {selectedItem.provider && <Text>Provider: {selectedItem.provider}</Text>}
                    {selectedItem.seller && <Text>Seller: {selectedItem.seller}</Text>}
                    {selectedItem.rating && <Text>Rating: ⭐ {selectedItem.rating}</Text>}
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
                        <Text style={styles.modalSubtitle}>Turnaround Time:</Text>
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
                  
                  <TouchableOpacity
                    style={styles.primaryButton}
                  >
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
              {['tutoring', 'services', 'items'].map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setNewItemForm({...newItemForm, category})}
                  style={[
                    styles.categoryButton,
                    newItemForm.category === category ? styles.activeCategoryButton : {}
                  ]}
                >
                  <Text style={newItemForm.category === category ? styles.activeButtonText : {}}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>Title</Text>
            <TextInput
              style={styles.formInput}
              value={newItemForm.title}
              onChangeText={(text) => setNewItemForm({...newItemForm, title: text})}
              placeholder="Enter listing title"
            />
            
            <Text style={styles.formLabel}>Price</Text>
            <TextInput
              style={styles.formInput}
              value={newItemForm.price}
              onChangeText={(text) => setNewItemForm({...newItemForm, price: text})}
              placeholder="Enter price"
              keyboardType="numeric"
            />
            
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={newItemForm.description}
              onChangeText={(text) => setNewItemForm({...newItemForm, description: text})}
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
                  (!newItemForm.title || !newItemForm.price || !newItemForm.description) ? 
                    styles.disabledButton : {}
                ]}
                disabled={!newItemForm.title || !newItemForm.price || !newItemForm.description}
              >
                <Text style={styles.buttonText}>Create Listing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16 
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
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#757575',
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
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#616161',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  emptyResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyResultsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
});

export default AcademicsExchange;