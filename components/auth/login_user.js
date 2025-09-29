import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, Easing, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { app, auth, db } from '../../integrations/firebase';
import { getFirestore, collection, doc, setDoc, getDoc, query,where, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,sendEmailVerification } from 'firebase/auth';
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {
  blue: '#007BFF',
  lightBlue: '#D7EAFD',
  darkGray: '#4A4A4A',
  yellow: '#FFE680',
  white: '#FFFFFF',
  errorRed: '#FF3333'
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
  const [ida,setida]=useState();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const currentForm = isLogin ? formConfig.login : formConfig.signup;
 const dispatch=useDispatch();
  const validateField = (id, value) => {
    let error = '';
    switch (id) {
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        else if (!/[A-Z]/.test(value)) error = 'Password must contain at least one capital letter';
        break;
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (/\d/.test(value)) error = 'Name cannot contain numbers';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^\d+$/.test(value)) error = 'Phone number must contain only digits';
        else if (value.length > 11) error = 'Phone number cannot exceed 11 digits';
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    currentForm.fields.forEach(field => {
      const error = validateField(field.id, formData[field.id] || '');
      if (error) newErrors[field.id] = error;
    });
    if (!checked) newErrors.checkbox = 'Please accept the privacy policies';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (id, text) => {
    setFormData({ ...formData, [id]: text });
    setErrors({ ...errors, [id]: validateField(id, text) });
  };

  


  const handleAuth = async () => {
  if (!validateForm()) return;

  try {
    setIsLoading(true);

    if (isLogin) {
      // ✅ Login flow
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // check email verification
      if (!userCredential.user.emailVerified) {
        await auth.signOut(); // force signout if not verified
        setErrors({
          general: 'Please verify your email before logging in.'
        });
        setIsLoading(false);
        return;
      }
    try {
  const q = query(
    collection(db, "users"),
    where("email", "==", formData.email) // correct usage
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    
    // first matching doc
    dispatch(setUser(userDoc.data()))
    

    console.log("Simple login user data:", userDoc.data());
    // dispatch(setUser(userData)); // optional
  } else {
    console.log("No user found with that email");
  }
} catch (error) {
  console.error("Error getting user by email:", error);
}
    
      navigation.navigate('tab_navigation');
    } else {
      // ✅ Signup flow
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Save user in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date().toISOString()
      });

      // ✅ Send email verification
      await sendEmailVerification(userCredential.user);

      setErrors({
        general: 'Verification email sent. Please check your inbox before logging in.'
      });

      // switch back to login form
      setIsLogin(true);
      setFormData({});
    }
  } catch (error) {
    const newErrors = {};
    switch (error.code) {
      case 'auth/email-already-in-use':
        newErrors.email = 'Email is already in use';
        break;
      case 'auth/invalid-email':
        newErrors.email = 'Invalid email address';
        break;
      case 'auth/weak-password':
        newErrors.password = 'Password should be at least 6 characters';
        break;
      case 'auth/user-not-found':
        newErrors.email = 'User not found';
        break;
      case 'auth/wrong-password':
        newErrors.password = 'Invalid password';
        break;
      default:
        newErrors.general = error.message || 'An error occurred. Please try again.';
    }
    setErrors(newErrors);
  } finally {
    setIsLoading(false);
  }
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
    ]).start(() => {
      setIsLogin(!isLogin);
      setFormData({});
      setErrors({});
    });
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

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '655253277613-9fn6fndd5nbjj821jidrst22j0qtrfr2.apps.googleusercontent.com',
      webClientId: '655253277613-vfvhbus2bmjuds27vgn7qfhikjau8kc8.apps.googleusercontent.com',
      profileImageSize: 150,
      prompt: 'select_account',
    });
  }, []);

  
  const handleGoogleSignin = async () => {
  try {
    setIsSubmitting(true);
    await GoogleSignin.signOut();
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn({
      prompt: 'select_account',
    });
    if (isSuccessResponse(response)) {
      console.log('respponse',response)
      const id = response.data.user.id; 
      console.log(id,'simple id of google')
   if (isSuccessResponse(response)) {
  console.log('response', response);
  const userdata=response.data.user;
  await setDoc(doc(db,'users',userdata.id),{
   uid:userdata.id,
   name:userdata.name,
   email:userdata.email,
   phone:userdata.phone ? userdata.phone:null,
   photo:userdata.photo

  })

  const id = response.data.user.id;
  setida(id)

 try {
  // Save to AsyncStorage
  await AsyncStorage.setItem('userid', id);

  // Retrieve to verify
const idaa = await AsyncStorage.getItem('userid');
setida(idaa)
  console.log(idaa, 'id from AsyncStorage');
  const userdatafromdb=await getDoc(doc(db,'users',id))
  console.log(userdatafromdb.data());
if (userdatafromdb.exists()) {
   
   const snap=userdatafromdb.data();
    dispatch(setUser(snap));

    console.log("Dispatched user data:", snap);

} 
}
catch (e) {
  console.log("Redux dispatch error:", e);
}


      
      navigation.navigate('tab_navigation');
    } else {
      setErrors({ ...errors, general: 'Google Sign in was cancelled' });
    }
  }
} catch (error) {
    let message = 'An error occurred';
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          message = 'Google sign in is in progress';
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          message = 'Google Play Services is not available';
          break;
        default:
          message = error.code;
      }
    }
    setErrors({ ...errors, general: message });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          {isLogin && (
            <Image
              source={require('../../assets/homexlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
        </View>
        <Text style={[styles.title, !isLogin && styles.signupTitle]}>
          {isLogin ? 'Welcome Back!' : 'Join Us! 👋'}
        </Text>

        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}

        <Animated.View style={{ transform: [{ translateX }] }}>
          {currentForm.fields.map((field) => (
            <View key={field.id}>
              <Animated.View style={[
                styles.inputContainer,
                errors[field.id] && styles.inputContainerError
              ]}>
                <Ionicons
                  name={field.icon}
                  size={20}
                  color={errors[field.id] ? COLORS.errorRed : COLORS.blue}
                />
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor="#999"
                  secureTextEntry={field.secure}
                  keyboardType={field.keyboardType}
                  onChangeText={(text) => handleInputChange(field.id, text)}
                  value={formData[field.id] || ''}
                />
              </Animated.View>
              {errors[field.id] && (
                <Text style={styles.errorText}>{errors[field.id]}</Text>
              )}
            </View>
          ))}
        </Animated.View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
              setErrors({ ...errors, checkbox: !checked ? '' : 'Please accept the privacy policies' });
            }}
            color={errors.checkbox ? COLORS.errorRed : COLORS.blue}
          />
          <Text style={styles.checkboxLabel}>
            By continuing you agree with our{' '}
            <Text style={styles.link} onPress={() => console.log('Privacy Policy')}>
              Privacy Policies
            </Text>
          </Text>
        </View>
        {errors.checkbox && (
          <Text style={styles.errorText}>{errors.checkbox}</Text>
        )}

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

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignin}
          disabled={isSubmitting}
        >
          <Ionicons name="logo-google" size={20} color={COLORS.blue} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSwitch} style={styles.switch}>
          <Text style={styles.switchText}>
            {currentForm.switchText}
            <Text style={styles.link}>{currentForm.switchLink}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  scrollContent: {
    padding: 25,
    paddingBottom: 100, // Extra padding for scrollable content
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
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 20,
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
    marginVertical: 8,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  inputContainerError: {
    borderColor: COLORS.errorRed
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
    marginVertical: 15
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
    borderColor: COLORS.blue,
    marginVertical: 10
  },
  googleText: {
    marginLeft: 10,
    color: COLORS.darkGray,
    fontWeight: '500'
  },
  switch: {
    marginTop: 15,
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
    marginVertical: 15
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
  },
  errorText: {
    color: COLORS.errorRed,
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 5
  }
});

export default AuthScreen;