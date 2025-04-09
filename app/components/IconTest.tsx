import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeIcon from './SafeIcon';

// Sample of common Ionicons names to test
const TEST_ICONS = [
  'home',
  'home-outline',
  'person',
  'person-outline',
  'search',
  'search-outline',
  'settings',
  'settings-outline',
  'add',
  'add-circle',
  'remove',
  'calendar',
  'time',
  'map',
  'chevron-forward',
  'chevron-back',
  'close',
  'close-circle',
  'checkmark',
  'checkmark-circle',
  'library',
  'library-outline',
  'book',
  'book-outline',
  'restaurant',
  'restaurant-outline',
  'barbell',
  'barbell-outline',
  'people',
  'people-outline',
];

const IconTest = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Icon Test</Text>
      <Text style={styles.subtitle}>This screen tests that icons load correctly</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Direct Ionicons</Text>
        <View style={styles.iconGrid}>
          {TEST_ICONS.map((iconName) => (
            <View key={iconName} style={styles.iconContainer}>
              <Ionicons name={iconName as any} size={24} color="#4CAF50" />
              <Text style={styles.iconLabel}>{iconName}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SafeIcon Component</Text>
        <View style={styles.iconGrid}>
          {TEST_ICONS.map((iconName) => (
            <View key={iconName} style={styles.iconContainer}>
              <SafeIcon name={iconName} size={24} color="#1B5E20" />
              <Text style={styles.iconLabel}>{iconName}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <Text style={styles.footer}>
        If icons are visible above, your setup is working correctly.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#757575',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconContainer: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 20,
  },
  iconLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    color: '#757575',
  },
  footer: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 40,
  },
});

export default IconTest; 