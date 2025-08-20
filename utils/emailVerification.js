import { reload, sendEmailVerification } from 'firebase/auth';
import { Alert } from 'react-native';

/**
 * Sends email verification to the current user
 * @param {Object} user - Firebase user object
 * @returns {Promise<boolean>} - Success status
 */
export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    Alert.alert(
      'Email Verification Error',
      'Failed to send verification email. Please try again later.'
    );
    return false;
  }
};

/**
 * Checks if the current user's email is verified
 * @param {Object} user - Firebase user object
 * @returns {Promise<boolean>} - Verification status
 */
export const checkEmailVerification = async (user) => {
  if (!user) return false;
  
  try {
    await reload(user);
    return user.emailVerified;
  } catch (error) {
    console.error('Error checking email verification:', error);
    return false;
  }
};

/**
 * Waits for email verification with polling
 * @param {Object} user - Firebase user object
 * @param {Function} onVerified - Callback when verified
 * @param {Function} onTimeout - Callback when timeout reached
 * @param {number} timeoutMinutes - Timeout in minutes (default 10)
 */
export const waitForEmailVerification = (
  user,
  onVerified,
  onTimeout,
  timeoutMinutes = 10
) => {
  const checkInterval = 3000; // Check every 3 seconds
  const maxChecks = (timeoutMinutes * 60 * 1000) / checkInterval;
  let checkCount = 0;

  const intervalId = setInterval(async () => {
    checkCount++;
    
    const isVerified = await checkEmailVerification(user);
    
    if (isVerified) {
      clearInterval(intervalId);
      onVerified();
      return;
    }
    
    if (checkCount >= maxChecks) {
      clearInterval(intervalId);
      onTimeout();
      return;
    }
  }, checkInterval);

  return intervalId; // Return interval ID so it can be cleared if needed
};

/**
 * Resends verification email with rate limiting
 * @param {Object} user - Firebase user object
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const resendVerificationEmail = async (user, onSuccess, onError) => {
  try {
    // Check if enough time has passed since last send (60 seconds)
    const lastSentTime = user.metadata?.lastSignInTime;
    const now = Date.now();
    const timeSinceLastSend = now - new Date(lastSentTime).getTime();
    
    if (timeSinceLastSend < 60000) {
      const waitTime = Math.ceil((60000 - timeSinceLastSend) / 1000);
      Alert.alert(
        'Please Wait',
        `Please wait ${waitTime} seconds before requesting another verification email.`
      );
      return false;
    }

    const success = await sendVerificationEmail(user);
    if (success && onSuccess) {
      onSuccess();
    }
    return success;
  } catch (error) {
    console.error('Error resending verification email:', error);
    if (onError) {
      onError(error);
    }
    return false;
  }
};
