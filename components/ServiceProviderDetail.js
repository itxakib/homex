import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Dimensions,
  FlatList,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';

const { width } = Dimensions.get('window');

// Enhanced color palette with gradients and modern aesthetics
const COLORS = {
  primary: '#667eea',
  primaryDark: '#764ba2',
  secondary: '#f093fb',
  secondaryLight: '#f5f7ff',
  background: '#f8faff',
  surface: '#ffffff',
  text: '#2d3748',
  textSecondary: '#718096',
  accent: '#ffd89b',
  accentDark: '#19547b',
  success: '#48bb78',
  warning: '#ed8936',
  error: '#f56565',
  border: '#e2e8f0',
  shadow: 'rgba(0,0,0,0.1)',
  white: '#ffffff',
  disabled: '#a0aec0',
  overlay: 'rgba(0,0,0,0.5)'
};

const ServiceProviderDetail = ({ route }) => {
  const { provider } = route.params;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('about');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showCustomPriceModal, setShowCustomPriceModal] = useState(false);
  const [customPrice, setCustomPrice] = useState('');
  const [priceOfferNote, setPriceOfferNote] = useState('');
  const [useCustomPrice, setUseCustomPrice] = useState(false);


  // Enhanced provider image with fallback
  const providerImage = provider.image || { 
    uri: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face`
  };

  // Enhanced time slots with availability
  const timeSlots = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '01:00 PM', available: true },
    { id: '5', time: '02:00 PM', available: true },
    { id: '6', time: '03:00 PM', available: true },
    { id: '7', time: '04:00 PM', available: false },
    { id: '8', time: '05:00 PM', available: true },
  ];

  // Enhanced service options with better pricing structure
  const basePrice = parseFloat(provider.price?.replace('Rs', '') || '50');
  const serviceOptions = [
    { 
      id: '1', 
      title: 'Basic Service', 
      price: basePrice,
      originalPrice: basePrice + 10,
      duration: '1 hour',
      description: 'Standard service with essential features',
      popular: false,
      features: ['Basic consultation', 'Standard tools', 'Clean-up included']
    },
    { 
      id: '2', 
      title: 'Premium Service', 
      price: basePrice * 1.6,
      originalPrice: basePrice * 1.8,
      duration: '2 hours',
      description: 'Comprehensive service with premium features',
      popular: true,
      features: ['Extended consultation', 'Premium tools', 'Deep clean-up', 'Follow-up support']
    },
    { 
      id: '3', 
      title: 'Emergency Service', 
      price: basePrice * 2.2,
      originalPrice: basePrice * 2.5,
      duration: '1 hour',
      description: 'Urgent service with immediate response',
      popular: false,
      features: ['Immediate response', 'Priority scheduling', 'Emergency tools', '24/7 support']
    }
  ];

  // Enhanced reviews with more realistic data
  const reviews = [
    {
      id: '1',
      name: 'Ahmed Cheema',
      rating: 5.0,
      date: '2 days ago',
      comment: 'Outstanding service! Very professional, arrived on time, and exceeded my expectations. Would definitely hire again.',
      avatar: { uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face' },
      verified: true
    },
    {
      id: '2',
      name: 'Zohaib Rashid',
      rating: 4.8,
      date: '5 days ago',
      comment: 'Great work quality and attention to detail. Communication was excellent throughout the process.',
      avatar: { uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
      verified: true
    },
    {
      id: '3',
      name: 'Sara ',
      rating: 5.0,
      date: '1 week ago',
      comment: 'Highly knowledgeable professional. Solved the problem efficiently and provided helpful tips for maintenance.',
      avatar: { uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
      verified: true
    }
  ];

  // Date handling
  const onDateChange = (date) => {
    setShowDatePicker(false);
    setSelectedDate(date || new Date());
  };

  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Calculate total with custom price option
  const calculateTotal = () => {
    if (!selectedService) return 0;
    if (useCustomPrice && customPrice) {
      return parseFloat(customPrice);
    }
    return selectedService.price;
  };

  // Handle custom price submission
  const handleCustomPriceSubmit = () => {
    if (!customPrice || parseFloat(customPrice) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price amount.');
      return;
    }
    setUseCustomPrice(true);
    setShowCustomPriceModal(false);
    Alert.alert(
      'Price Offer Submitted', 
      `Your offer of Rs ${customPrice} has been sent to ${provider.name}. You'll be notified when they respond.`
    );
  };

  // Enhanced header component
  const renderHeader = () => (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{provider.name}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialCommunityIcons name="share-variant" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  // Enhanced about tab
  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>About Professional</Text>
      <View style={styles.card}>
        <Text style={styles.sectionText}>
          {provider.name} is a highly skilled {provider.category.toLowerCase()} professional with {provider.experience} of hands-on experience. 
          Specializing in both residential and commercial projects, they are committed to delivering exceptional quality and customer satisfaction.
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>150+</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24h</Text>
            <Text style={styles.statLabel}>Avg Response</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Specializations</Text>
      <View style={styles.tagsContainer}>
        {['Residential', 'Commercial', 'Emergency Repairs', 'Maintenance', 'Installation', 'Consultation'].map((tag, index) => (
          <View key={index} style={styles.enhancedTag}>
            <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.success} />
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Availability</Text>
      <View style={styles.card}>
        <View style={styles.workHourRow}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.primary} />
          <View style={styles.workHourContent}>
            <Text style={styles.workHourDay}>Monday - Friday</Text>
            <Text style={styles.workHourTime}>8:00 AM - 6:00 PM</Text>
          </View>
        </View>
        <View style={styles.workHourRow}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.primary} />
          <View style={styles.workHourContent}>
            <Text style={styles.workHourDay}>Saturday</Text>
            <Text style={styles.workHourTime}>10:00 AM - 4:00 PM</Text>
          </View>
        </View>
        <View style={styles.workHourRow}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.textSecondary} />
          <View style={styles.workHourContent}>
            <Text style={[styles.workHourDay, { color: COLORS.textSecondary }]}>Sunday</Text>
            <Text style={[styles.workHourTime, { color: COLORS.textSecondary }]}>Emergency Only</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Reviews</Text>
      {reviews.slice(0, 2).map(review => (
        <View key={review.id} style={styles.enhancedReviewCard}>
          <View style={styles.reviewHeader}>
            <Image source={review.avatar} style={styles.reviewAvatar} />
            <View style={styles.reviewInfo}>
              <View style={styles.reviewNameRow}>
                <Text style={styles.reviewName}>{review.name}</Text>
                {review.verified && (
                  <MaterialCommunityIcons name="check-decagram" size={16} color={COLORS.primary} />
                )}
              </View>
              <View style={styles.reviewMeta}>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <MaterialCommunityIcons 
                      key={star} 
                      name={star <= Math.floor(review.rating) ? "star" : "star-outline"} 
                      size={14} 
                      color={COLORS.accent} 
                    />
                  ))}
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );

  // Enhanced book tab
  const renderBookTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Choose Your Service</Text>
      {serviceOptions.map(service => (
        <TouchableOpacity
          key={service.id}
          style={[
            styles.enhancedServiceCard, 
            selectedService?.id === service.id && styles.selectedServiceCard,
            service.popular && styles.popularService
          ]}
          onPress={() => setSelectedService(service)}
        >
          {service.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>MOST POPULAR</Text>
            </View>
          )}
          
          <View style={styles.serviceHeader}>
            <Text style={[styles.serviceTitle, selectedService?.id === service.id && styles.selectedText]}>
              {service.title}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={[styles.originalPrice, selectedService?.id === service.id && styles.selectedText]}>
                Rs {service.originalPrice}
              </Text>
              <Text style={[styles.servicePrice, selectedService?.id === service.id && styles.selectedPriceText]}>
                Rs {service.price}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.serviceDescription, selectedService?.id === service.id && styles.selectedText]}>
            {service.description}
          </Text>
          
          <View style={styles.serviceMeta}>
            <View style={styles.durationBadge}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.primary} />
              <Text style={styles.durationText}>{service.duration}</Text>
            </View>
          </View>
          
          <View style={styles.featuresContainer}>
            {service.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialCommunityIcons 
                  name="check" 
                  size={14} 
                  color={selectedService?.id === service.id ? COLORS.white : COLORS.success} 
                />
                <Text style={[styles.featureText, selectedService?.id === service.id && styles.selectedText]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      ))}

      {/* Custom Price Offer Section */}
      <View style={styles.customPriceSection}>
        <View style={styles.customPriceHeader}>
          <MaterialCommunityIcons name="tag-outline" size={24} color={COLORS.primary} />
          <Text style={styles.customPriceTitle}>Have a Different Budget?</Text>
        </View>
        <Text style={styles.customPriceDescription}>
          Make your own price offer and negotiate directly with the professional
        </Text>
        <TouchableOpacity
          style={styles.customPriceButton}
          onPress={() => setShowCustomPriceModal(true)}
        >
          <Text style={styles.customPriceButtonText}>Rs</Text>
          <Text style={styles.customPriceButtonText}>Make Price Offer</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Select Date</Text>
      <TouchableOpacity style={styles.enhancedDatePicker} onPress={() => setShowDatePicker(true)}>
        <View style={styles.datePickerContent}>
          <MaterialCommunityIcons name="calendar-month" size={24} color={COLORS.primary} />
          <View>
            <Text style={styles.dateLabel}>Preferred Date</Text>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>
      
      <DatePicker
        date={selectedDate}
        onDateChange={onDateChange}
        mode="date"
        minimumDate={new Date()}
        modal
        open={showDatePicker}
        onConfirm={(date) => onDateChange(date)}
        onCancel={() => setShowDatePicker(false)}
      />

      <Text style={styles.sectionTitle}>Available Time Slots</Text>
      <View style={styles.enhancedTimeSlots}>
        {timeSlots.map(slot => (
          <TouchableOpacity
            key={slot.id}
            style={[
              styles.enhancedTimeSlot, 
              selectedTimeSlot === slot.id && styles.selectedTimeSlot,
              !slot.available && styles.unavailableTimeSlot
            ]}
            onPress={() => slot.available && setSelectedTimeSlot(slot.id)}
            disabled={!slot.available}
          >
            <Text style={[
              styles.timeSlotText, 
              selectedTimeSlot === slot.id && styles.selectedTimeSlotText,
              !slot.available && styles.unavailableTimeSlotText
            ]}>
              {slot.time}
            </Text>
            {!slot.available && (
              <Text style={styles.unavailableLabel}>Busy</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Booking Summary</Text>
      <View style={styles.enhancedSummaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service</Text>
          <Text style={styles.summaryValue}>
            {selectedService?.title || 'Select a service'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date & Time</Text>
          <Text style={styles.summaryValue}>
            {formatDate(selectedDate)} • {selectedTimeSlot ? timeSlots.find(slot => slot.id === selectedTimeSlot).time : 'Select time'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Professional</Text>
          <Text style={styles.summaryValue}>{provider.name}</Text>
        </View>
        {useCustomPrice && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Your Offer</Text>
            <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
              Rs{customPrice} (Pending approval)
            </Text>
          </View>
        )}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Total Amount</Text>
          <Text style={styles.summaryTotalValue}>
            Rs {calculateTotal().toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  // Custom Price Modal
  const renderCustomPriceModal = () => (
    <Modal
      visible={showCustomPriceModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCustomPriceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Make Your Price Offer</Text>
            <TouchableOpacity onPress={() => setShowCustomPriceModal(false)}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalDescription}>
            Suggest your budget for this service. The professional will review and respond to your offer.
          </Text>
          
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceInputLabel}>Your Offer (Rs)</Text>
            <TextInput
              style={styles.priceInput}
              value={customPrice}
              onChangeText={setCustomPrice}
              placeholder="Enter amount"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          
          <View style={styles.noteInputContainer}>
            <Text style={styles.noteInputLabel}>Additional Note (Optional)</Text>
            <TextInput
              style={styles.noteInput}
              value={priceOfferNote}
              onChangeText={setPriceOfferNote}
              placeholder="Add any specific requirements or details..."
              multiline={true}
              numberOfLines={3}
              maxLength={200}
            />
            <Text style={styles.characterCount}>{priceOfferNote.length}/200</Text>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowCustomPriceModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleCustomPriceSubmit}
            >
              <Text style={styles.modalSubmitText}>Send Offer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Reviews tab (enhanced)
  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.enhancedRatingSummary}>
        <View style={styles.ratingLeft}>
          <Text style={styles.ratingNumber}>{provider.rating}</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(star => (
              <MaterialCommunityIcons 
                key={star} 
                name={star <= Math.floor(provider.rating) ? "star" : "star-outline"} 
                size={20} 
                color={COLORS.accent} 
              />
            ))}
          </View>
          <Text style={styles.ratingCount}>Based on 127 reviews</Text>
        </View>
        <View style={styles.ratingRight}>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingBarLabel}>5★</Text>
            <View style={styles.ratingBarTrack}>
              <View style={[styles.ratingBarFill, { width: '85%' }]} />
            </View>
            <Text style={styles.ratingBarCount}>108</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingBarLabel}>4★</Text>
            <View style={styles.ratingBarTrack}>
              <View style={[styles.ratingBarFill, { width: '10%' }]} />
            </View>
            <Text style={styles.ratingBarCount}>12</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingBarLabel}>3★</Text>
            <View style={styles.ratingBarTrack}>
              <View style={[styles.ratingBarFill, { width: '4%' }]} />
            </View>
            <Text style={styles.ratingBarCount}>5</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingBarLabel}>2★</Text>
            <View style={styles.ratingBarTrack}>
              <View style={[styles.ratingBarFill, { width: '1%' }]} />
            </View>
            <Text style={styles.ratingBarCount}>2</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingBarLabel}>1★</Text>
            <View style={styles.ratingBarTrack}>
              <View style={[styles.ratingBarFill, { width: '0%' }]} />
            </View>
            <Text style={styles.ratingBarCount}>0</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.enhancedReviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={item.avatar} style={styles.reviewAvatar} />
              <View style={styles.reviewInfo}>
                <View style={styles.reviewNameRow}>
                  <Text style={styles.reviewName}>{item.name}</Text>
                  {item.verified && (
                    <MaterialCommunityIcons name="check-decagram" size={16} color={COLORS.primary} />
                  )}
                </View>
                <View style={styles.reviewMeta}>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <MaterialCommunityIcons 
                        key={star} 
                        name={star <= Math.floor(item.rating) ? "star" : "star-outline"} 
                        size={14} 
                        color={COLORS.accent} 
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {renderHeader()}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Hero Section */}
        <View style={styles.enhancedHero}>
          <Image source={providerImage} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroTop}>
              <TouchableOpacity style={styles.favoriteButton}>
                <MaterialCommunityIcons name="heart-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.heroBottom}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <View style={styles.heroMeta}>
                <View style={styles.ratingBadge}>
                  <MaterialCommunityIcons name="star" size={16} color={COLORS.accent} />
                  <Text style={styles.ratingText}>{provider.rating}</Text>
                </View>
                <Text style={styles.category}>{provider.category}</Text>
              </View>
              <View style={styles.badges}>
                <View style={styles.badge}>
                  <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.white} />
                  <Text style={styles.badgeText}>Verified Pro</Text>
                </View>
                <View style={styles.badge}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.white} />
                  <Text style={styles.badgeText}>{provider.experience}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Enhanced Tabs */}
        <View style={styles.enhancedTabs}>
          {[
            { key: 'about', label: 'About', icon: 'information-outline' },
            { key: 'reviews', label: 'Reviews', icon: 'star-outline' },
            { key: 'book', label: 'Book Now', icon: 'calendar-check' }
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.enhancedTab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <MaterialCommunityIcons 
                name={tab.icon} 
                size={18} 
                color={activeTab === tab.key ? COLORS.white : COLORS.textSecondary} 
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'about' && renderAboutTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
        {activeTab === 'book' && renderBookTab()}
      </ScrollView>

      {/* Enhanced Footer */}
      <LinearGradient
        colors={[COLORS.background, COLORS.white]}
        style={styles.footer}
      >
        <View style={styles.footerContent}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>
              {useCustomPrice ? 'Your Offer' : 'Starting from'}
            </Text>
            <Text style={styles.priceText}>
              Rs {calculateTotal().toFixed(2)}
              {useCustomPrice && <Text style={styles.pendingText}> (Pending)</Text>}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.enhancedBookButton, 
              (!selectedService || !selectedTimeSlot) && styles.disabledButton
            ]}
            disabled={!selectedService || !selectedTimeSlot}
            onPress={() => {
              Alert.alert(
                'Booking Confirmed!', 
                `Your ${useCustomPrice ? 'price offer' : 'booking'} has been ${useCustomPrice ? 'sent to' : 'confirmed with'} ${provider.name}.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            }}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.buttonGradient}
            >
              <MaterialCommunityIcons name="calendar-check" size={20} color={COLORS.white} />
              <Text style={styles.bookButtonText}>
                {useCustomPrice ? 'Send Offer' : 'Confirm Booking'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {renderCustomPriceModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  scrollContent: { 
    paddingBottom: 120 
  },

  // Enhanced Header
  header: { 
    paddingTop: StatusBar.currentHeight + 8, 
    paddingBottom: 16,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20 
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: COLORS.white,
    letterSpacing: 0.5
  },

  // Enhanced Hero Section
  enhancedHero: { 
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12
  },
  heroImage: { 
    width: '100%', 
    height: 280,
    resizeMode: 'cover'
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150
  },
  heroContent: { 
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20
  },
  heroTop: {
    alignItems: 'flex-end'
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroBottom: {
    alignItems: 'flex-start'
  },
  providerName: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: COLORS.white,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  heroMeta: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  ratingBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    borderRadius: 20, 
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12 
  },
  ratingText: { 
    color: COLORS.text, 
    fontSize: 14, 
    fontWeight: '600',
    marginLeft: 4 
  },
  category: { 
    fontSize: 16, 
    color: COLORS.white,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  badges: { 
    flexDirection: 'row',
    gap: 8
  },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 20, 
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  badgeText: { 
    color: COLORS.white, 
    fontSize: 12, 
    fontWeight: '600',
    marginLeft: 6 
  },

  // Enhanced Tabs
  enhancedTabs: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 6, 
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 8
  },
  enhancedTab: { 
    flex: 1, 
    paddingVertical: 12, 
    paddingHorizontal: 8,
    alignItems: 'center', 
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6
  },
  activeTab: { 
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  tabText: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    fontWeight: '600' 
  },
  activeTabText: { 
    color: COLORS.white, 
    fontWeight: '700' 
  },

  // Content Styles
  tabContent: { 
    padding: 20 
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: COLORS.text, 
    marginBottom: 16, 
    marginTop: 8 
  },
  sectionText: { 
    fontSize: 16, 
    color: COLORS.textSecondary, 
    lineHeight: 26,
    fontWeight: '400'
  },

  // Enhanced Cards
  card: { 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 20, 
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6
  },

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border
  },

  // Enhanced Tags
  tagsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 20,
    gap: 8
  },
  enhancedTag: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight, 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.primary + '20'
  },
  tagText: { 
    color: COLORS.text, 
    fontSize: 14, 
    fontWeight: '500',
    marginLeft: 6
  },

  // Work Hours
  workHourRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40'
  },
  workHourContent: {
    marginLeft: 12,
    flex: 1
  },
  workHourDay: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2
  },
  workHourTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },

  // Enhanced Reviews
  enhancedReviewCard: { 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16, 
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  reviewHeader: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 12 
  },
  reviewAvatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    marginRight: 16 
  },
  reviewInfo: {
    flex: 1
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  reviewName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: COLORS.text 
  },
  reviewMeta: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 8
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2
  },
  reviewDate: { 
    fontSize: 12, 
    color: COLORS.textSecondary, 
    fontWeight: '500'
  },
  reviewComment: { 
    fontSize: 15, 
    color: COLORS.text, 
    lineHeight: 22,
    fontWeight: '400'
  },

  // Enhanced Rating Summary
  enhancedRatingSummary: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6
  },
  ratingLeft: {
    alignItems: 'center',
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    minWidth: 120
  },
  ratingNumber: { 
    fontSize: 40, 
    fontWeight: '800', 
    color: COLORS.text,
    marginBottom: 8
  },
  stars: { 
    flexDirection: 'row', 
    marginBottom: 8,
    gap: 2
  },
  ratingCount: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    fontWeight: '500',
    textAlign: 'center'
  },
  ratingRight: {
    flex: 1,
    paddingLeft: 20
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  ratingBarLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 20,
    fontWeight: '500'
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginHorizontal: 8
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3
  },
  ratingBarCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 25,
    textAlign: 'right',
    fontWeight: '500'
  },

  // Enhanced Service Cards
  enhancedServiceCard: { 
    backgroundColor: COLORS.white,
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16, 
    borderWidth: 2, 
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    position: 'relative'
  },
  selectedServiceCard: { 
    borderColor: COLORS.primary, 
    backgroundColor: COLORS.primary,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3
  },
  popularService: {
    borderColor: COLORS.accent,
    borderWidth: 2
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 4
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  serviceTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: COLORS.text,
    flex: 1
  },
  priceContainer: {
    alignItems: 'flex-end'
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
    fontWeight: '500',
    marginBottom: 2
  },
  servicePrice: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: COLORS.primary 
  },
  selectedText: { 
    color: COLORS.white 
  },
  selectedPriceText: {
    color: COLORS.white
  },
  serviceDescription: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    marginBottom: 12,
    lineHeight: 20
  },
  serviceMeta: {
    marginBottom: 12
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  durationText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4
  },
  featuresContainer: {
    gap: 8
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },

  // Custom Price Section
  customPriceSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary + '20',
    borderStyle: 'dashed'
  },
  customPriceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  customPriceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 12
  },
  customPriceDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16
  },
  customPriceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8
  },
  customPriceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white
  },

  // Enhanced Date Picker
  enhancedDatePicker: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 20, 
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginLeft: 16,
    marginBottom: 2
  },
  dateText: { 
    fontSize: 16, 
    color: COLORS.text, 
    fontWeight: '600',
    marginLeft: 16
  },

  // Enhanced Time Slots
  enhancedTimeSlots: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12,
    marginBottom: 20 
  },
  enhancedTimeSlot: { 
    width: (width - 64) / 3,
    backgroundColor: COLORS.white, 
    borderRadius: 12, 
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: COLORS.border,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  selectedTimeSlot: { 
    backgroundColor: COLORS.primary, 
    borderColor: COLORS.primary,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3
  },
  unavailableTimeSlot: {
    backgroundColor: COLORS.border + '40',
    borderColor: COLORS.border
  },
  timeSlotText: { 
    fontSize: 14, 
    color: COLORS.text, 
    fontWeight: '600' 
  },
  selectedTimeSlotText: { 
    color: COLORS.white 
  },
  unavailableTimeSlotText: {
    color: COLORS.textSecondary
  },
  unavailableLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2
  },

  // Enhanced Summary
  enhancedSummaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary + '20'
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12
  },
  summaryLabel: { 
    fontSize: 15, 
    color: COLORS.textSecondary, 
    fontWeight: '500',
    flex: 1
  },
  summaryValue: { 
    fontSize: 15, 
    color: COLORS.text, 
    fontWeight: '600',
    flex: 2,
    textAlign: 'right'
  },
  summaryDivider: { 
    height: 1, 
    backgroundColor: COLORS.border, 
    marginVertical: 8 
  },
  summaryTotalLabel: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '700'
  },
  summaryTotalValue: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '800'
  },

  // Custom Price Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 20
  },
  priceInputContainer: {
    marginBottom: 20
  },
  priceInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8
  },
  priceInput: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    backgroundColor: COLORS.background
  },
  noteInputContainer: {
    marginBottom: 24
  },
  noteInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8
  },
  noteInput: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    textAlignVertical: 'top',
    minHeight: 80
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  modalSubmitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center'
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white
  },

  // Enhanced Footer
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1, 
    borderTopColor: COLORS.border + '60'
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  priceInfo: {
    flex: 1
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text
  },
  pendingText: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600'
  },
  enhancedBookButton: { 
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  disabledButton: { 
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8
  },
  bookButtonText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: COLORS.white 
  }
});

export default ServiceProviderDetail;