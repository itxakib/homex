import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from './colors';

const Bookings = () => {
  const [selectedSegment, setSelectedSegment] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const bookingsData = [
    {
      id: '1',
      type: 'upcoming',
      service: 'AC Repair',
      provider: 'Raza AC Services',
      date: '2024-03-25',
      time: '10:00 AM',
      status: 'Confirmed',
      price: '₨2500',
      image: require('../assets/plumber.jpg'),
    },
    {
      id: '2',
      type: 'past',
      service: 'Plumbing',
      provider: 'Ahmed Plumbing Co.',
      date: '2024-03-20',
      time: '02:30 PM',
      status: 'Completed',
      price: '₨2000',
      image: require('../assets/event.png'),
    },
  ];

  const filteredBookings = bookingsData.filter(
    booking => booking.type === selectedSegment
  );

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <Image source={item.image} style={styles.providerImage} />

      <View style={styles.bookingDetails}>
        <Text style={styles.serviceName}>{item.service}</Text>
        <Text style={styles.providerName}>{item.provider}</Text>

        <View style={styles.timeContainer}>
          <MaterialIcons name="calendar-today" size={16} color={COLORS.darkGray} />
          <Text style={styles.timeText}>{item.date}</Text>
          <MaterialIcons name="access-time" size={16} color={COLORS.darkGray} style={styles.timeIcon} />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 'Confirmed' ? COLORS.lightBlue : '#E8F5E9',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status === 'Confirmed' ? COLORS.blue : '#43A047',
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>

        {selectedSegment === 'upcoming' ? (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rescheduleButton}>
              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.rateButton}>
            <Text style={styles.rateButtonText}>Rate Service</Text>
            <MaterialIcons name="star-border" size={18} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <View style={{ width: 24 }} /> {/* Spacer */}
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedSegment === 'upcoming' && styles.activeSegment,
            ]}
            onPress={() => setSelectedSegment('upcoming')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSegment === 'upcoming' && styles.activeSegmentText,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedSegment === 'past' && styles.activeSegment,
            ]}
            onPress={() => setSelectedSegment('past')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSegment === 'past' && styles.activeSegmentText,
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bookings List */}
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="assignment" size={48} color={COLORS.lightBlue} />
              <Text style={styles.emptyText}>
                No {selectedSegment} bookings found
              </Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => setRefreshing(false), 1000);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  header: {
    marginTop:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  segmentContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    backgroundColor: COLORS.lightBlue,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeSegment: {
    backgroundColor: COLORS.blue,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
  activeSegmentText: {
    color: COLORS.white,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: COLORS.darkGray,
    opacity: 0.8,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginLeft: 4,
    marginRight: 12,
  },
  timeIcon: {
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blue,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: COLORS.blue,
    fontSize: 12,
    fontWeight: '500',
  },
  rescheduleButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  rescheduleButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  rateButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginTop: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default Bookings;
