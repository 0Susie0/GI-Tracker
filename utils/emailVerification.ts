// utils/emailVerification.ts
import { reload, sendEmailVerification, User } from 'firebase/auth';
import { Alert } from 'react-native';

/**
 * Sends email verification to the current user
 * @param user - Firebase user object
 * @returns Promise<boolean> - Success status
 */
export const sendVerificationEmail = async (user: User): Promise<boolean> => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error: any) {
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
 * @param user - Firebase user object
 * @returns Promise<boolean> - Verification status
 */
export const checkEmailVerification = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    await reload(user);
    return user.emailVerified;
  } catch (error: any) {
    console.error('Error checking email verification:', error);
    return false;
  }
};

/**
 * Waits for email verification with polling
 * @param user - Firebase user object
 * @param onVerified - Callback when verified
 * @param onTimeout - Callback when timeout reached
 * @param timeoutMinutes - Timeout in minutes (default 10)
 * @returns NodeJS.Timeout - Interval ID that can be cleared if needed
 */
export const waitForEmailVerification = (
  user: User,
  onVerified: () => void,
  onTimeout: () => void,
  timeoutMinutes: number = 10
): NodeJS.Timeout => {
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

  return intervalId;
};

/**
 * Resends verification email with rate limiting
 * @param user - Firebase user object
 * @param onSuccess - Success callback
 * @param onError - Error callback
 * @returns Promise<boolean> - Success status
 */
export const resendVerificationEmail = async (
  user: User,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<boolean> => {
  try {
    // Check if enough time has passed since last send (60 seconds)
    const lastSentTime = user.metadata?.lastSignInTime;
    const now = Date.now();
    
    if (lastSentTime) {
      const timeSinceLastSend = now - new Date(lastSentTime).getTime();
      
      if (timeSinceLastSend < 60000) {
        const waitTime = Math.ceil((60000 - timeSinceLastSend) / 1000);
        Alert.alert(
          'Please Wait',
          `Please wait ${waitTime} seconds before requesting another verification email.`,
          [{ text: 'OK' }]
        );
        return false;
      }
    }

    const success = await sendVerificationEmail(user);
    if (success && onSuccess) {
      onSuccess();
    }
    return success;
  } catch (error: any) {
    console.error('Error resending verification email:', error);
    if (onError) {
      onError(error);
    }
    Alert.alert(
      'Error',
      'Failed to resend verification email. Please try again later.',
      [{ text: 'OK' }]
    );
    return false;
  }
};

/**
 * Email verification utilities
 */
export const emailVerificationUtils = {
  sendVerificationEmail,
  checkEmailVerification,
  waitForEmailVerification,
  resendVerificationEmail,
};

export default emailVerificationUtils;
