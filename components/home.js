import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  ScrollView,
  StatusBar,
  Image,
  Animated
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DynamicCoursel from './dynamiccoursel';
import { ServiceProviderData } from './serviceproviders_data';
import DynamicCard from './Dynamiccards';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const numColumns = width < 375 ? 3 : 4;

// Extended color palette based on the given colors
const COLORS = {
  blue: '#007BFF',
  lightBlue: '#D7EAFD',
  darkGray: '#4A4A4A',
  yellow: '#FFE680',
  white: '#FFFFFF',
  // Additional colors
  lightGray: '#F5F7FA',
  mediumBlue: '#4DA3FF',
  darkBlue: '#0056B3',
  accentYellow: '#FFCC00',
  accentGreen: '#28CC9E',
  accentOrange: '#FF9966',
  accentPurple: '#9966FF',
  accentPink: '#FF6699'
};

// Category icon colors
const categoryColors = [
  COLORS.blue,
  COLORS.accentGreen,
  COLORS.accentOrange,
  COLORS.accentPurple,
  COLORS.accentPink,
  COLORS.darkBlue,
  COLORS.accentYellow,
  COLORS.accentGreen,
  COLORS.accentPurple,
  COLORS.accentOrange
];

const Home = ({navigation}) => {
  const [selectedService, setSelectedService] = useState('Electrician');
  const [scrollY] = useState(new Animated.Value(0));
  const [userdata,setuserdata]=useState();
  const [activeIndex, setActiveIndex] = useState(0);
const getdata=useSelector((state)=>state.users);
  console.log(getdata,'data for home page redux data')
  
  useEffect(() => {
    
    if (getdata) {
      setuserdata(getdata);
    }
  },[]);



  
  // Updated categories with vibrant colors
  const categories = [
    { id: '1', name: 'Cleaning', icon: 'broom', color: COLORS.accentGreen },
    { id: '2', name: 'Repairs', icon: 'tools', color: COLORS.accentOrange },
    { id: '3', name: 'Painting', icon: 'brush', color: COLORS.accentPurple },
    { id: '4', name: 'Plumbing', icon: 'pipe', color: COLORS.blue },
    { id: '5', name: 'Electrical', icon: 'lightning-bolt', color: COLORS.accentYellow },
    { id: '6', name: 'Carpentry', icon: 'hammer', color: COLORS.accentPink },
    { id: '7', name: 'AC Repair', icon: 'snowflake', color: COLORS.mediumBlue },
    { id: '8', name: 'Gardening', icon: 'flower', color: COLORS.accentGreen },
    { id: '9', name: 'Laundry', icon: 'washing-machine', color: COLORS.accentPurple },
    { id: '10', name: 'Pest Control', icon: 'bug', color: COLORS.accentOrange }
  ];

  // Popular services tags
  const popularServices = ['Plumbing', 'Electrician', 'Carpenter', 'AC Repair', 'Painting', 'Cleaning'];

  // Enhanced carousel data
  const carouselData = [
    { 
      id: '1', 
      percentage: '40% OFF', 
      text: 'Get a discount for your next service order!', 
      subtext: 'Limited time offer - Book now!',
      gradientColors: [COLORS.blue, COLORS.mediumBlue]
    },
    { 
      id: '2', 
      percentage: '30% OFF', 
      text: 'Special member discount!', 
      subtext: 'Premium services at exclusive prices',
      gradientColors: [COLORS.accentPurple, '#7747CC']
    },
    { 
      id: '3', 
      percentage: '25% OFF', 
      text: 'Weekend Special!', 
      subtext: 'Book any service this weekend',
      gradientColors: [COLORS.accentGreen, '#1A9978']
    },
  ];

  // Filter providers for selected service
  const filteredProviders = ServiceProviderData.filter(
    provider => provider.category === selectedService
  );

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    // Auto-cycle through popular services every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % popularServices.length;
        setSelectedService(popularServices[newIndex]);
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Custom carousel component with enhanced styling
  const EnhancedCarousel = ({ data }) => {
    return (
      <View style={styles.carouselContainer}>
        <FlatList
          horizontal
          pagingEnabled
          data={data}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <LinearGradient
              colors={item.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.carouselItem, { width: width - 40 }]}
            >
              <View style={styles.carouselContent}>
                <View style={styles.carouselLeft}>
                  <Text style={styles.discountText}>{item.percentage}</Text>
                  <Text style={styles.carouselTitle}>{item.text}</Text>
                  <Text style={styles.carouselSubtitle}>{item.subtext}</Text>
                  <TouchableOpacity style={styles.bookNowButton}>
                    <Text style={styles.bookNowText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.carouselImageContainer}>
                  {/* Placeholder for an image (in real app, replace with an actual image) */}
                  <View style={styles.carouselImagePlaceholder}>
                    <MaterialCommunityIcons name="tools" size={40} color={COLORS.white} />
                  </View>
                </View>
              </View>
            </LinearGradient>
          )}
          keyExtractor={item => item.id}
          onScroll={({ nativeEvent }) => {
            const slideIndex = Math.floor(nativeEvent.contentOffset.x / (width - 40));
            setActiveIndex(slideIndex);
          }}
        />
        
        {/* Custom Pagination */}
        <View style={styles.pagination}>
          {carouselData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                activeIndex === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Animated Header */}
      <Animated.View style={[
        styles.header, 
        { 
          height: headerHeight,
          opacity: headerOpacity
        }
      ]}>
        <LinearGradient
          colors={[COLORS.white, COLORS.lightBlue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.greeting}>{userdata?.name || "Guest"}</Text>
              </View>
              <View style={styles.headerRightButtons}>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.darkGray} />
                  <View style={styles.notificationBadge} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.avatarContainer}>
                <Image 
  source={{ 
    uri: userdata?.photo 
      ? userdata.photo 
      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfVuGdiPJQRi4thppytG_8zWv9UgS0MCvgiQ&s' 
  }} 
  style={styles.avatar}
