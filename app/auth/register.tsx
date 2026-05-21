import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import apiClient from '../../api/client';

import { colors } from '../../theme/colors';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register', { name, email, password });
      dispatch(setCredentials({ user: res.data, token: res.data.token }));
      // Navigation is handled automatically by AuthWrapper in _layout
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.response?.data?.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#FDFBF7' }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appName}>KoYo</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your wellness journey</Text>

        <View style={styles.form}>
          <TextInput 
            style={styles.input} 
            placeholder="Name" 
            placeholderTextColor="#A0A498"
            value={name}
            onChangeText={setName}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor="#A0A498"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor="#A0A498"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.buttonContainer, isLoading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <View style={[styles.gradientButton, { backgroundColor: '#8F9B77' }]}>
              <Text style={styles.buttonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/auth/login')}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkTextBold}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
    borderRadius: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3D4035',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#3D4035',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7C7F72',
    marginBottom: 30,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#8A9A86',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8E5D3',
  },
  input: {
    backgroundColor: '#FDFBF7',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#4A5043',
    borderWidth: 1,
    borderColor: '#E8E5D3',
  },
  buttonContainer: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8A9A86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#7C7F72',
    fontSize: 15,
  },
  linkTextBold: {
    color: '#8A9A86',
    fontWeight: '700',
  }
});
