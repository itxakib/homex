import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Tesseract from 'tesseract.js';

const Cnic_Verification = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  // Request camera permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const captureImage = async () => {
    if (hasPermission !== true) {
      alert('Camera permission is required to capture the CNIC image.');
      return;
    }

    setLoading(true);
    setVerificationResult(null);

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const photo = result.assets[0];
        setImage(photo.uri);
        await extractText(photo.uri);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      alert('Failed to capture image. Please try again.');
      setLoading(false);
    }
  };

  const extractText = async (uri) => {
    try {
      setLoading(true);
      const { data: { text } } = await Tesseract.recognize(
        uri,
        'eng', // Language: English
        {
          logger: (m) => console.log(m), // Optional: Log progress
        }
      );
      setExtractedText(text);
      verifyCNIC(text);
    } catch (error) {
      console.error('Error extracting text with Tesseract:', error);
      alert('Failed to extract text from image. Please try again.');
      setLoading(false);
    }
  };

  const verifyCNIC = (text) => {
    // CNIC verification logic (Pakistan CNIC format: 12345-1234567-1 or 1234512345671)
    const cnicRegex = /(\d{5}[-]?\d{7}[-]?\d{1})|(\d{13})/;
    const matches = text.match(cnicRegex);

    if (matches) {
      const cnicNumber = matches[0].replace(/-/g, '');
      if (cnicNumber.length === 13) {
        setVerificationResult({ valid: true, number: formatCNIC(cnicNumber) });
      } else {
        setVerificationResult({ valid: false, error: 'Invalid CNIC length' });
      }
    } else {
      setVerificationResult({ valid: false, error: 'CNIC number not found' });
    }
    setLoading(false);
  };

  const formatCNIC = (cnic) => {
    return `${cnic.substring(0, 5)}-${cnic.substring(5, 12)}-${cnic.substring(12)}`;
  };

  // Handle permission or loading states
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Checking camera permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera. Please grant camera permissions in settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CNIC Verification</Text>

      <TouchableOpacity style={styles.button} onPress={captureImage}>
        <Text style={styles.buttonText}>Capture CNIC Image</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {verificationResult && (
        <View style={styles.resultContainer}>
          {verificationResult.valid ? (
            <>
              <Text style={styles.successText}>CNIC Verified Successfully!</Text>
              <Text style={styles.cnicText}>{verificationResult.number}</Text>
            </>
          ) : (
            <Text style={styles.errorText}>
              Verification Failed: {verificationResult.error}
            </Text>
          )}
        </View>
      )}

      {/* For debugging extracted text */}
      {/* <Text style={styles.extractedText}>{extractedText}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    width: '100%',
    alignItems: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cnicText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  extractedText: {
    marginTop: 20,
    color: '#666',
    fontSize: 12,
  },
});

export default Cnic_Verification;