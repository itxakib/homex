import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Animated, 
  Easing, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Import color scheme
const COLORS = {
  blue: '#007BFF',
  lightBlue: '#D7EAFD',
  darkGray: '#4A4A4A',
  yellow: '#FFE680',
  white: '#FFFFFF'
};

// Service categories based on FYP document (removed pet care)
const serviceCategories = [
  { id: 'plumbing', label: 'Plumbing', icon: 'water', description: 'Water systems and fixture repairs' },
  { id: 'electrical', label: 'Electrical', icon: 'flash', description: 'Electrical repairs and installations' },
  { id: 'cleaning', label: 'Cleaning', icon: 'sparkles', description: 'Home cleaning and organization' },
  { id: 'tutoring', label: 'Tutoring', icon: 'book', description: 'Academic support and teaching' },
  { id: 'errands', label: 'Errands', icon: 'cart', description: 'Shopping and delivery tasks' },
  { id: 'chef', label: 'Personal Chef', icon: 'restaurant', description: 'Cooking and meal preparation' },
  { id: 'fitness', label: 'Fitness', icon: 'fitness', description: 'Exercise and wellness training' },
  { id: 'events', label: 'Events', icon: 'calendar', description: 'Event planning and organization' },
  { id: 'maintenance', label: 'Maintenance', icon: 'construct', description: 'General home maintenance' }
];

const formConfig = {
  login: {
    fields: [
      { id: 'email', placeholder: 'Email', icon: 'mail', keyboardType: 'email-address' },
      { id: 'password', placeholder: 'Password', icon: 'lock-closed', secure: true }
    ],
    button: { text: 'Sign In', color: COLORS.blue },
    switchText: "Don't have a provider account? ",
    switchLink: 'Register as Provider'
  },
  signup: {
    fields: [
      { id: 'name', placeholder: 'Full Name', icon: 'person' },
      { id: 'email', placeholder: 'Email', icon: 'mail', keyboardType: 'email-address' },
      { id: 'phone', placeholder: 'Phone Number', icon: 'call', keyboardType: 'phone-pad' },
      { id: 'cnic', placeholder: 'CNIC (35201-1234567-8)', icon: 'card', keyboardType: 'number-pad' },
      { id: 'address', placeholder: 'Current Address', icon: 'home' },
      { id: 'password', placeholder: 'Password', icon: 'lock-closed', secure: true }
    ],
    button: { text: 'Verify Your Identity', color: COLORS.blue },
    switchText: "Already have a provider account? ",
    switchLink: 'Sign In'
  }
};

