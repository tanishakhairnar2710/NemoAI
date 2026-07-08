import { api } from './api';
import type { Flashcard } from './types';

export const reviewService = {
  async due() {
    const { data } = await api.get<Flashcard[]>('/review');
    return data;
  },
  async update(payload: { flashcard_id: number; quality: number; response_time_seconds?: number }) {
    const { data } = await api.post('/review/update', payload);
    return data;
  }
};
