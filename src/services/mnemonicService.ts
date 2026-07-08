import { api } from './api';
import type { Mnemonic } from './types';

export const mnemonicService = {
  async list(documentId: number) {
    const { data } = await api.get<Mnemonic[]>(`/mnemonics/${documentId}`);
    return data;
  },
  async create(text: string) {
    const { data } = await api.post<Mnemonic>('/mnemonics', { text });
    return data;
  }
};
