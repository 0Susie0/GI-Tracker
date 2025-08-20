import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PasswordStrengthChecker = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '#ccc' };
    
    let score = 0;
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Calculate score based on criteria
    Object.values(criteria).forEach(met => {
      if (met) score++;
    });
    
    // Determine strength level
    if (score < 2) return { score, label: 'Very Weak', color: '#ff4444', criteria };
    if (score < 3) return { score, label: 'Weak', color: '#ff8800', criteria };
    if (score < 4) return { score, label: 'Good', color: '#ffbb00', criteria };
    if (score < 5) return { score, label: 'Strong', color: '#88cc00', criteria };
    return { score, label: 'Very Strong', color: '#44aa00', criteria };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={styles.strengthBar}>
        <Text style={styles.strengthLabel}>Password Strength:</Text>
        <Text style={[styles.strengthText, { color: strength.color }]}>
          {strength.label}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(strength.score / 5) * 100}%`,
                backgroundColor: strength.color,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.criteriaContainer}>
        <Text style={styles.criteriaTitle}>Requirements:</Text>
        <CriteriaItem
          met={strength.criteria?.length}
          text="At least 8 characters"
        />
        <CriteriaItem
          met={strength.criteria?.uppercase}
          text="One uppercase letter"
        />
        <CriteriaItem
          met={strength.criteria?.lowercase}
          text="One lowercase letter"
        />
        <CriteriaItem
          met={strength.criteria?.number}
          text="One number"
        />
        <CriteriaItem
          met={strength.criteria?.special}
          text="One special character"
        />
      </View>
    </View>
  );
};

const CriteriaItem = ({ met, text }) => (
  <View style={styles.criteriaItem}>
    <Text style={[styles.criteriaIcon, { color: met ? '#44aa00' : '#ccc' }]}>
      {met ? '✓' : '○'}
    </Text>
    <Text style={[styles.criteriaText, { color: met ? '#44aa00' : '#666' }]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  strengthBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  strengthText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  criteriaContainer: {
    marginTop: 4,
  },
  criteriaTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  criteriaIcon: {
    fontSize: 12,
    marginRight: 8,
    width: 16,
    textAlign: 'center',
  },
  criteriaText: {
    fontSize: 12,
    flex: 1,
  },
});

export default PasswordStrengthChecker;
