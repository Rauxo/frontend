import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

export default function JournalScreen() {
  const [entry, setEntry] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Daily Journal</Text>
      <Text style={styles.subtitle}>Write down your thoughts and feelings.</Text>
      
      <View style={styles.editorContainer}>
        <TextInput
          style={styles.editor}
          placeholder="Today I feel..."
          multiline
          textAlignVertical="top"
          value={entry}
          onChangeText={setEntry}
        />
      </View>
      
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  editorContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    minHeight: 300,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  editor: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4facfe',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
