import React, { createContext, useCallback, useMemo, useState } from 'react';
import { quizService } from '../services/quizService';
import type { QuizQuestion } from '../services/types';

type QuizResult = { is_correct: boolean; correct_answer: string; explanation: string };

type QuizContextValue = {
  questions: QuizQuestion[];
  loading: boolean;
  loadQuiz: (documentId: number) => Promise<QuizQuestion[]>;
  submitAnswer: (quizId: number, selectedAnswer: string, seconds?: number) => Promise<QuizResult>;
};

export const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const loadQuiz = useCallback(async (documentId: number) => {
    setLoading(true);
    try {
      const data = await quizService.list(documentId);
      setQuestions(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (quizId: number, selectedAnswer: string, seconds = 0) => {
    return quizService.submit({ quiz_id: quizId, selected_answer: selectedAnswer, response_time_seconds: seconds });
  }, []);

  const value = useMemo(() => ({ questions, loading, loadQuiz, submitAnswer }), [questions, loading, loadQuiz, submitAnswer]);
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
