import { api } from './api';
import type { Flashcard } from './types';

export const flashcardService = {
  async list(documentId: number) {
    const { data } = await api.get<Flashcard[]>(`/flashcards/${documentId}`);
    return data;
  },
  async review(payload: { flashcard_id: number; quality: number; response_time_seconds?: number }) {
    const { data } = await api.post('/flashcards/review', payload);
    return data;
  }
};
