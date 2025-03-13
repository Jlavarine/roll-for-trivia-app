import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import TriviaScreen from './screens/TriviaScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import AnswersScreen from './screens/AnswersScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './types/navigation'; 

const Stack = createStackNavigator<RootStackParamList>();


export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Trivia" component={TriviaScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Answers" component={AnswersScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
