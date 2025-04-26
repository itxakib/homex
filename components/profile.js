import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './colors';
import Cnic_Verification from './serviceprovider/auth/cnic_verifciation';

const Profile = ({navigation}) => {
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  const menuItems = [
    { icon: 'verified-user', title: 'Verification Status', status: isVerified ? 'Verified' : 'Pending' },
    { icon: 'event', title: 'My Bookings' },
    { icon: 'credit-card', title: 'Payment Methods' },
    { icon: 'group', title: 'Referral Program' },
    { icon: 'translate', title: 'Language Settings' },
    { icon: 'support', title: 'Help & Support' },
    { icon: 'policy', title: 'Privacy Policy' },
    { icon: 'description', title: 'Terms & Conditions' },
  ];

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={[COLORS.blue, '#4DA3FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          
          {/* Profile Info Section */}
          <View style={styles.profileHeader}>
            <Image
              source={require('../assets/tutor.png')}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Muhammad Aqib</Text>
              <TouchableOpacity style={styles.verifyBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#28CC9E" />
                <Text style={styles.verifyText}>Verified Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Service Provider Section */}
        {!isServiceProvider && (
          <TouchableOpacity 
            style={styles.providerCard}
            onPress={() => {setIsServiceProvider(true)
              navigation.navigate('cnic_verifciation')
            }
            }
          >
            <LinearGradient
              colors={['#4DA3FF', COLORS.blue]}
              style={styles.providerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="work-outline" size={28} color="white" />
              <View style={styles.providerText}>
                <Text style={styles.providerTitle}>Become a Service Provider</Text>
                <Text style={styles.providerSubtitle}>Start earning with your skills</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.menuItem}
              onPress={() => console.log(item.title)}
            >
              <View style={styles.menuIcon}>
                <MaterialIcons name={item.icon} size={24} color={COLORS.blue} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.status && <Text style={styles.menuStatus}>{item.status}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  header: {
    paddingTop: StatusBar.currentHeight + 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 25,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 25,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  verifyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  verifyText: {
    color: '#28CC9E',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },
  providerCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  providerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  providerText: {
    flex: 1,
    marginHorizontal: 15,
  },
  providerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  providerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  menuIcon: {
    backgroundColor: '#E8F3FF',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  menuStatus: {
    fontSize: 12,
    color: '#28CC9E',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default Profile;