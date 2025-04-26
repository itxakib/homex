import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './colors';

const chatMessages = [
  { id: '1', text: 'Hey there! How can I help you today?', time: '10:00 AM', sender: 'other', read: true },
  { id: '2', text: 'I need someone to fix my wiring at home.', time: '10:02 AM', sender: 'me', read: true },
  { id: '3', text: 'Sure! Our best electrician is on the way. Any specific issue?', time: '10:03 AM', sender: 'other', read: true },
  { id: '4', text: 'The switches are sparking when turned on.', time: '10:05 AM', sender: 'me', read: false },
];

const MessageBubble = ({ item }) => {
  const isMe = item.sender === 'me';
  return (
    <View style={[styles.bubbleContainer, isMe && styles.myBubbleContainer]}>
      <LinearGradient
        colors={isMe ? [COLORS.blue, '#0066CC'] : [COLORS.white, COLORS.lightBlue]}
        style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
        start={[0, 0]}
        end={[1, 0]}
      >
        <Text style={[styles.msgText, isMe && styles.myText]}>{item.text}</Text>
        <View style={styles.timeContainer}>
          <Text style={[styles.timestamp, isMe && styles.myTimestamp]}>{item.time}</Text>
          {isMe && (
            <Ionicons 
              name={item.read ? "checkmark-done" : "checkmark"} 
              size={14} 
              color={isMe ? COLORS.yellow : COLORS.darkGray} 
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const ChatScreen = ({ navigation, route }) => {
  const [message, setMessage] = useState('');
  const flatListRef = useRef();
  const userName = route.params?.user.name || 'Chat User';

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  const sendMessage = () => {
    if (message.trim()) {
      console.log('Send:', message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.blue, '#0066CC']}
        style={styles.header}
        start={[0, 0]}
        end={[1, 0]}
      >
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Image source={require('../assets/event.png')} style={styles.avatar} />
            <Text style={styles.headerTitle}>{userName}</Text>
          </View>

          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble item={item} />}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <LinearGradient
          colors={[COLORS.white, COLORS.lightBlue]}
          style={styles.inputContainer}
          start={[0, 0]}
          end={[1, 0]}
        >
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color={COLORS.blue} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.inputBox}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.darkGray}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={styles.sendBtn} 
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <LinearGradient
              colors={[COLORS.blue, '#0066CC']}
              style={styles.sendGradient}
              start={[0, 0]}
              end={[1, 0]}
            >
              <Ionicons name="send" size={20} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 45 : 25,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.white,
    marginRight: 12,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  chatList: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  bubbleContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  myBubbleContainer: {
    alignSelf: 'flex-end',
  },
  bubble: {
    padding: 15,
    borderRadius: 20,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  myBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 16,
    color: COLORS.darkGray,
    lineHeight: 22,
  },
  myText: {
    color: COLORS.white,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginRight: 4,
  },
  myTimestamp: {
    color: COLORS.yellow,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.blue,
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  inputBox: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkGray,
    maxHeight: 100,
    paddingVertical: 4,
    marginHorizontal: 10,
  },
  sendBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: COLORS.lightBlue,
  },
});

export default ChatScreen;