import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import color scheme (same as login screen)
const COLORS = {
  blue: '#007BFF',
  lightBlue: '#D7EAFD',
  darkGray: '#4A4A4A',
  yellow: '#FFE680',
  white: '#FFFFFF',
  green: '#4CAF50',
  red: '#F44336',
  orange: '#FF9800',
  teal: '#009688',
  lightGray: '#F5F5F5',
  mediumGray: '#9E9E9E'
};

const ServiceProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('week');
  const [expandedJob, setExpandedJob] = useState(null);
  
  // Mock data
  const userData = {
    name: 'Ahmed Khan',
    rating: 4.8,
    completedJobs: 47,
    joinDate: 'Aug 2024',
    profileImage: require('../../assets/tutor.png'),
    overallRating: 4.8,
    activeServices: ['Plumbing', 'Maintenance'],
    currentBalance: 28500
  };

  const earningsData = {
    week: [3500, 2000, 0, 4500, 1500, 2500, 0],
    month: [15000, 17500, 22000, 28500],
    year: [45000, 67000, 89000, 105000, 130000, 158000, 180000, 210000, 235000, 260000, 290000, 310000]
  };

  const jobsData = {
    upcoming: [
      {
        id: '1',
        customer: 'Farah Ahmed',
        service: 'Plumbing',
        title: 'Kitchen Sink Repair',
        address: 'House 12, Street 5, F-8/1, Islamabad',
        date: '27 Apr 2025',
        time: '10:00 AM',
        price: 2500,
        status: 'confirmed',
        description: 'Kitchen sink is leaking from the drainage pipe connection. Need to replace the seal and fix the pipe fitting.'
      },
      {
        id: '2',
        customer: 'Ali Hassan',
        service: 'Maintenance',
        title: 'Door Lock Replacement',
        address: 'Flat 304, Al-Rehman Heights, G-11, Islamabad',
        date: '28 Apr 2025',
        time: '2:30 PM',
        price: 1800,
        status: 'pending',
        description: 'Main entrance door lock is not working properly, needs replacement with a new high-security lock.'
      }
    ],
    completed: [
      {
        id: '3',
        customer: 'Sara Khan',
        service: 'Plumbing',
        title: 'Bathroom Shower Installation',
        address: 'House 45, Street 10, E-7, Islamabad',
        date: '25 Apr 2025',
        time: '11:00 AM',
        price: 4500,
        status: 'completed',
        rating: 5,
        feedback: 'Excellent work! Very professional and clean installation.',
        description: 'Replace old shower head and install new rainfall shower system with mixer.'
      },
      {
        id: '4',
        customer: 'Imran Shah',
        service: 'Plumbing',
        title: 'Water Heater Repair',
        address: 'House 78, Street 12, F-10/2, Islamabad',
        date: '24 Apr 2025',
        time: '4:00 PM',
        price: 3000,
        status: 'completed',
        rating: 4,
        feedback: 'Good job. Fixed the issue but was a bit late.',
        description: 'Water heater not heating properly. Need to check the heating element and thermostat.'
      },
      {
        id: '5',
        customer: 'Zainab Malik',
        service: 'Maintenance',
        title: 'Ceiling Fan Installation',
        address: 'Flat 207, Green Towers, F-11, Islamabad',
        date: '23 Apr 2025',
        time: '1:00 PM',
        price: 2000,
        status: 'completed',
        rating: 5,
        feedback: 'Very prompt and efficient service. Thank you!',
        description: 'Install new ceiling fan in the living room with dimmer switch.'
      }
    ]
  };

  const notifications = [
    {
      id: '1',
      title: 'New Job Request',
      message: 'You have a new job request for plumbing service.',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'You received a payment of Rs. 3,500 for your recent job.',
      time: '1 day ago',
      read: true
    },
    {
      id: '3',
      title: 'Rating & Review',
      message: 'Sara Khan gave you a 5-star rating for your service.',
      time: '2 days ago',
      read: true
    }
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getChartData = () => {
    let labels = [];
    let data = [];
    
    switch(timeFilter) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = earningsData.week;
        break;
      case 'month':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = earningsData.month;
        break;
      case 'year':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data = earningsData.year;
        break;
    }
    
    return { labels, data };
  };

  const CustomLineChart = () => {
    const { labels, data } = getChartData();
    const chartWidth = Dimensions.get('window').width - 50;
    const chartHeight = 200; // Reduced height for better proportion
    const maxValue = Math.max(...data, 1000); // Ensure minimum max value to avoid zero division
    const minValue = 0; // Force min to 0 for better scaling
    const valueRange = maxValue - minValue || 1000;

    // Normalize data points, ensuring at least 2 points for line drawing
    const points = data.map((value, index) => {
      const x = data.length > 1 ? (index / (data.length - 1)) * (chartWidth - 40) + 20 : chartWidth / 2;
      const y = chartHeight - 20 - ((value - minValue) / valueRange) * (chartHeight - 40);
      return { x, y, value };
    });

    // Ensure labels are evenly spaced
    const labelPositions = labels.map((_, index) =>
      data.length > 1 ? (index / (labels.length - 1)) * (chartWidth - 40) + 20 : chartWidth / 2
    );

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {/* Background Grid */}
          <View style={styles.grid}>
            {Array.from({ length: 5 }).map((_, index) => (
              <View
                key={index}
                style={[styles.gridLine, { top: (chartHeight - 20) * (index / 4) }]}
              />
            ))}
          </View>

          {/* Lines and Points */}
          {points.map((point, index) => {
            if (index === points.length - 1) return null;
            const nextPoint = points[index + 1];
            return (
              <View key={index}>
                {/* Line */}
                <View
                  style={{
                    position: 'absolute',
                    left: point.x,
                    top: point.y,
                    width: Math.sqrt(
                      Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
                    ),
                    height: 2,
                    backgroundColor: COLORS.blue,
                    transform: [
                      {
                        rotate: `${Math.atan2(
                          nextPoint.y - point.y,
                          nextPoint.x - point.x
                        )}rad`
                      }
                    ]
                  }}
                />
                {/* Point */}
                <View
                  style={{
                    position: 'absolute',
                    left: point.x - 5,
                    top: point.y - 5,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: COLORS.blue,
                    borderWidth: 2,
                    borderColor: COLORS.white
                  }}
                />
              </View>
            );
          })}

          {/* Last Point (if exists) */}
          {points.length > 0 && (
            <View
              style={{
                position: 'absolute',
                left: points[points.length - 1].x - 5,
                top: points[points.length - 1].y - 5,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: COLORS.blue,
                borderWidth: 2,
                borderColor: COLORS.white
              }}
            />
          )}

          {/* X-Axis Labels */}
          <View style={styles.labelsContainer}>
            {labels.map((label, index) => (
              <Text
                key={index}
                style={[
                  styles.labelText,
                  { left: labelPositions[index] - 15 }
                ]}
              >
                {label}
              </Text>
            ))}
          </View>

          {/* Y-Axis Labels */}
          <View style={styles.yAxisLabels}>
            {Array.from({ length: 5 }).map((_, index) => {
              const value = maxValue - (index * valueRange) / 4;
              return (
                <Text
                  key={index}
                  style={[
                    styles.yAxisLabel,
                    { top: (chartHeight - 20) * (index / 4) - 10 }
                  ]}
                >
                  {value >= 1000 ? `${Math.round(value / 1000)}K` : Math.round(value)}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderJobCard = ({ item }) => {
    const isExpanded = expandedJob === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.jobCard, 
          item.status === 'confirmed' ? styles.confirmedJobCard : 
          item.status === 'completed' ? styles.completedJobCard : 
          styles.pendingJobCard
        ]}
        onPress={() => setExpandedJob(isExpanded ? null : item.id)}
      >
        <View style={styles.jobCardHeader}>
          <View style={styles.jobServiceBadge}>
            <Text style={styles.jobServiceText}>{item.service}</Text>
          </View>
          <Text style={styles.jobPrice}>Rs. {item.price}</Text>
        </View>
        
        <Text style={styles.jobTitle}>{item.title}</Text>
        
        <View style={styles.jobInfoRow}>
          <Ionicons name="person" size={16} color={COLORS.darkGray} />
          <Text style={styles.jobInfoText}>{item.customer}</Text>
        </View>
        
        <View style={styles.jobInfoRow}>
          <Ionicons name="calendar" size={16} color={COLORS.darkGray} />
          <Text style={styles.jobInfoText}>{item.date} at {item.time}</Text>
        </View>
        
        <View style={styles.jobInfoRow}>
          <Ionicons name="location" size={16} color={COLORS.darkGray} />
          <Text style={styles.jobInfoText} numberOfLines={isExpanded ? 0 : 1}>{item.address}</Text>
        </View>
        
        {isExpanded && (
          <View style={styles.jobExpandedContent}>
            <Text style={styles.jobSectionTitle}>Description:</Text>
            <Text style={styles.jobDescription}>{item.description}</Text>
            
            {item.status === 'completed' && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.jobSectionTitle}>Customer Feedback:</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Ionicons 
                      key={star}
                      name={star <= item.rating ? "star" : "star-outline"} 
                      size={16} 
                      color={COLORS.yellow} 
                    />
                  ))}
                </View>
                <Text style={styles.feedbackText}>{item.feedback}</Text>
              </View>
            )}
            
            <View style={styles.actionButtonsContainer}>
              {item.status !== 'completed' && (
                <>
                  <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                    <Text style={styles.actionButtonText}>
                      {item.status === 'confirmed' ? 'Start Job' : 'Accept'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                      {item.status === 'confirmed' ? 'Reschedule' : 'Decline'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              
              {item.status === 'completed' && (
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                  <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>View Details</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        
        <View style={styles.expandIconContainer}>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={18} 
            color={COLORS.darkGray} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDashboardTab = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <View style={styles.profileImageContainer}>
            <Image source={userData.profileImage} style={styles.profileImage} />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{userData.activeServices.length}</Text>
            </View>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{userData.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={COLORS.yellow} />
              <Text style={styles.ratingText}>{userData.rating} • {userData.completedJobs} jobs</Text>
            </View>
            <Text style={styles.joinDateText}>Member since {userData.joinDate}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCardContainer}>
        <View style={[styles.statsCard, { backgroundColor: COLORS.blue }]}>
          <Ionicons name="cash-outline" size={28} color={COLORS.white} />
          <Text style={styles.statsAmount}>Rs. {userData.currentBalance}</Text>
          <Text style={styles.statsLabel}>Current Balance</Text>
        </View>
        
        <View style={[styles.statsCard, { backgroundColor: COLORS.teal }]}>
          <Ionicons name="checkmark-circle-outline" size={28} color={COLORS.white} />
          <Text style={styles.statsAmount}>{userData.completedJobs}</Text>
          <Text style={styles.statsLabel}>Completed Jobs</Text>
        </View>
        
        <View style={[styles.statsCard, { backgroundColor: COLORS.orange }]}>
          <Ionicons name="calendar-outline" size={28} color={COLORS.white} />
          <Text style={styles.statsAmount}>{jobsData.upcoming.length}</Text>
          <Text style={styles.statsLabel}>Upcoming Jobs</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity 
              style={[styles.filterOption, timeFilter === 'week' && styles.activeFilterOption]}
              onPress={() => setTimeFilter('week')}
            >
              <Text style={[styles.filterText, timeFilter === 'week' && styles.activeFilterText]}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, timeFilter === 'month' && styles.activeFilterOption]}
              onPress={() => setTimeFilter('month')}
            >
              <Text style={[styles.filterText, timeFilter === 'month' && styles.activeFilterText]}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, timeFilter === 'year' && styles.activeFilterOption]}
              onPress={() => setTimeFilter('year')}
            >
              <Text style={[styles.filterText, timeFilter === 'year' && styles.activeFilterText]}>Year</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <CustomLineChart />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Jobs</Text>
          <TouchableOpacity onPress={() => setActiveTab('jobs')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {jobsData.upcoming.length > 0 ? (
          jobsData.upcoming.slice(0, 2).map(job => (
            <View key={job.id}>
              {renderJobCard({ item: job })}
            </View>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.mediumGray} />
            <Text style={styles.emptyStateText}>No upcoming jobs</Text>
          </View>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Completions</Text>
          <TouchableOpacity onPress={() => setActiveTab('jobs')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {jobsData.completed.length > 0 ? (
          jobsData.completed.slice(0, 2).map(job => (
            <View key={job.id}>
              {renderJobCard({ item: job })}
            </View>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="checkmark-circle-outline" size={48} color={COLORS.mediumGray} />
            <Text style={styles.emptyStateText}>No completed jobs</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderJobsTab = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.jobsTabContainer}>
        <View style={styles.tabButtons}>
          <TouchableOpacity 
            style={[styles.tabButton, styles.activeTabButton]}
            onPress={() => console.log('Upcoming selected')}
          >
            <Text style={[styles.tabButtonText, styles.activeTabButtonText]}>Upcoming ({jobsData.upcoming.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => console.log('Completed selected')}
          >
            <Text style={styles.tabButtonText}>Completed ({jobsData.completed.length})</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.jobListContainer}>
          <Text style={styles.jobListTitle}>Upcoming Jobs</Text>
          
          {jobsData.upcoming.length > 0 ? (
            jobsData.upcoming.map(job => (
              <View key={job.id}>
                {renderJobCard({ item: job })}
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.mediumGray} />
              <Text style={styles.emptyStateText}>No upcoming jobs</Text>
            </View>
          )}
          
          <Text style={styles.jobListTitle}>Completed Jobs</Text>
          
          {jobsData.completed.length > 0 ? (
            jobsData.completed.map(job => (
              <View key={job.id}>
                {renderJobCard({ item: job })}
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="checkmark-circle-outline" size={48} color={COLORS.mediumGray} />
              <Text style={styles.emptyStateText}>No completed jobs</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );

  const renderNotificationsTab = () => (
    <ScrollView
      style={styles.notificationsContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.notificationsTitle}>Notifications</Text>
      
      {notifications.map(notification => (
        <View 
          key={notification.id} 
          style={[
            styles.notificationCard,
            !notification.read && styles.unreadNotification
          ]}
        >
          <View style={styles.notificationIconContainer}>
            <Ionicons 
              name={
                notification.title.includes('Job') ? 'briefcase' :
                notification.title.includes('Payment') ? 'cash' : 'star'
              } 
              size={24} 
              color={COLORS.white} 
              style={styles.notificationIcon}
            />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
          {!notification.read && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderAccountTab = () => (
    <ScrollView
      style={styles.accountContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.accountProfileSection}>
        <Image source={userData.profileImage} style={styles.accountProfileImage} />
        <Text style={styles.accountName}>{userData.name}</Text>
        <View style={styles.accountRatingContainer}>
          <Ionicons name="star" size={18} color={COLORS.yellow} />
          <Text style={styles.accountRatingText}>{userData.rating}</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.accountStatsContainer}>
        <View style={styles.accountStatCard}>
          <Text style={styles.accountStatValue}>{userData.completedJobs}</Text>
          <Text style={styles.accountStatLabel}>Jobs Completed</Text>
        </View>
        <View style={styles.accountStatDivider} />
        <View style={styles.accountStatCard}>
          <Text style={styles.accountStatValue}>Rs. {userData.currentBalance}</Text>
          <Text style={styles.accountStatLabel}>Total Earnings</Text>
        </View>
      </View>
      
      <View style={styles.accountMenuSection}>
        <TouchableOpacity style={styles.accountMenuItem}>
          <Ionicons name="person-outline" size={22} color={COLORS.darkGray} />
          <Text style={styles.accountMenuItemText}>Personal Information</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.mediumGray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountMenuItem}>
          <Ionicons name="construct-outline" size={22} color={COLORS.darkGray} />
          <Text style={styles.accountMenuItemText}>Services & Pricing</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.mediumGray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountMenuItem}>
          <Ionicons name="wallet-outline" size={22} color={COLORS.darkGray} />
          <Text style={styles.accountMenuItemText}>Payments & Banking</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.mediumGray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountMenuItem}>
          <Ionicons name="document-text-outline" size={22} color={COLORS.darkGray} />
          <Text style={styles.accountMenuItemText}>Documents & Certificates</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.mediumGray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountMenuItem}>
          <Ionicons name="settings-outline" size={22} color={COLORS.darkGray} />
          <Text style={styles.accountMenuItemText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.mediumGray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountMenuItem}>
          <Ionicons name="help-circle-outline" size={22} color={COLORS.darkGray} />
          <Text style={styles.accountMenuItemText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.mediumGray} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#E53935" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSelectedTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardTab();
      case 'jobs':
        return renderJobsTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'account':
        return renderAccountTab();
      default:
        return renderDashboardTab();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/homexlogo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Provider Dashboard</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="notifications" size={24} color={COLORS.blue} />
          {notifications.some(n => !n.read) && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {renderSelectedTab()}

      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons 
            name={activeTab === 'dashboard' ? 'home' : 'home-outline'} 
            size={24} 
            color={activeTab === 'dashboard' ? COLORS.blue : COLORS.darkGray} 
          />
          <Text 
            style={[
              styles.navLabel, 
              activeTab === 'dashboard' && styles.activeNavLabel
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('jobs')}
        >
          <Ionicons 
            name={activeTab === 'jobs' ? 'briefcase' : 'briefcase-outline'} 
            size={24} 
            color={activeTab === 'jobs' ? COLORS.blue : COLORS.darkGray} 
          />
          <Text 
            style={[
              styles.navLabel, 
              activeTab === 'jobs' && styles.activeNavLabel
            ]}
          >
            Jobs
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('notifications')}
        >
          <Ionicons 
            name={activeTab === 'notifications' ? 'notifications' : 'notifications-outline'} 
            size={24} 
            color={activeTab === 'notifications' ? COLORS.blue : COLORS.darkGray} 
          />
          <Text 
            style={[
              styles.navLabel, 
              activeTab === 'notifications' && styles.activeNavLabel
            ]}
          >
            Alerts
          </Text>
          {notifications.some(n => !n.read) && <View style={styles.navBadge} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('account')}
        >
          <Ionicons 
            name={activeTab === 'account' ? 'person' : 'person-outline'} 
            size={24} 
            color={activeTab === 'account' ? COLORS.blue : COLORS.darkGray} 
          />
          <Text 
            style={[
              styles.navLabel, 
              activeTab === 'account' && styles.activeNavLabel
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  headerLogo: {
    width: 40,
    height: 40
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray
  },
  headerButton: {
    position: 'relative'
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.red
  },
  profileSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginTop: 20,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  profileImageContainer: {
    position: 'relative'
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    backgroundColor: COLORS.blue,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
  profileDetails: {
    flex: 1
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 5
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 5
  },
  joinDateText: {
    fontSize: 12,
    color: COLORS.mediumGray
  },
  profileButton: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  profileButtonText: {
    color: COLORS.blue,
    fontWeight: '600'
  },
  statsCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 20
  },
  statsCard: {
    width: '31%',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  statsAmount: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 5
  },
  statsLabel: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 15
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray
  },
  seeAllText: {
    color: COLORS.blue,
    fontWeight: '500'
  },
  filterOptions: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    padding: 3
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  activeFilterOption: {
    backgroundColor: COLORS.blue
  },
  filterText: {
    fontSize: 12,
    color: COLORS.darkGray
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: '500'
  },
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  chart: {
    marginVertical: 8,
    borderRadius: 15,
    width: Dimensions.get('window').width - 50,
    height: 200,
    position: 'relative'
  },
  grid: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: COLORS.lightGray,
    opacity: 0.5
  },
  labelsContainer: {
    position: 'absolute',
    bottom: -30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  labelText: {
    position: 'absolute',
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'center',
    width: 50
  },
  yAxisLabels: {
    position: 'absolute',
    left: -40,
    height: '100%'
  },
  yAxisLabel: {
    position: 'absolute',
    fontSize: 12,
    color: COLORS.darkGray
  },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  confirmedJobCard: {
    borderLeftWidth: 5,
    borderLeftColor: COLORS.blue
  },
  pendingJobCard: {
    borderLeftWidth: 5,
    borderLeftColor: COLORS.orange
  },
  completedJobCard: {
    borderLeftWidth: 5,
    borderLeftColor: COLORS.green
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  jobServiceBadge: {
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10
  },
  jobServiceText: {
    color: COLORS.blue,
    fontWeight: '500',
    fontSize: 12
  },
  jobPrice: {
    color: COLORS.darkGray,
    fontWeight: 'bold'
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 10
  },
  jobInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  jobInfoText: {
    marginLeft: 8,
    color: COLORS.darkGray,
    fontSize: 14,
    flex: 1
  },
  expandIconContainer: {
    alignItems: 'center',
    marginTop: 5
  },
  jobExpandedContent: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray
  },
  jobSectionTitle: {
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 5
  },
  jobDescription: {
    color: COLORS.darkGray,
    marginBottom: 15,
    lineHeight: 20
  },
  feedbackContainer: {
    marginBottom: 15
  },
  feedbackText: {
    color: COLORS.darkGray,
    fontStyle: 'italic',
    marginTop: 5
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5
  },
  primaryButton: {
    backgroundColor: COLORS.blue
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.blue
  },
  actionButtonText: {
    fontWeight: '600',
    color: COLORS.white
  },
  secondaryButtonText: {
    color: COLORS.blue
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: 15
  },
  emptyStateText: {
    color: COLORS.mediumGray,
    marginTop: 10,
    fontSize: 16
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 10,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  navLabel: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.darkGray
  },
  activeNavLabel: {
    color: COLORS.blue,
    fontWeight: '500'
  },
  navBadge: {
    position: 'absolute',
    top: 0,
    right: '30%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red
  },
  jobsTabContainer: {
    padding: 15
  },
  tabButtons: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    marginBottom: 20,
    padding: 5
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10
  },
  activeTabButton: {
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  tabButtonText: {
    color: COLORS.mediumGray,
    fontWeight: '500'
  },
  activeTabButtonText: {
    color: COLORS.blue
  },
  jobListContainer: {
    marginTop: 10
  },
  jobListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 15
  },
  notificationsContainer: {
    padding: 15
  },
  notificationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 20
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  unreadNotification: {
    backgroundColor: COLORS.lightBlue
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  notificationContent: {
    flex: 1
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 5
  },
  notificationMessage: {
    color: COLORS.darkGray,
    marginBottom: 8,
    lineHeight: 20
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.mediumGray
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.blue,
    marginLeft: 10
  },
  accountContainer: {
    padding: 15
  },
  accountProfileSection: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  accountProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15
  },
  accountName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 8
  },
  accountRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  accountRatingText: {
    fontSize: 16,
    color: COLORS.darkGray,
    fontWeight: '600',
    marginLeft: 8
  },
  editProfileButton: {
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  editProfileButtonText: {
    color: COLORS.blue,
    fontWeight: '600'
  },
  accountStatsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  accountStatCard: {
    flex: 1,
    alignItems: 'center'
  },
  accountStatDivider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 10
  },
  accountStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginBottom: 5
  },
  accountStatLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center'
  },
  accountMenuSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden'
  },
  accountMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray
  },
  accountMenuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: COLORS.darkGray
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
    elevation: 2,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  logoutButtonText: {
    color: '#E53935',
    fontWeight: '600',
    marginLeft: 10
  }
});

export default ServiceProviderDashboard;