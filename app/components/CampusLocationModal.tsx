// components/CampusLocationModal.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface LocationInfo {
  title: string;
  icon: string;
  description: string;
  details: {
    hours: string;
    location: string;
    amenities: string[];
    contact: string;
  };
}

interface CampusLocationModalProps {
  visible: boolean;
  onClose: () => void;
  locationInfo: LocationInfo | null;
}

const CampusLocationModal = ({ visible, onClose, locationInfo }: CampusLocationModalProps) => {
  if (!locationInfo) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <LinearGradient
            colors={['#1B5E20', '#4CAF50']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalHeader}
          >
            <View style={styles.headerRow}>
              <View style={styles.modalIconContainer}>
                <Ionicons name={locationInfo.icon as any} size={32} color="#ffffff" />
              </View>
              <Text style={styles.modalTitle}>{locationInfo.title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalDescription}>{locationInfo.description}</Text>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Hours</Text>
              <Text style={styles.detailText}>{locationInfo.details.hours}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Location</Text>
              <Text style={styles.detailText}>{locationInfo.details.location}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Amenities</Text>
              {locationInfo.details.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Contact</Text>
              <Text style={styles.detailText}>{locationInfo.details.contact}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  modalTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 20,
    lineHeight: 24,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 22,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 16,
    color: '#424242',
    marginLeft: 8,
  },
});

export default CampusLocationModal;