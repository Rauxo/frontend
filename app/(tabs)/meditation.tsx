import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const CATEGORIES = [
  { id: '1', title: 'Stress Relief', duration: '5 min', color: '#e6e6fa' },
  { id: '2', title: 'Anxiety Relief', duration: '10 min', color: '#f0fff0' },
  { id: '3', title: 'Focus', duration: '15 min', color: '#fff0f5' },
  { id: '4', title: 'Quick Calm', duration: '3 min', color: '#e0ffff' },
  { id: '5', title: 'Sleep Relax', duration: '20 min', color: '#f5f5dc' },
];

export default function MeditationScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Meditation & Breathing</Text>
      <Text style={styles.subtitle}>Take a moment for yourself.</Text>
      
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.id} style={[styles.card, { backgroundColor: cat.color }]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{cat.title}</Text>
              <Text style={styles.cardDuration}>{cat.duration}</Text>
            </View>
            <View style={styles.playButton}>
              <Text style={styles.playText}>▶</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  grid: {
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDuration: {
    fontSize: 14,
    color: '#666',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playText: {
    fontSize: 18,
    color: '#4facfe',
    marginLeft: 3,
  }
});
