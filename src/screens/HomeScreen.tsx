import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { getDateKey } from '../utils/date';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        setUsername(storedUser);
      } else {
        navigation.replace('Login');
      }

      const dateKey = getDateKey();
      const storedLeaderboard = await AsyncStorage.getItem('leaderboard');
      const leaderboard = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
      const hasPlayed = leaderboard.some((entry: Entry) => entry.name === storedUser && entry.date === dateKey);
      setHasPlayedToday(hasPlayed);
    };
    loadCurrentUser();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setUsername('');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To:</Text>
      <Text style={styles.title}>Roll for Trivia 🎲</Text>
      <Text style={styles.title1}>A daily trivia game!</Text>
      <Text style={styles.title1}>Questions change daily, so come back and try again tomorrow!</Text>
      
      {username ? (
        <Text style={styles.usernameText}>Logged in as: {username}</Text>
      ) : (
        <Text style={styles.usernameText}>Loading...</Text>
      )}

      <TouchableOpacity 
        onPress={() => navigation.navigate('Trivia')} 
        style={[styles.btn, hasPlayedToday && styles.disabledBtn]} 
        disabled={hasPlayedToday}
      >
        <Text style={styles.btnText}>{hasPlayedToday ? "Try Again Tomorrow" : "Start Today’s Trivia"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')} style={styles.leaderboardBtn}>
        <Text style={styles.btnText}>View Leaderboard</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.btnText}>Logout</Text>
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
  title1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  usernameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'gold',
    textAlign: 'center',
    marginBottom: 20,
  },
  btn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  disabledBtn: {
    backgroundColor: '#777',
  },
  leaderboardBtn: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  logoutBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#d9534f',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});