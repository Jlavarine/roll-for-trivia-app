import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { getDateKey } from '../utils/date';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '../types/trivia';

type Props = StackScreenProps<RootStackParamList, 'Answers'>;

export default function AnswersScreen({ navigation }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useState(() => {
    const loadQuestions = async () => {
      const dateKey = `trivia-${getDateKey()}`;
      const storedQuestions = await AsyncStorage.getItem(dateKey);
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      }
    };
    loadQuestions();
  });

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex >= 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Answers</Text>
      {questions.length > 0 ? (
        <View style={styles.resultsBox}>
          <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
          <Text style={styles.correctAnswerText}>Correct Answer: {questions[currentQuestionIndex].correctAnswer}</Text>
          <View style={styles.btnContainer}>
            {currentQuestionIndex >= 1 && (
                <TouchableOpacity onPress={previousQuestion} style={styles.btn}>
                <Text style={styles.btnText}>Previous</Text>
                </TouchableOpacity>
            )}
            {currentQuestionIndex < questions.length - 1 && (
            <TouchableOpacity onPress={nextQuestion} style={styles.btn}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          )}
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>No answers available.</Text>
      )}
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
  resultsBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 600,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 20,
    color: '#1e3c72',
    marginBottom: 10,
    textAlign: 'center',
  },
  correctAnswerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
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
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10
},
});