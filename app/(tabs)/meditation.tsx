import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import apiClient from '../../api/client';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: '1', title: 'Stress Relief', duration: 300, displayDuration: '5 min', colors: ['#a18cd1', '#fbc2eb'] },
  { id: '2', title: 'Anxiety Relief', duration: 600, displayDuration: '10 min', colors: ['#84fab0', '#8fd3f4'] },
  { id: '3', title: 'Focus', duration: 900, displayDuration: '15 min', colors: ['#fccb90', '#d57eeb'] },
  { id: '4', title: 'Quick Calm', duration: 180, displayDuration: '3 min', colors: ['#e0c3fc', '#8ec5fc'] },
  { id: '5', title: 'Sleep Relax', duration: 1200, displayDuration: '20 min', colors: ['#4facfe', '#00f2fe'] },
];

export default function MeditationScreen() {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession && timeLeft > 0 && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (activeSession && timeLeft === 0) {
      handleCompleteSession();
    }
    return () => clearInterval(interval);
  }, [activeSession, timeLeft, isPaused]);

  const startMeditation = (cat: any) => {
    setActiveSession(cat);
    setTimeLeft(cat.duration);
    setIsPaused(false);
  };

  const handleCompleteSession = async () => {
    const sessionToSave = activeSession;
    setActiveSession(null);
    Toast.show({ type: 'success', text1: 'Namaste 🙏', text2: `You completed your ${sessionToSave.title} session.` });

    try {
      await apiClient.post('/meditation', {
        category: sessionToSave.title,
        duration: sessionToSave.duration,
        completed: true
      });
    } catch (error) {
      console.error('Could not save session', error);
    }
  };

  const cancelSession = () => {
    setActiveSession(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={StyleSheet.absoluteFillObject} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Breathe & Meditate</Text>
          <Text style={styles.subtitle}>Take a moment to reconnect with yourself.</Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.cardContainer}
              onPress={() => startMeditation(cat)}
            >
              <LinearGradient colors={cat.colors as [string, string]} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{cat.title}</Text>
                  <Text style={styles.cardDuration}>{cat.displayDuration}</Text>
                </View>
                <View style={styles.playCircle}>
                  <Ionicons name="play" size={20} color={cat.colors[0]} style={{ marginLeft: 3 }} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Timer Modal */}
      <Modal visible={!!activeSession} animationType="slide" transparent={false}>
        <LinearGradient
          colors={activeSession ? activeSession.colors : ['#fff', '#eee']}
          style={styles.modalContainer}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={cancelSession} style={styles.closeButton}>
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.timerContent}>
              <Text style={styles.timerSessionTitle}>{activeSession?.title}</Text>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.breathePrompt}>
                {timeLeft % 8 < 4 ? 'Breathe In...' : 'Breathe Out...'}
              </Text>
            </View>

            <View style={styles.timerControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setIsPaused(!isPaused)}
              >
                <Ionicons name={isPaused ? "play" : "pause"} size={40} color="#333" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F1DE',
  },
  container: {
    padding: 20,
    paddingTop: 80,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  grid: {
    gap: 16,
  },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  cardDuration: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  playCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    padding: 20,
    alignItems: 'flex-start',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
  },
  timerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerSessionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 80,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 40,
    fontVariant: ['tabular-nums'],
  },
  breathePrompt: {
    fontSize: 28,
    fontWeight: '400',
    color: '#fff',
    opacity: 0.8,
  },
  timerControls: {
    padding: 40,
    paddingBottom: 80,
    alignItems: 'center',
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  }
});
