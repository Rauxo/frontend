import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/client';
import { Ionicons } from '@expo/vector-icons';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;

export default function AIChatScreen() {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/chat');
      if (res.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        Toast.show({ type: 'info', text1: 'History', text2: 'No chat history found.' });
      }
    } catch (error) {
      console.error('Failed to fetch chat history', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not fetch history.' });
    }
  };

  const clearChat = async () => {
    if (messages.length === 0) return;
    try {
      await apiClient.delete('/chat');
      setMessages([]);
      Toast.show({ type: 'success', text1: 'Chat cleared', text2: 'You can start a new conversation now.' });
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to clear chat.' });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const res = await apiClient.post('/chat', { message: input });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <LinearGradient colors={['#F4F1DE', '#FDFBF7']} style={StyleSheet.absoluteFillObject} />

      {/* Local Action Bar for Chat */}
      <View style={styles.chatActionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={fetchHistory}>
          <Ionicons name="time-outline" size={20} color="#3D4035" />
          <Text style={styles.actionButtonText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={clearChat}>
          <Ionicons name="add-circle-outline" size={20} color="#8A9A86" />
          <Text style={[styles.actionButtonText, { color: '#8A9A86', fontWeight: 'bold' }]}>New Chat</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={[styles.chatContent, messages.length === 0 && styles.emptyChatContent]}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.iconContainer}>
              <Ionicons name="leaf" size={48} color="#8A9A86" />
            </View>
            <Text style={styles.emptyStateTitle}>Your Safe Space</Text>
            <Text style={styles.emptyStateText}>
              I'm here to listen, support you, and help you navigate your feelings without judgment. What's on your mind today?
            </Text>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View key={index} style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.messageText,
                msg.role === 'user' ? styles.userText : styles.aiText
              ]}>{msg.content}</Text>
            </View>
          ))
        )}

        {isTyping && (
          <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
            <ActivityIndicator size="small" color="#8A9A86" style={{ marginRight: 8 }} />
            <Text style={styles.typingText}>Typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Share your thoughts..."
          placeholderTextColor="#A0A498"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} onPress={sendMessage} disabled={!input.trim()}>
          <LinearGradient colors={['#A3B18A', '#8F9B77']} style={styles.sendButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 2 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 120 : 100, // Pad for global navbar
    paddingBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#8A9A86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#3D4035',
    marginLeft: 6,
    fontWeight: '500',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyChatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBE9D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D4035',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7C7F72',
    textAlign: 'center',
    lineHeight: 24,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: '#8A9A86',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    shadowColor: '#8A9A86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E8E5D3',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: '#7C7F72',
    fontSize: 14,
    fontStyle: 'italic',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#4A5043',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 95 : 75, // Avoid tab bar overlapping input
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#E8E5D3',
    alignItems: 'flex-end',
  },
  clearButton: {
    padding: 10,
    marginRight: 4,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 120,
    fontSize: 16,
    color: '#3D4035',
    borderWidth: 1,
    borderColor: '#E8E5D3',
  },
  sendButton: {
    marginLeft: 12,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8A9A86',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  }
});
