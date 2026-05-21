import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/client';
import { View as _LGView } from 'react-native';
const LinearGradient = ({style, children, colors}: any) => <_LGView style={[style, colors && colors.length > 0 ? {backgroundColor: colors[0]} : {}]}>{children}</_LGView>;
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JourneyScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchJourney = async () => {
    try {
      const res = await apiClient.get('/journey');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch journey data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJourney();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: '#7C7F72' }}>Analyzing your mental wellness journey...</Text>
      </View>
    );
  }

  const renderEntryList = (title: string, entries: any[], renderItem: (item: any) => JSX.Element) => (
    entries && entries.length > 0 ? (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {entries.map((item, idx) => (
          <View key={idx} style={styles.entryRow}>
            {renderItem(item)}
            <Text style={styles.entryDate}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    ) : null
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#F4F1DE', '#FDFBF7']} style={StyleSheet.absoluteFillObject} />
      
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8A9A86" />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Journey</Text>
          <Text style={styles.subtitle}>AI-driven analysis of your mental condition.</Text>
        </View>

        {data ? (
          <>
            {/* Score Card */}
            <View style={styles.card}>
              <View style={styles.scoreRow}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreText}>{data.score}</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreLabel}>Wellness Score</Text>
                  <Text style={styles.scoreDesc}>
                    {data.score >= 80 ? 'Excellent' : data.score >= 50 ? 'Moderate' : 'Needs Attention'}
                  </Text>
                </View>
              </View>
            </View>



            {/* AI Analysis */}
            <View style={[styles.card, { backgroundColor: '#8A9A86' }]}>
              <View style={styles.aiHeader}>
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={styles.aiTitle}>AI Feedback</Text>
              </View>
              <Text style={styles.aiText}>{data.analysis}</Text>
            </View>

            {/* Suggestions */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Actionable Steps</Text>
              {data.suggestions && data.suggestions.map((suggestion: string, idx: number) => (
                <View key={idx} style={styles.suggestionRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#8A9A86" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>

            {/* Mood entries */}
            {renderEntryList('Recent Moods', data.moods, (item) => (
              <Text style={styles.entryText}>Mood: {item.mood} (Intensity: {item.intensity})</Text>
            ))}

            {/* Journal entries */}
            {renderEntryList('Recent Journals', data.journals, (item) => (
              <Text style={styles.entryText}>{item.content}</Text>
            ))}

            {/* Meditation entries */}
            {renderEntryList('Recent Meditations', data.meditations, (item) => (
              <Text style={styles.entryText}>Category: {item.category}, Duration: {item.duration}s</Text>
            ))}
          </>
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No data available.</Text>
        )}
        
        <View style={{height: 100}} />
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
    paddingTop: 80,
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
  card: {
    backgroundColor: colors.cardBackground,
    padding: 24,
    borderRadius: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBE9D8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#8A9A86',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D4035',
  },
  scoreInfo: {
    marginLeft: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#7C7F72',
    marginBottom: 4,
  },
  scoreDesc: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3D4035',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D4035',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    paddingBottom: 20,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: 24,
    backgroundColor: '#8A9A86',
    borderRadius: 12,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#7C7F72',
    fontWeight: '600',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },
  aiText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    opacity: 0.95,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FDFBF7',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5D3',
  },
  suggestionText: {
    fontSize: 15,
    color: '#4A5043',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  }
});
