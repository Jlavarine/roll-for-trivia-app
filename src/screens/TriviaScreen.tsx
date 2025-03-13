import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { getDateKey } from '../utils/date';
import { Question, TriviaApiQuestion } from '../types/trivia';

type Props = StackScreenProps<RootStackParamList, 'Trivia'>;

export default function TriviaScreen({ navigation }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrLoadQuestions = async () => {
      const dateKey = `trivia-${getDateKey()}`;
      const cached = await AsyncStorage.getItem(dateKey);

      if (cached) {
        setQuestions(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const data = await response.json();

        const formattedQuestions: Question[] = data.results.map((q: TriviaApiQuestion) => ({
          question: q.question,
          options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          correctAnswer: q.correct_answer,
        }));

        setQuestions(formattedQuestions);
        await AsyncStorage.setItem(dateKey, JSON.stringify(formattedQuestions));
      } catch (error) {
        Alert.alert('Error fetching trivia questions');
      } finally {
        setLoading(false);
      }
    };

    fetchOrLoadQuestions();
  }, []);

  useEffect(() => {
    if (showResults) {
      saveScore(score);
    }
  }, [showResults]);

  const selectAnswer = (option: string) => {
    setSelectedAnswer(option);

    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const saveScore = async (finalScore: number) => {
    const dateKey = `score-${getDateKey()}`;
    await AsyncStorage.setItem(dateKey, finalScore.toString());

    const playerName = (await AsyncStorage.getItem('playerName')) || 'Anonymous';
    const leaderboard = JSON.parse((await AsyncStorage.getItem('leaderboard')) || '[]');

    leaderboard.push({ name: playerName, score: finalScore, date: getDateKey() });
    await AsyncStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4a90e2" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Trivia</Text>
      {!showResults ? (
        <View style={styles.questionBox}>
          <Text style={styles.questionCount}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
          <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => selectAnswer(option)} style={styles.btn}>
              <Text style={styles.btnText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.resultsBox}>
          <Text style={styles.resultTitle}>Your Score</Text>
          <Text style={styles.resultText}>{score} out of {questions.length}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')} style={styles.btn}>
            <Text style={styles.btnText}>See Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Answers')} style={styles.btn}>
            <Text style={styles.btnText}>See Correct Answers</Text>
          </TouchableOpacity>
        </View>
      )}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  questionBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 600,
    alignItems: 'center',
  },
  questionCount: {
    fontSize: 18,
    color: '#1e3c72',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    color: '#1e3c72',
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  resultsBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 600,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    color: '#1e3c72',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 20,
    color: '#1e3c72',
    marginBottom: 20,
  },
});