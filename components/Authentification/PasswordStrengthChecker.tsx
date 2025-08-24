// components/Authentification/PasswordStrengthChecker.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PasswordStrengthCheckerProps } from '../../types/components';
import { colors, fonts, radius, spacing } from '../../utils/theme';

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  criteria: PasswordCriteria;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({ 
  password, 
  showStrength = true, 
  requirements,
  style 
}) => {
  const calculateStrength = (password: string): PasswordStrength => {
    if (!password) return { 
      score: 0, 
      label: '', 
      color: colors.subtext, 
      criteria: { length: false, uppercase: false, lowercase: false, number: false, special: false }
    };
    
    let score = 0;
    const criteria: PasswordCriteria = {
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

    // Use custom requirements if provided
    if (requirements) {
      score = 0;
      for (const requirement of requirements) {
        if (requirement.test(password)) {
          score++;
        }
      }
      const maxScore = requirements.length;
      const ratio = score / maxScore;
      
      if (ratio < 0.4) return { score, label: 'Very Weak', color: '#ff4444', criteria };
      if (ratio < 0.6) return { score, label: 'Weak', color: '#ff8800', criteria };
      if (ratio < 0.8) return { score, label: 'Good', color: '#ffbb00', criteria };
      if (ratio < 1.0) return { score, label: 'Strong', color: '#88cc00', criteria };
      return { score, label: 'Very Strong', color: '#44aa00', criteria };
    }
    
    // Default strength calculation
    if (score < 2) return { score, label: 'Very Weak', color: '#ff4444', criteria };
    if (score < 3) return { score, label: 'Weak', color: '#ff8800', criteria };
    if (score < 4) return { score, label: 'Good', color: '#ffbb00', criteria };
    if (score < 5) return { score, label: 'Strong', color: '#88cc00', criteria };
    return { score, label: 'Very Strong', color: '#44aa00', criteria };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <View style={[styles.container, style]}>
      {showStrength && (
        <>
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
                    width: `${(strength.score / (requirements?.length || 5)) * 100}%`,
                    backgroundColor: strength.color,
                  },
                ]}
              />
            </View>
          </View>
        </>
      )}

      <View style={styles.criteriaContainer}>
        <Text style={styles.criteriaTitle}>Requirements:</Text>
        
        {requirements ? (
          requirements.map((req, index) => (
            <CriteriaItem
              key={index}
              met={req.test(password)}
              text={req.message}
            />
          ))
        ) : (
          <>
            <CriteriaItem
              met={strength.criteria.length}
              text="At least 8 characters"
            />
            <CriteriaItem
              met={strength.criteria.uppercase}
              text="One uppercase letter"
            />
            <CriteriaItem
              met={strength.criteria.lowercase}
              text="One lowercase letter"
            />
            <CriteriaItem
              met={strength.criteria.number}
              text="One number"
            />
            <CriteriaItem
              met={strength.criteria.special}
              text="One special character"
            />
          </>
        )}
      </View>
    </View>
  );
};

interface CriteriaItemProps {
  met: boolean;
  text: string;
}

const CriteriaItem: React.FC<CriteriaItemProps> = ({ met, text }) => (
  <View style={styles.criteriaItem}>
    <Text style={[styles.criteriaIcon, { color: met ? '#44aa00' : colors.subtext }]}>
      {met ? '✓' : '○'}
    </Text>
    <Text style={[styles.criteriaText, { color: met ? '#44aa00' : colors.subtext }]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing(2),
    padding: spacing(3),
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  strengthBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  strengthLabel: {
    fontSize: fonts.body,
    fontWeight: '500',
    color: colors.text,
  },
  strengthText: {
    fontSize: fonts.body,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: spacing(3),
  },
  progressBackground: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  criteriaContainer: {
    marginTop: spacing(1),
  },
  criteriaTitle: {
    fontSize: fonts.caption,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(1.5),
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(0.5),
  },
  criteriaIcon: {
    fontSize: fonts.caption,
    marginRight: spacing(2),
    width: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  criteriaText: {
    fontSize: fonts.caption,
    flex: 1,
  },
});

export default PasswordStrengthChecker;

