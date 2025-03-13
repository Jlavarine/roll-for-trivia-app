import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { getDateKey } from '../utils/date';

interface LeaderboardEntry {
  name: string;
  date: string;
  score: number;
}

type Props = StackScreenProps<RootStackParamList, 'Leaderboard'>;

export default function LeaderboardScreen({ navigation }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const dateKey = getDateKey();
      const storedLeaderboard = await AsyncStorage.getItem('leaderboard');
      let parsedLeaderboard: LeaderboardEntry[] = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];

      parsedLeaderboard = parsedLeaderboard.filter(entry => entry.date === dateKey);
      parsedLeaderboard.sort((a, b) => b.score - a.score);
      setLeaderboard(parsedLeaderboard);
    };

    loadLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Leaderboard</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.leaderboardItem}>{item.name} - {item.score} / 10</Text>
        )}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.btn}>
        <Text style={styles.btnText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3c72',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  leaderboardItem: {
    backgroundColor: 'white',
    color: '#1e3c72',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginVertical: 5,
    width: '80%',
    maxWidth: 400,
  },
  btn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});
