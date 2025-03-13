export interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface TriviaApiQuestion {
    category: string;
    type: 'multiple' | 'boolean';
    difficulty: 'easy' | 'meduim' | 'hard';
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}