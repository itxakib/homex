import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './colors';
import DynamicCard from './Dynamiccards';
import { ServiceProviderData } from './serviceproviders_data';
import { useNavigation } from '@react-navigation/native';

// Extended color palette based on the given colors
const EXTENDED_COLORS = {
  ...COLORS,
  // Additional colors
  lightGray: '#F5F7FA',
  mediumBlue: '#4DA3FF',
  darkBlue: '#0056B3',
  accentGreen: '#28CC9E',
  softWhite: '#F8FBFF'
};

const Messages = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleChatPress = (user) => {
    navigation.navigate('chat_screen', { user });
    console.log(user, 'user'); // Pass chat user or chatId
  };
  
  // Render time since last message
  const renderTimeAgo = (index) => {
    const times = ['2m ago', '15m ago', '1h ago', 'Yesterday', '2d ago', '5d ago'];
    return times[index % times.length];
  };
  
  // Generate a random unread count (just for UI design purposes)
  const getUnreadCount = (index) => {
    const counts = [0, 0, 2, 0, 5, 0, 1];
    return counts[index % counts.length];
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[EXTENDED_COLORS.blue, EXTENDED_COLORS.mediumBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Messages</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={EXTENDED_COLORS.darkGray} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search conversations..."
              placeholderTextColor={EXTENDED_COLORS.darkGray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="options-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      {/* Main Content */}
      <View style={styles.container}>
        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Recent Chats</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        
        {/* Messages Categories */}
        <View style={styles.categories}>
          <TouchableOpacity style={[styles.categoryTab, styles.activeCategory]}>
            <Text style={styles.activeCategoryText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryText}>Providers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryText}>Support</Text>
          </TouchableOpacity>
        </View>
        
        {/* Chat List */}
        <FlatList
          data={ServiceProviderData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const unreadCount = getUnreadCount(index);
            return (
              <TouchableOpacity 
                activeOpacity={0.9} 
                style={[
                  styles.chatCard,
                  unreadCount > 0 && styles.unreadChatCard
                ]} 
                onPress={() => handleChatPress(item)}
              >
                <View style={styles.avatarContainer}>
                  <Image 
                    source={item.image || { uri: 'https://randomuser.me/api/portraits/men/' + (Math.floor(Math.random() * 50) + 1) + '.jpg' }}
                    style={styles.avatar} 
                  />
                  {/* Online indicator */}
                  {index % 3 === 0 && <View style={styles.onlineIndicator} />}
                </View>
                
                <View style={styles.chatInfo}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>{renderTimeAgo(index)}</Text>
                  </View>
                  
                  <View style={styles.chatPreview}>
                    <Text style={[
                      styles.previewText,
                      unreadCount > 0 && styles.unreadText
                    ]} numberOfLines={1}>
                      Hello! I'm available for your {item.category.toLowerCase()} service request.
                    </Text>
                    
                    {unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: EXTENDED_COLORS.softWhite,
  },
  header: {
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: EXTENDED_COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: EXTENDED_COLORS.darkGray,
  },
  filterBtn: {
    padding: 8,
    backgroundColor: EXTENDED_COLORS.blue,
    borderRadius: 15,
  },
  container: {
    flex: 1,
    backgroundColor: EXTENDED_COLORS.softWhite,
    marginTop: -15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: EXTENDED_COLORS.darkGray,
  },
  seeAll: {
    color: EXTENDED_COLORS.blue,
    fontWeight: '600',
    fontSize: 14,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategory: {
    backgroundColor: EXTENDED_COLORS.blue,
  },
  categoryText: {
    color: EXTENDED_COLORS.darkGray,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  chatList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: EXTENDED_COLORS.darkGray,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  unreadChatCard: {
    backgroundColor: COLORS.lightBlue, // Very light blue
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.lightBlue,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: EXTENDED_COLORS.accentGreen,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    color: EXTENDED_COLORS.darkGray,
  },
  chatTime: {
    fontSize: 12,
    color: EXTENDED_COLORS.darkGray,
    opacity: 0.6,
  },
  chatPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewText: {
    flex: 1,
    fontSize: 14,
    color: EXTENDED_COLORS.darkGray,
    opacity: 0.8,
  },
  unreadText: {
    fontWeight: '600',
    opacity: 1,
  },
  unreadBadge: {
    backgroundColor: EXTENDED_COLORS.blue,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadCount: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
});

export default Messages;