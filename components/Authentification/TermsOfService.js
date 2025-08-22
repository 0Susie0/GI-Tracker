import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const TermsOfService = ({ isVisible, onAccept, onDecline, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Terms of Service</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By using GI Tracker, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.
          </Text>

          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.text}>
            GI Tracker is a mobile application that helps users track glycemic index values of foods, monitor glucose levels, and maintain dietary records. This app is designed for educational and informational purposes only.
          </Text>

          <Text style={styles.sectionTitle}>3. Medical Disclaimer</Text>
          <Text style={styles.text}>
            GI Tracker is NOT a medical device and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions related to diabetes management or dietary changes.
          </Text>

          <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
          <Text style={styles.text}>
            • You are responsible for the accuracy of data you enter{'\n'}
            • You must keep your account credentials secure{'\n'}
            • You agree not to misuse or abuse the service{'\n'}
            • You must be at least 13 years old to use this service
          </Text>

          <Text style={styles.sectionTitle}>5. Data Privacy</Text>
          <Text style={styles.text}>
            We collect and process your data in accordance with our Privacy Policy. Your health data is encrypted and stored securely. We do not sell your personal information to third parties.
          </Text>

          <Text style={styles.sectionTitle}>6. Accuracy of Information</Text>
          <Text style={styles.text}>
            While we strive to provide accurate glycemic index information, we cannot guarantee the completeness or accuracy of all data. Users should verify nutritional information independently when making dietary decisions.
          </Text>

          <Text style={styles.sectionTitle}>7. Service Availability</Text>
          <Text style={styles.text}>
            We aim to keep GI Tracker available at all times but cannot guarantee uninterrupted service. We reserve the right to modify, suspend, or discontinue the service at any time.
          </Text>

          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.text}>
            GI Tracker and its developers shall not be liable for any damages arising from the use or inability to use this service, including but not limited to health-related decisions made based on app data.
          </Text>

          <Text style={styles.sectionTitle}>9. Updates to Terms</Text>
          <Text style={styles.text}>
            We may update these Terms of Service from time to time. Continued use of the app after changes constitutes acceptance of the new terms.
          </Text>

          <Text style={styles.sectionTitle}>10. Contact Information</Text>
          <Text style={styles.text}>
            If you have questions about these Terms of Service, please contact us through the app's support section.
          </Text>

          <Text style={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={onDecline}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={onAccept}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const TermsCheckbox = ({ checked, onPress, style }) => {
  return (
    <View style={[styles.checkboxContainer, style]}>
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={onPress}
      >
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </TouchableOpacity>
      <Text style={styles.checkboxText}>
        I agree to the{' '}
        <Text style={styles.linkText} onPress={onPress}>
          Terms of Service
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 12,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  acceptText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  declineText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  linkText: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
});

export { TermsCheckbox };
export default TermsOfService;
