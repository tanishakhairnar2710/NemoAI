import { api } from './api';
import type { AuthResponse, User } from './types';

export const authService = {
  async signup(payload: { full_name: string; email: string; password: string; study_goal?: string }) {
    const { data } = await api.post<AuthResponse>('/signup', payload);
    return data;
  },
  async login(payload: { email: string; password: string }) {
    const { data } = await api.post<AuthResponse>('/login', payload);
    return data;
  },
  async me() {
    const { data } = await api.get<User>('/me');
    return data;
  }
};
