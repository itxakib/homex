// utils/googleAuth.js
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    iosClientId: '655253277613-9fn6fndd5nbjj821jidrst22j0qtrfr2.apps.googleusercontent.com',
    webClientId: '655253277613-vfvhbus2bmjuds27vgn7qfhikjau8kc8.apps.googleusercontent.com',
    profileImageSize: 150,
    prompt: 'select_account',
  });
};

export const handleGoogleSignIn = async (onSuccess, onError) => {
  try {
    await GoogleSignin.hasPlayServices();
    // await GoogleSignin.signOut(); // Clear previous session
    const userInfo = await GoogleSignin.signIn({
      prompt: 'select_account',
    });

    if (userInfo.idToken) {
      onSuccess(userInfo);
    } else {
      onError('Google Sign-In failed: No ID token received');
    }
  } catch (error) {
    let errorMessage = 'Google Sign-In failed';
    
    if (error.code) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          errorMessage = 'Sign in cancelled';
          break;
        case statusCodes.IN_PROGRESS:
          errorMessage = 'Operation in progress';
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          errorMessage = 'Play services not available';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
    }
    
    onError(errorMessage);
  }
};