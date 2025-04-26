import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DynamicCard from './Dynamiccards'; // Your existing carousel component
import { COLORS } from './colors';
import DynamicCoursel from './dynamiccoursel';
import { TextInput } from 'react-native-paper';

// Mock data - replace with your actual data source
const services = [
  { id: 1, title: 'Electrical Repairs', icon: 'electrical-services', rating: 4.9, price: '50+', category: 'Home Services' ,  color:'yellow' },
  { id: 2, title: 'Plumbing', icon: 'plumbing', rating: 4.8, price: '45+', category: 'Home Services',color:COLORS.lightBlue },
  { id: 3, title: 'AC Maintenance', icon: 'ac-unit', rating: 4.7, price: '60+', category: 'Home Services',color:COLORS.blue },
  { id: 4, title: 'Carpentry', icon: 'carpenter', rating: 4.6, price: '55+', category: 'Home Services',color:'brown' },
];

const topProviders = [
  { id: 1, name: 'Ali Electrician', rating: 4.9, jobs: 120, image: require('../assets/electrican.jpg') },
  { id: 2, name: 'Hassan Plumber', rating: 4.8, jobs: 95, image: require('../assets/electrican.jpg') },
  { id: 3, name: 'Ahmed AC Expert', rating: 4.7, jobs: 200, image: require('../assets/electrican.jpg') },
];

const Service = () => {
  return (
    <View style={styles.container}>
      {/* Hero Section with Carousel */}
      <LinearGradient
        colors={[COLORS.blue, COLORS.lightBlue]}
        style={styles.hero}
        start={[0, 0]}
        end={[1, 0]}
      >
        <Text style={styles.heroTitle}>Find Trusted Services</Text>
        <Text style={styles.heroSubtitle}>Get your home fixed with certified professionals</Text>
        
        <View style={styles.searchBox}>
          <Ionicons name="search" size={24} color={COLORS.darkGray} />
          <TextInput
            placeholder="What service do you need?"
            placeholderTextColor={COLORS.darkGray}
            style={styles.searchInput}
          />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={services}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.categoryCard}>
                <MaterialIcons 
                  name={item.icon} 
                  size={32} 
                  color={item.color}  // Changed from COLORS.blue
                />
                <Text style={styles.categoryTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Featured Services Carousel */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <DynamicCoursel
            data={services}
            renderItem={({ item }) => (
              <DynamicCard 
                item={item}
                style={styles.serviceCard}
                onPress={() => console.log('Service selected:', item.id)}
              />
            )}
          />
        </View>

        {/* Top Service Providers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Rated Providers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={topProviders}
            renderItem={({ item }) => (
              <View style={styles.providerCard}>
                <Image source={item.image} style={styles.providerImage} />
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{item.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color={COLORS.yellow} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                    <Text style={styles.jobsText}>({item.jobs}+ jobs)</Text>
                  </View>
                  <TouchableOpacity style={styles.hireButton}>
                    <Text style={styles.hireButtonText}>Hire Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            {[1, 2, 3].map((step) => (
              <View key={step} style={styles.stepCard}>
                <Text style={styles.stepNumber}>0{step}</Text>
                <Text style={styles.stepTitle}>
                  {step === 1 && 'Choose Service'}
                  {step === 2 && 'Book Provider'}
                  {step === 3 && 'Enjoy Service'}
                </Text>
                <Text style={styles.stepDescription}>
                  {step === 1 && 'Browse through our wide range of services'}
                  {step === 2 && 'Select preferred date and time'}
                  {step === 3 && 'Sit back while we handle everything'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  hero: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 15,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    marginLeft: 10,
    fontSize: 16,
   
  },
  content: {
    paddingVertical: 20,
  },
  section: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  seeAll: {
    color: COLORS.blue,
    fontWeight: '500',
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    width: 120,
    elevation: 2,
  },
  categoryTitle: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.darkGray,  // Ensure this matches home screen
    textAlign: 'center',
  },
  serviceCard: {
    marginHorizontal: 10,
    width: 280,
  },
  providerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginRight: 15,
    width: 250,
    elevation: 3,
    overflow: 'hidden',
  },
  providerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  providerInfo: {
    padding: 15,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    color: COLORS.darkGray,
    marginLeft: 4,
    marginRight: 8,
  },
  jobsText: {
    color: COLORS.darkGray,
    opacity: 0.7,
    fontSize: 12,
  },
  hireButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  hireButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    width: '30%',
    elevation: 2,
  },
  stepNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 12,
    color: COLORS.darkGray,
    opacity: 0.8,
    lineHeight: 16,
  },
});

export default Service;