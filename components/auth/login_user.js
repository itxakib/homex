import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,Image, StyleSheet, Animated, Easing, Alert, ActivityIndicator, SwitchComponent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { app, auth,db } from '../../integrations/firebase';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { GoogleSignin,isSuccessResponse,isErrorWithCode,statusCodes } from '@react-native-google-signin/google-signin';
// Initialize Firebase services

const COLORS = {
  blue: '#007BFF',
  lightBlue: '#D7EAFD',
  darkGray: '#4A4A4A',
  yellow: '#FFE680',
  white: '#FFFFFF'
};

const formConfig = {
  login: {
    fields: [
      { id: 'email', placeholder: 'Email', icon: 'mail', keyboardType: 'email-address' },
      { id: 'password', placeholder: 'Password', icon: 'lock-closed', secure: true }
    ],
    button: { text: 'Sign In', color: COLORS.blue },
    switchText: "Don't have an account? ",
    switchLink: 'Sign Up'
  },
  signup: {
    fields: [
      { id: 'name', placeholder: 'Full Name', icon: 'person' },
      { id: 'email', placeholder: 'Email', icon: 'mail', keyboardType: 'email-address' },
      { id: 'phone', placeholder: 'Phone Number', icon: 'call', keyboardType: 'phone-pad' },
      { id: 'password', placeholder: 'Password', icon: 'lock-closed', secure: true }
    ],
    button: { text: 'Create Account', color: COLORS.blue },
    switchText: "Already have an account? ",
    switchLink: 'Sign In'
  }
};

const AuthScreen = () => {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const [checked, setChecked] = useState(false);
  const [IsSubmitting,setIsSubmitting]=useState();
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const currentForm = isLogin ? formConfig.login : formConfig.signup;

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!formData.email?.trim() || !formData.password?.trim()) {
        throw new Error('Please fill in all required fields');
      }

      if (!isLogin && (!formData.name?.trim() || !formData.phone?.trim())) {
        throw new Error('Please fill in all required fields');
      }

      if (!checked) {
        throw new Error('Please accept the privacy policies');
      }

      if (isLogin) {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        Alert.alert('Success', 'Logged in successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('tab_navigation') }
        ]);
      } else {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Update user profile with name
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });

        // Save additional user data to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString()
        });

        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: ()=>setIsLogin(true) }
        ]);
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error) => {
    let message = 'An error occurred. Please try again.';
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Email is already in use!';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address!';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters!';
        break;
      case 'auth/user-not-found':
        message = 'User not found!';
        break;
      case 'auth/wrong-password':
        message = 'Invalid password!';
        break;
      default:
        message = error.message || message;
    }
    Alert.alert('Error', message);
  };

  const handleSwitch = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    ]).start(() => setIsLogin(!isLogin));
  };

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true })
    ]).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50]
  });
  useEffect(()=>{
    GoogleSignin.configure({
      iosClientId:'655253277613-9fn6fndd5nbjj821jidrst22j0qtrfr2.apps.googleusercontent.com',
      webClientId:'655253277613-vfvhbus2bmjuds27vgn7qfhikjau8kc8.apps.googleusercontent.com',
      profileImageSize:150,
      prompt: 'select_account',
    })
    
  })
  const handleGoogleSignin=async()=>{
    try{
      setIsSubmitting(true)
      await GoogleSignin.signOut();

      await GoogleSignin.hasPlayServices();
      const response=await GoogleSignin.signIn(
        {
          prompt: 'select_account', // Add this option to force account selection
        }
      );
      if(isSuccessResponse(response)){
        const {idToken,user}=response.data;
        const {name,email,photo}=user;
        console.log('it is a success',idToken)
        navigation.navigate('tab_navigation')

      }
      else{
        Alert('Google Sign in was cancelled')
      }

      setIsSubmitting(false)


    }
    catch(error){
      if(isErrorWithCode(error)){
        switch(error.code){
          case statusCodes.IN_PROGRESS:
            Alert('Googlle sin in is in progress')
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert('Google play services isno t avaible')
            break;
          default:
            Alert(error.code)

        }
      }
      else{
        Alert("An error occured")
      }
      setIsSubmitting(false)

    }

  }
  
  return (
    <View style={styles.container}>
     <View style={styles.logoContainer}>
  <Image
    source={require('../../assets/homexlogo.png')}
    style={styles.logo}
    resizeMode="contain"
  />
</View>
<Text style={[styles.title, !isLogin && styles.signupTitle]}>
  {isLogin ? 'Welcome Back!' : 'Join Us! 👋'}
</Text>

      <Animated.View style={{ transform: [{ translateX }] }}>
        {currentForm.fields.map((field) => (
          <Animated.View key={field.id} style={styles.inputContainer}>
            <Ionicons name={field.icon} size={20} color={COLORS.blue} />
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor="#999"
              secureTextEntry={field.secure}
              keyboardType={field.keyboardType}
              onChangeText={(text) => setFormData({ ...formData, [field.id]: text })}
              value={formData[field.id] || ''}
            />
          </Animated.View>
        ))}
      </Animated.View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
          color={COLORS.blue}
        />
        <Text style={styles.checkboxLabel}>
          By continuing you agree with our{' '}
          <Text style={styles.link} onPress={() => console.log('Privacy Policy')}>
            Privacy Policies
          </Text>
        </Text>
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[
            styles.button, 
            { 
              backgroundColor: currentForm.button.color,
              opacity: isLoading ? 0.7 : 1
            }
          ]}
          onPressIn={handleButtonPress}
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>{currentForm.button.text}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.orDivider}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignin} 
      disabled={IsSubmitting}>
        <Ionicons name="logo-google" size={20} color={COLORS.blue} />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSwitch} style={styles.switch}>
        <Text style={styles.switchText}>
          {currentForm.switchText}
          <Text style={styles.link}>{currentForm.switchLink}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles remain the same as in your original code



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: COLORS.lightBlue,
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,  // Reduced from 32
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 30,  // Reduced from 40
    textAlign: 'center',
    marginTop: 10,
  },
  signupTitle: {
    marginTop: 20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 10,
    marginVertical: 10,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.darkGray,
    fontSize: 16
  },
  button: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.blue
  },
  googleText: {
    marginLeft: 10,
    color: COLORS.darkGray,
    fontWeight: '500'
  },
  switch: {
    marginTop: 20,
    alignSelf: 'center'
  },
  switchText: {
    color: COLORS.darkGray
  },
  link: {
    color: COLORS.blue,
    fontWeight: '500'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  checkboxLabel: {
    color: COLORS.darkGray,
    marginLeft: 8,
    fontSize: 14
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.blue,
    opacity: 0.3
  },
  orText: {
    color: COLORS.darkGray,
    marginHorizontal: 10,
    fontWeight: '500'
  }
});

export default AuthScreen;