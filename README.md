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
- **User Registration & Login**: Secure Firebase authentication
- **Guest Mode**: Try the app without creating an account
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
├── app/                    # Main app entry point
│   └── App.js             # Root component with navigation
├── navigation/            # Navigation configuration
│   ├── AppNavigator.js    # Main app navigation (tabs)
│   └── AuthNavigator.js   # Authentication navigation
├── screens/               # All app screens
│   ├── auth/             # Login/Signup screens
│   ├── tracking/         # Food tracking screens
│   ├── progress/         # Progress monitoring screens
│   └── profile/          # User profile screens
├── components/           # Reusable UI components
│   ├── Header.js         # Page headers
│   ├── FoodCard.js       # Food item display
│   ├── ProgressChart.js  # Chart component
│   └── ...              # Other UI components
├── utils/               # Utility functions
│   ├── firebase.js      # Firebase configuration
│   └── constants.js     # App constants
└── assets/             # Images and static assets
```

## 🧪 Testing Your Build

Since you have an Android internal distribution build ready, here's how to test effectively:

### Pre-Testing Checklist
- ✅ Critical app crash bug fixed
- ✅ Dependencies updated and compatible
- ✅ Firebase configuration active

### Test Scenarios

1. **Authentication Flow**
   - Register new account
   - Login with existing credentials
   - Try "Continue as Guest" option
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

## ⚠️ Known Limitations

1. **Camera Food Detection**: Currently uses mock data - real AI integration pending
2. **Chart Library**: Basic chart implementation - consider upgrading to react-native-chart-kit
3. **Data Validation**: Limited input validation in some forms
4. **Offline Support**: No offline data caching implemented
5. **Push Notifications**: Not yet implemented

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