import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExploreDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  item: any;
}

const detailsMap: Record<string, { description: string; details?: string[] }> = {
  'Library': {
    description: 'Michael Schwartz Library is the academic heart of CSU. Find books, study spaces, computer labs, and more.',
    details: [
      'Open: 8am - 10pm (Mon-Fri)',
      'Floors: 4',
      'Quiet & Group Study Areas',
      'Printing & Copy Services',
      'Research Help Desk',
      'Address: 1860 E 22nd St, Cleveland, OH 44115',
    ],
  },
  'Viking Marketplace (Cafeteria)': {
    description: 'Viking Marketplace is CSU’s main cafeteria, offering all-you-care-to-eat meals and a variety of cuisines, including vegetarian and vegan options. Outtakes is also available for grab-and-go snacks.',
    details: [
      'Buffet-style dining hall',
      'Outtakes: Grab-and-go snacks',
      'Open: 7am - 8pm (Mon-Fri)',
      'Vegetarian & Vegan Options',
      'All-you-care-to-eat',
      'Address: 2121 Euclid Ave, Cleveland, OH 44115',
    ],
  },
  'Gym': {
    description: 'The CSU Recreation Center offers fitness equipment, swimming, group classes, and intramural sports.',
    details: [
      'Open: 6am - 11pm (Mon-Fri)',
      'Indoor Track & Pool',
      'Fitness Classes',
      'Locker Rooms & Showers',
      'Address: 2420 Chester Ave, Cleveland, OH 44115',
    ],
  },
  'Student Center': {
    description: 'The Student Center is the social hub of CSU, home to dining, student orgs, and events.',
    details: [
      'Dining Hall & Lounges',
      'Student Organization Offices',
      'Bookstore & Game Room',
      'Event Spaces',
      'Open: 7am - 10pm (Mon-Fri)',
      'Address: 2121 Euclid Ave, Cleveland, OH 44115',
    ],
  },
  'Wolstein Center': {
    description: 'CSU’s arena for basketball games, concerts, and large events.',
    details: [
      'Capacity: 13,610',
      'Hosts Vikings Basketball',
      'Concerts & Commencement',
      'Address: 2000 Prospect Ave E, Cleveland, OH 44115',
    ],
  },
  'Research Commons': {
    description: 'Collaborative research and innovation space for students and faculty.',
    details: [
      'Open Labs',
      'Maker Space',
      'Workshops & Seminars',
      'Address: 2121 Euclid Ave, Cleveland, OH 44115',
    ],
  },

};

const ExploreDetailsModal: React.FC<ExploreDetailsModalProps> = ({ visible, onClose, item }) => {
  if (!item) return null;
  const info = detailsMap[item.title] || { description: '', details: [] };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#006B54" />
          </TouchableOpacity>
          <Ionicons name={item.icon} size={48} color="#006B54" style={{ alignSelf: 'center', marginBottom: 8 }} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{info.description}</Text>
          <ScrollView style={{ marginTop: 10 }}>
            {info.details && info.details.map((detail, idx) => (
              <Text style={styles.detail} key={idx}>• {detail}</Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#006B54',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 26,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  detail: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
    marginLeft: 8,
  },
});

export default ExploreDetailsModal;
