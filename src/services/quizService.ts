import { api } from './api';
import type { QuizQuestion } from './types';

export const quizService = {
  async list(documentId: number) {
    const { data } = await api.get<QuizQuestion[]>(`/quiz/${documentId}`);
    return data;
  },
  async submit(payload: { quiz_id: number; selected_answer: string; response_time_seconds?: number }) {
    const { data } = await api.post<{ is_correct: boolean; correct_answer: string; explanation: string }>('/quiz/submit', payload);
    return data;
  }
};