const ServiceProviderLogin = () => {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const currentForm = isLogin ? formConfig.login : formConfig.signup;

  // Format CNIC with Pakistani style (00000-0000000-0)
  const formatCNIC = (text) => {
    // Remove all non-digits
    const digitsOnly = text.replace(/\D/g, '');
    
    // Apply formatting based on input length
    if (digitsOnly.length <= 5) {
      return digitsOnly;
    } else if (digitsOnly.length <= 12) {
      return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
    } else {
      return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 12)}-${digitsOnly.slice(12, 13)}`;
    }
  };

  // Handle text input changes with validation
  const handleInputChange = (field, value) => {
    let formattedValue = value;
    let error = null;
    
    // Special handling for CNIC
    if (field === 'cnic') {
      formattedValue = formatCNIC(value);
      
      // Validate CNIC format (without dashes for validation)
      const digitsOnly = formattedValue.replace(/\D/g, '');
      if (digitsOnly.length > 0 && digitsOnly.length !== 13) {
        error = 'CNIC must be 13 digits';
      }
    }
    
    // Update form data
    setFormData({ ...formData, [field]: formattedValue });
    
    // Update form errors
    if (error) {
      setFormErrors({ ...formErrors, [field]: error });
    } else if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    currentForm.fields.forEach(field => {
      if (!formData[field.id]?.trim()) {
        errors[field.id] = `${field.placeholder} is required`;
      }
    });
    
    // Validate CNIC format if in signup mode
    if (!isLogin && formData.cnic) {
      const digitsOnly = formData.cnic.replace(/\D/g, '');
      if (digitsOnly.length !== 13) {
        errors.cnic = 'CNIC must be 13 digits';
      }
    }
    
    // Validate service categories
    if (!isLogin && selectedCategories.length === 0) {
      errors.categories = 'Please select at least one service category';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuth = async () => {
    try {
      if (!validateForm()) {
        throw new Error('Please fix the errors in your form');
      }

      if (!checked) {
        throw new Error('Please accept the terms and conditions');
      }

      setIsLoading(true);
      
      // Simulate authentication process
      setTimeout(() => {
        setIsLoading(false);
        if (isLogin) {
          Alert.alert('Success', 'Logged in successfully!', [
            { text: 'OK', onPress: () => console.log('Navigate to provider dashboard') }
          ]);
        } else {
          Alert.alert('Verification Started', 'Your identity verification is in process. We will notify you once completed.', [
            { text: 'OK', onPress: () => setIsLogin(true) }
          ]);
        }
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
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
      setFormErrors({});
      setSelectedCategories([]);
    });
  };

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true })
    ]).start();
  };

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
    
    // Clear category error when selection changes
    if (formErrors.categories && selectedCategories.length > 0) {
      const newErrors = { ...formErrors };
      delete newErrors.categories;
      setFormErrors(newErrors);
    }
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50]
  });
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/homexlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.title}>
        {isLogin ? 'Provider Login' : 'Become a HomeX Provider'}
      </Text>
      
      <Text style={styles.subtitle}>
        {isLogin 
          ? 'Access your provider dashboard' 
          : 'Join our network of verified professionals'}
      </Text>

      <Animated.View style={{ transform: [{ translateX }] }}>
        {currentForm.fields.map((field) => (
          <View key={field.id}>
            <Animated.View style={[
              styles.inputContainer,
              formErrors[field.id] && styles.inputError
            ]}>
              <Ionicons name={field.icon} size={20} color={formErrors[field.id] ? '#E53935' : COLORS.blue} />
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#999"
                secureTextEntry={field.secure}
                keyboardType={field.keyboardType}
                onChangeText={(text) => handleInputChange(field.id, text)}
                value={formData[field.id] || ''}
                maxLength={field.id === 'cnic' ? 15 : undefined} // Limit CNIC length including dashes
              />
            </Animated.View>
            {formErrors[field.id] && (
              <Text style={styles.errorText}>{formErrors[field.id]}</Text>
            )}
          </View>
        ))}
      </Animated.View>

      {!isLogin && (
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Select Your Services:</Text>
          {formErrors.categories && (
            <Text style={styles.errorText}>{formErrors.categories}</Text>
          )}
          
          <View style={styles.serviceCardContainer}>
            {serviceCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.serviceCard,
                  selectedCategories.includes(category.id) && styles.selectedServiceCard
                ]}
                onPress={() => toggleCategory(category.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconContainer,
                  selectedCategories.includes(category.id) && styles.selectedIconContainer
                ]}>
                  <Ionicons 
                    name={category.icon} 
                    size={24} 
                    color={selectedCategories.includes(category.id) ? COLORS.white : COLORS.blue} 
                  />
                </View>
                <Text style={[
                  styles.serviceCardTitle,
                  selectedCategories.includes(category.id) && styles.selectedServiceText
                ]}>
                  {category.label}
                </Text>
                <Text style={[
                  styles.serviceCardDescription,
                  selectedCategories.includes(category.id) && styles.selectedServiceText
                ]}>
                  {category.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
          color={COLORS.blue}
        />
        <Text style={styles.checkboxLabel}>
          {isLogin ? 'I agree to the ' : 'I agree to all '}
          <Text style={styles.link} onPress={() => console.log('Terms of Service')}>
            Terms & Conditions
          </Text>
          {!isLogin && (
            <Text>
              {' '}and <Text style={styles.link} onPress={() => console.log('Provider Policy')}>
                Provider Policies
              </Text>
            </Text>
          )}
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

      <TouchableOpacity onPress={handleSwitch} style={styles.switch}>
        <Text style={styles.switchText}>
          {currentForm.switchText}
          <Text style={styles.link}>{currentForm.switchLink}</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  contentContainer: {
    padding: 25,
    paddingTop: 40,
    paddingBottom: 60
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 25,
    textAlign: 'center',
    opacity: 0.8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#E53935'
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginLeft: 10,
    marginTop: -5,
    marginBottom: 5
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.darkGray,
    fontSize: 16
  },
  categorySection: {
    marginTop: 15,
    marginBottom: 10
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 12
  },
  serviceCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  serviceCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center'
  },
  selectedServiceCard: {
    backgroundColor: COLORS.blue
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  serviceCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 4,
    textAlign: 'center'
  },
  serviceCardDescription: {
    fontSize: 11,
    color: COLORS.darkGray,
    opacity: 0.7,
    textAlign: 'center'
  },
  selectedServiceText: {
    color: COLORS.white
  },
  button: {
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16
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
    fontSize: 14,
    flex: 1
  }
});

export default ServiceProviderLogin;