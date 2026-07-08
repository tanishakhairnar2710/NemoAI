import { api } from './api';
import type { Analytics } from './types';

export const analyticsService = {
  async get() {
    const { data } = await api.get<Analytics>('/analytics');
    return data;
  }
};
