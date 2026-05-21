import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import apiClient from '../../api/client';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function JournalScreen() {
  const [entry, setEntry] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSave = async () => {
    if (!entry.trim()) return;
    setIsSaving(true);
    try {
      await apiClient.post('/journals', { content: entry });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Journal entry saved! AI is analyzing your stress patterns.' });
      setEntry('');
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save entry.' });
    } finally {
      setIsSaving(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // You could fetch previous entries here if you render them
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={StyleSheet.absoluteFillObject} />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4facfe" />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Daily Journal</Text>
          <Text style={styles.subtitle}>Write down your thoughts and feelings.</Text>
        </View>

        <View style={styles.editorContainer}>
          <TextInput
            style={styles.editor}
            placeholder="Today I feel..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            value={entry}
            onChangeText={setEntry}
            editable={!isSaving}
          />
        </View>

        <TouchableOpacity
          style={[styles.buttonContainer, (!entry.trim() || isSaving) && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={!entry.trim() || isSaving}
        >
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.saveButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {isSaving ? (
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons name="pencil" size={20} color="#fff" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Entry'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Empty space for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    paddingTop: 80, // Added padding to clear the transparent navbar
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  editorContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    minHeight: 350,
    padding: 20,
    shadowColor: colors.gradientStart,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  editor: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: '#334155',
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00f2fe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButton: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});
