import { api } from './api';
import type { Document } from './types';

export const documentService = {
  async list() {
    const { data } = await api.get<Document[]>('/documents');
    return data;
  },
  async get(id: number) {
    const { data } = await api.get<Document>(`/documents/${id}`);
    return data;
  },
  async upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<Document>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  async remove(id: number) {
    await api.delete(`/documents/${id}`);
  },
  async summary(id: number) {
    const { data } = await api.get<{ document_id: number; summary: string; keywords: string[] }>(`/documents/${id}/summary`);
    return data;
  }
};
