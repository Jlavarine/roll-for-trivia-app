import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [playerName, setPlayerName] = useState('');

  const startTrivia = async () => {
    if (!playerName.trim()) {
      Alert.alert('Please enter your name to start!');
      return;
    }

    await AsyncStorage.setItem('playerName', playerName);
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
  btnText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});
