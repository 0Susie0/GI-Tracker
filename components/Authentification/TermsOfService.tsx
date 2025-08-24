// components/Authentification/TermsOfService.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { TermsCheckboxProps, TermsOfServiceProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

const TermsOfService: React.FC<TermsOfServiceProps> = ({ 
  isVisible, 
  onAccept, 
  onDecline, 
  onClose 
}) => {
  const handleAccept = (): void => {
    onAccept();
    onClose?.();
  };

  const handleDecline = (): void => {
    onDecline();
    onClose?.();
  };

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
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By using GI Tracker, you agree to be bound by these Terms of Service and our Privacy Policy. 
            If you do not agree to these terms, please do not use our service.
          </Text>

          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.text}>
            GI Tracker is a mobile application that helps users track glycemic index values of foods, 
            monitor glucose levels, and maintain dietary records. This app is designed for educational 
            and informational purposes only.
          </Text>

          <Text style={styles.sectionTitle}>3. Medical Disclaimer</Text>
          <Text style={[styles.text, styles.importantText]}>
            <Text style={styles.boldText}>IMPORTANT:</Text> GI Tracker is NOT a medical device and should 
            not be used as a substitute for professional medical advice, diagnosis, or treatment. Always 
            consult with qualified healthcare professionals for medical decisions related to diabetes 
            management or dietary changes.
          </Text>

          <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
          <Text style={styles.text}>
            • You are responsible for the accuracy of data you enter{'\n'}
            • You must keep your account credentials secure{'\n'}
            • You agree not to misuse or abuse the service{'\n'}
            • You must be at least 13 years old to use this service{'\n'}
            • You will not use the app for any illegal or unauthorized purpose
          </Text>

          <Text style={styles.sectionTitle}>5. Data Privacy & Security</Text>
          <Text style={styles.text}>
            We collect and process your data in accordance with our Privacy Policy. Your health data is 
            encrypted and stored securely. We do not sell your personal information to third parties. 
            You have the right to request deletion of your data at any time.
          </Text>

          <Text style={styles.sectionTitle}>6. Accuracy of Information</Text>
          <Text style={styles.text}>
            While we strive to provide accurate glycemic index information, we cannot guarantee the 
            completeness or accuracy of all data. Users should verify nutritional information 
            independently when making dietary decisions. Food database information is sourced from 
            public databases and scientific literature.
          </Text>

          <Text style={styles.sectionTitle}>7. Service Availability</Text>
          <Text style={styles.text}>
            We aim to keep GI Tracker available at all times but cannot guarantee uninterrupted service. 
            We reserve the right to modify, suspend, or discontinue the service at any time with reasonable 
            notice to users.
          </Text>

          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.text}>
            GI Tracker and its developers shall not be liable for any damages arising from the use or 
            inability to use this service, including but not limited to health-related decisions made 
            based on app data. Use at your own risk.
          </Text>

          <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
          <Text style={styles.text}>
            All content, features, and functionality of GI Tracker are owned by us and protected by 
            copyright, trademark, and other laws. You may not reproduce, distribute, or create 
            derivative works without permission.
          </Text>

          <Text style={styles.sectionTitle}>10. Updates to Terms</Text>
          <Text style={styles.text}>
            We may update these Terms of Service from time to time. We will notify users of significant 
            changes. Continued use of the app after changes constitutes acceptance of the new terms.
          </Text>

          <Text style={styles.sectionTitle}>11. Contact Information</Text>
          <Text style={styles.text}>
            If you have questions about these Terms of Service, please contact us through the app's 
            support section or our website.
          </Text>

          <Text style={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={handleDecline}
            activeOpacity={0.7}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
            activeOpacity={0.7}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onPress, style }) => {
  return (
    <View style={[styles.checkboxContainer, style]}>
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={onPress}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress} style={styles.textContainer}>
        <Text style={styles.checkboxText}>
          I agree to the{' '}
          <Text style={styles.linkText}>
            Terms of Service
          </Text>
          {' '}and{' '}
          <Text style={styles.linkText}>
            Privacy Policy
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: fonts.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: spacing(1),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing(4),
    paddingBottom: spacing(6),
  },
  sectionTitle: {
    fontSize: fonts.subtitle,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing(4),
    marginBottom: spacing(2),
  },
  text: {
    fontSize: fonts.body,
    lineHeight: 22,
    color: colors.subtext,
    marginBottom: spacing(3),
  },
  importantText: {
    backgroundColor: '#FEF3CD',
    padding: spacing(3),
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#D97706',
  },
  lastUpdated: {
    fontSize: fonts.caption,
    color: colors.subtext,
    marginTop: spacing(4),
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: spacing(4),
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: spacing(3),
  },
  button: {
    flex: 1,
    paddingVertical: spacing(3),
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  acceptButton: {
    backgroundColor: colors.link,
  },
  declineButton: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  acceptText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: fonts.body,
  },
  declineText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: fonts.body,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing(3),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    marginRight: spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    marginTop: 2, // Align with first line of text
  },
  checkboxChecked: {
    backgroundColor: colors.link,
    borderColor: colors.link,
  },
  textContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: fonts.body,
    color: colors.text,
    lineHeight: 22,
  },
  linkText: {
    color: colors.link,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export { TermsCheckbox };
export default TermsOfService;