/>

                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.searchBar}>
              <MaterialCommunityIcons name="magnify" size={22} color={COLORS.darkGray} />
              <Text style={styles.searchText}>What service do you need?</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Special Offers Carousel */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <EnhancedCarousel data={carouselData} />
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoryGridContainer}>
            {categories.slice(0, 8).map((item, index) => (
              <TouchableOpacity key={item.id} style={styles.categoryCard}
               onPress={() => navigation.navigate('CategoryScreen', { 
    category:item
  })}
              >
                <View style={[styles.categoryIconContainer, { backgroundColor: `${item.color}20` }]}>
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={32} 
                    color={item.color} 
                  />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Services Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Clickable Service Tags */}
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {popularServices.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.serviceTag,
                  selectedService === item && styles.selectedServiceTag
                ]}
                onPress={() => {
                  setSelectedService(item);
                  setActiveIndex(index);
                }}
              >
                <Text style={[
                  styles.tagText,
                  selectedService === item && styles.selectedTagText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Enhanced Service Providers List */}
          {filteredProviders.length > 0 ? (
            <View style={styles.providersContainer}>
              {filteredProviders.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.providerCard}
                  onPress={() => navigation.navigate('ServiceProviderDetail', { provider: item })}
                  activeOpacity={0.8}
                >
                  <View style={styles.providerImageContainer}>
                    <Image 
                      source={item.image || { uri: 'https://randomuser.me/api/portraits/men/' + (Math.floor(Math.random() * 50) + 1) + '.jpg' }}
                      style={styles.providerImage}
                    />
                    <View style={styles.verifiedBadge}>
                      <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.accentGreen} />
                    </View>
                  </View>

                  <View style={styles.providerDetails}>
                    <View style={styles.providerHeader}>
                      <Text style={styles.providerName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.ratingContainer}>
                        <MaterialCommunityIcons name="star" size={14} color={COLORS.accentYellow} />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                    </View>

                    <Text style={styles.providerCategory} numberOfLines={1}>{item.category}</Text>
                    <Text style={styles.providerExperience} numberOfLines={1}>{item.experience} experience</Text>
                    
                    <View style={styles.providerFooter}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Starting from</Text>
                        <Text style={styles.providerPrice}>{item.price}</Text>
                      </View>
                      <TouchableOpacity style={styles.bookButton} onPress={()=>navigation.navigate('ServiceProviderDetail',{provider:item})}>
                        <Text style={styles.bookButtonText}>Book</Text>
                        <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="alert-circle-outline" size={48} color={COLORS.blue} />
              <Text style={styles.emptyText}>No providers found for this service</Text>
              <TouchableOpacity style={styles.refreshButton}>
                <Text style={styles.refreshButtonText}>Explore Other Services</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};


export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollContainer: {
    paddingTop: 200, // Match header height
    paddingBottom: 30,
  },
  // Header Styles
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 5,
  },
  headerGradient: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.darkGray,
    opacity: 0.8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    top: 8,
    right: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
  },
  searchText: {
    marginLeft: 10,
    color: COLORS.darkGray,
    opacity: 0.7,
    fontSize: 16,
  },
  
  // Section Styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  seeAll: {
    color: COLORS.blue,
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Enhanced Carousel Styles
  carouselContainer: {
    marginBottom: 10,
  },
  carouselItem: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
    elevation: 5,
  },
  carouselContent: {
    flexDirection: 'row',
    padding: 20,
    height: '100%',
  },
  carouselLeft: {
    flex: 3,
    justifyContent: 'space-between',
  },
  discountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  carouselTitle: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  carouselSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  bookNowButton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  bookNowText: {
    color: COLORS.blue,
    fontWeight: '600',
    fontSize: 14,
  },
  carouselImageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lightBlue,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 16,
    backgroundColor: COLORS.blue,
  },
  
  // Categories Grid Styles
  categoryGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 64) / 4,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 4,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
  },
  categoryName: {
    color: COLORS.darkGray,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 12,
  },
  
  // Service Tags Styles
  tagsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceTag: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    elevation: 2,
  },
  selectedServiceTag: {
    backgroundColor: COLORS.blue,
  },
  tagText: {
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  selectedTagText: {
    color: COLORS.white,
  },
  
  // Enhanced Provider Card Styles
  providersContainer: {
    paddingHorizontal: 20,
  },
  providerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 140, // Ensures consistent height
  },
  providerImageContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  providerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: COLORS.lightBlue,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 2,
    elevation: 2,
  },
  providerDetails: {
    flex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '600',
    color: COLORS.darkGray,
    fontSize: 12,
  },
  providerCategory: {
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  providerExperience: {
    color: COLORS.darkGray,
    opacity: 0.7,
    fontSize: 13,
    marginBottom: 12,
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Pushes to bottom
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.darkGray,
    opacity: 0.7,
    marginBottom: 2,
  },
  providerPrice: {
    fontWeight: 'bold',
    color: COLORS.blue,
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  bookButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  
  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  refreshButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});