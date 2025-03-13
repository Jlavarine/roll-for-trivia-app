import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { getDateKey } from '../utils/date';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [playerName, setPlayerName] = useState('');
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkExistingPlayer = async () => {
      if (hasChecked) return;

      const dateKey = getDateKey();
      const storedPlayerName = await AsyncStorage.getItem('playerName');
      const storedLeaderboard = await AsyncStorage.getItem('leaderboard');
      const leaderboard = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
      const hasBeenRedirected = await AsyncStorage.getItem(`hasBeenRedirected-${dateKey}`);

      const hasPlayedToday = leaderboard.some(
        (entry: { name: string; date: string }) => entry.name === storedPlayerName && entry.date === dateKey
      );

      if (hasPlayedToday && !hasBeenRedirected) {
        Alert.alert('You have already played today!', 'Redirecting to the leaderboard.');
        await AsyncStorage.setItem(`hasBeenRedirected-${dateKey}`, 'true');
        navigation.replace('Leaderboard');
        return;
      }

      setHasChecked(true);
    };

    checkExistingPlayer();
  }, [navigation]);

  const startTrivia = async () => {
    if (!playerName.trim()) {
      Alert.alert('Please enter your name to start!');
      return;
    }

    const dateKey = getDateKey();
    const storedLeaderboard = await AsyncStorage.getItem('leaderboard');
    const leaderboard = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];

    const hasPlayedToday = leaderboard.some(
      (entry: { name: string; date: string }) => entry.name === playerName && entry.date === dateKey
    );

    if (hasPlayedToday) {
      Alert.alert('This name has already been used today!', 'Please use a different name or check the leaderboard.');
      return;
    }

    await AsyncStorage.setItem('playerName', playerName);
    await AsyncStorage.setItem(`hasBeenRedirected-${dateKey}`, 'false');
    navigation.navigate('Trivia');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roll for Trivia 🎲</Text>
      <Text style={styles.label}>Your Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={playerName}
        onChangeText={setPlayerName}
      />

      <TouchableOpacity onPress={startTrivia} style={styles.btn}>
        <Text style={styles.btnText}>Start Today’s Trivia</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')} style={styles.leaderboardBtn}>
        <Text style={styles.btnText}>View Leaderboard</Text>
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
  label: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
  },
  input: {
    marginTop: 10,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: 'white',
    width: 250,
    textAlign: 'center',
  },
  btn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  leaderboardBtn: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});