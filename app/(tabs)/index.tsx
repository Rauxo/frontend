import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const TIPS = [
  { id: '1', title: '5-4-3-2-1 Grounding', text: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste to stay present.', color: ['#FF9A9E', '#FECFEF'], icon: 'leaf-outline' },
  { id: '2', title: 'Digital Detox', text: 'Try spending the first 30 minutes after waking up without looking at any screens.', color: ['#A18CD1', '#FBC2EB'], icon: 'phone-portrait-outline' },
  { id: '3', title: 'Box Breathing', text: 'Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 4 times to calm your nervous system.', color: ['#84FAB0', '#8FD3F4'], icon: 'water-outline' },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={StyleSheet.absoluteFillObject} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4facfe" />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.subtitle}>Welcome to your safe space</Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.mainActionCard} onPress={() => router.push('/journal')}>
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.gradientCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name="book" size={32} color="#fff" />
              <Text style={styles.mainActionTitle}>Daily Journal</Text>
              <Text style={styles.mainActionSubtitle}>Write your feelings</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainActionCard} onPress={() => router.push('/ai-chat')}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradientCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name="chatbubbles" size={32} color="#fff" />
              <Text style={styles.mainActionTitle}>AI Therapist</Text>
              <Text style={styles.mainActionSubtitle}>Talk it out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Daily Tips & Tricks</Text>

        {TIPS.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <LinearGradient colors={tip.color as [string, string]} style={styles.tipGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.tipHeader}>
                <Ionicons name={tip.icon as any} size={24} color="#fff" />
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </LinearGradient>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
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
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  mainActionCard: {
    width: '48%',
    height: 140,
    borderRadius: 24,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
  },
  mainActionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  mainActionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  tipCard: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipGradient: {
    padding: 20,
    borderRadius: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  tipText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  }
});
