import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkExistingUser = async () => {
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        navigation.replace('Home');
      }
    };
    checkExistingUser();
  }, [navigation]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    const storedUsers = JSON.parse(await AsyncStorage.getItem('users') || '{}');

    if (storedUsers[username]) {
      if (storedUsers[username] !== password) {
        Alert.alert('Error', 'Incorrect password. Please try again.');
        return;
      }
      Alert.alert('Success', `Welcome back, ${username}!`);
    } else {
      storedUsers[username] = password;
      await AsyncStorage.setItem('users', JSON.stringify(storedUsers));
      Alert.alert('Success', `Account created for ${username}!`);
    }

    await AsyncStorage.setItem('currentUser', username);
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Roll for Trivia 🎲</Text>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.btn}>
        <Text style={styles.btnText}>Login / Create Account</Text>
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