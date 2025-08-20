# GI Tracker - Glycemic Index Food Tracking App

A React Native mobile application for tracking glycemic index values of foods to help users make informed dietary decisions, particularly beneficial for diabetes management and healthy eating.

## 🎯 Purpose

GI Tracker helps users monitor their food intake by focusing on glycemic index values, allowing them to:
- Track foods with their GI values and nutritional information
- Monitor glucose levels and trends over time
- Use camera scanning to identify foods
- Maintain a comprehensive food diary
- View progress analytics and trends

## ✨ Features

### 🔐 Authentication
- **Enhanced User Registration**: 
  - Real-time form validation with visual feedback
  - Password strength checker with security requirements
  - Terms of Service acceptance with modal viewer
  - Email verification flow with automatic verification detection
  - Auto-login after successful account creation
- **Secure Login**: Firebase authentication with enhanced error handling
- **Email Verification**: Comprehensive email verification system with resend capabilities
- **Guest Mode**: Try the app without creating an account (placeholder)
- **Profile Management**: Edit personal information and dietary preferences

### 📱 Food Tracking
- **Home Dashboard**: Browse and search food items
- **Camera Scanning**: Take photos of food to identify GI values (simulated)
- **Food Search**: Find foods by name with filtering options
- **Food Details**: View detailed nutritional information and GI values

### 📊 Progress Monitoring
- **Glucose Logging**: Record blood glucose readings
- **Trends Analysis**: View weekly and monthly glucose trends
- **Progress Charts**: Visual representations of health metrics
- **Macro Summary**: Track protein, carbs, and fat intake

### 👤 Profile & Settings
- **User Profile**: Manage personal information and preferences
- **Settings & Preferences**: Customize app behavior
- **Data Synchronization**: Cloud storage with Firebase

## 🛠 Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Backend**: Firebase (Authentication, Firestore Database)
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android/iOS development environment (for device builds)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GI_Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Scan QR code with Expo Go app (development)
   - Use Android emulator: `npx expo run:android`
   - Use iOS simulator: `npx expo run:ios` (macOS only)

### Building for Production

1. **Android Internal Distribution**
   ```bash
   eas build --platform android --profile preview
   ```

2. **iOS Build**
   ```bash
   eas build --platform ios --profile preview
   ```

## 📁 Project Structure

```
GI_Tracker/
├── app/                           # Main app entry point
│   └── App.js                    # Root component with navigation
├── navigation/                   # Navigation configuration
│   ├── AppNavigator.js           # Main app navigation (tabs)
│   └── AuthNavigator.js          # Authentication navigation (includes EmailVerification)
├── screens/                      # All app screens
│   ├── auth/                    # Authentication screens
│   │   ├── LoginScreen.js       # User login
│   │   ├── SignUpScreen.js      # Enhanced user registration
│   │   └── EmailVerificationScreen.js  # Email verification flow
│   ├── tracking/                # Food tracking screens
│   ├── progress/                # Progress monitoring screens
│   └── profile/                 # User profile screens
├── components/                   # Reusable UI components
│   ├── Header.js                # Page headers
│   ├── FoodCard.js              # Food item display
│   ├── ProgressChart.js         # Chart component
│   ├── PasswordStrengthChecker.js  # Password strength validation
│   ├── TermsOfService.js        # Terms of Service modal and checkbox
│   ├── ValidatedInputField.js   # Enhanced input with real-time validation
│   └── ...                     # Other UI components
├── utils/                       # Utility functions
│   ├── firebase.js             # Firebase configuration
│   ├── emailVerification.js    # Email verification utilities
│   └── constants.js            # App constants
└── assets/                     # Images and static assets
```

## 🧪 Testing Your Build

Since you have an Android internal distribution build ready, here's how to test effectively:

### Pre-Testing Checklist
- ✅ Critical app crash bug fixed
- ✅ Dependencies updated and compatible
- ✅ Firebase configuration active

### Test Scenarios

1. **Enhanced Authentication Flow**
   - Test new user registration with password strength validation
   - Verify Terms of Service acceptance requirement
   - Test email verification flow and resend functionality
   - Test auto-login after successful registration
   - Login with existing credentials
   - Try "Continue as Guest" option (placeholder)
   - Test logout functionality

2. **Food Tracking Features**
   - Browse food items on home screen
   - Use search and filter functions
   - Test camera scanning (simulated)
   - View food details

3. **Progress Monitoring**
   - Log glucose readings
   - Switch between week/month views
   - Check data persistence

4. **Profile Management**
   - Edit profile information
   - Update preferences
   - Test data synchronization

## 🔒 Enhanced Authentication Features

### Password Security
- **Real-time strength checking**: Visual feedback for password complexity
- **Security requirements**: Minimum 8 characters with uppercase, lowercase, and numbers
- **Password confirmation**: Ensures passwords match before submission

### Form Validation
- **Real-time validation**: Instant feedback as users type
- **Visual indicators**: Success/error states with icons and colors
- **Comprehensive error messages**: Clear guidance for fixing validation issues

### Email Verification
- **Automatic verification detection**: Polls for verification status
- **Resend functionality**: Rate-limited email resending with cooldown timer
- **Manual verification check**: Users can manually check verification status
- **Skip option**: Optional verification for immediate app access

### Terms of Service
- **Modal viewer**: Full terms displayed in scrollable modal
- **Required acceptance**: Cannot create account without accepting terms
- **Checkbox integration**: Clear visual indication of acceptance status

### User Experience
- **Auto-login**: Seamless login after successful registration
- **Enhanced error handling**: Specific error messages for different failure scenarios
- **Loading states**: Clear feedback during authentication processes
- **Responsive design**: Works on various screen sizes

## ⚠️ Known Limitations

1. **Camera Food Detection**: Currently uses mock data - real AI integration pending
2. **Chart Library**: Basic chart implementation - consider upgrading to react-native-chart-kit
3. **Offline Support**: No offline data caching implemented
4. **Push Notifications**: Not yet implemented
5. **Guest Mode**: Placeholder implementation - full guest functionality pending

## 🔧 Development Notes

### Environment Setup
- Firebase project: `foodgi-bc42c`
- EAS Project ID: `b69e1b44-6185-4cd3-8471-837f3e4077f9`
- Package: `com.susiehu.gitracker`

### API Integrations Needed
- Food database API (USDA FoodData Central, Edamam, etc.)
- Image recognition service for food detection
- Glucose meter integration (optional)

## 🐛 Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Firebase auth errors**: Check internet connection and Firebase console
3. **Build failures**: Ensure all dependencies are compatible with Expo SDK

### Debug Commands
```bash
# Check project health
npx expo-doctor

# Clear all caches
npx expo start --clear

# Reset project (if needed)
npm run reset-project
```

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase console for backend issues
3. Check Expo documentation for React Native specific issues

---

**Note**: This app is designed for educational and personal use. Always consult healthcare professionals for medical advice regarding diabetes management.