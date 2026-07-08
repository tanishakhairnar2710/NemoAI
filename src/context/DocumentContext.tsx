import React, { createContext, useCallback, useMemo, useState } from 'react';
import { errorMessage } from '../services/api';
import { documentService } from '../services/documentService';
import type { Document } from '../services/types';

type DocumentContextValue = {
  documents: Document[];
  loading: boolean;
  error: string | null;
  loadDocuments: () => Promise<Document[]>;
  getDocument: (id: number) => Promise<Document>;
  uploadDocument: (file: File) => Promise<Document>;
  deleteDocument: (id: number) => Promise<void>;
};

export const DocumentContext = createContext<DocumentContextValue | undefined>(undefined);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.list();
      setDocuments(data);
      return data;
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocument = useCallback(async (id: number) => documentService.get(id), []);

  const uploadDocument = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const document = await documentService.upload(file);
      setDocuments((current) => [document, ...current.filter((item) => item.id !== document.id)]);
      return document;
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (id: number) => {
    await documentService.remove(id);
    setDocuments((current) => current.filter((document) => document.id !== id));
  }, []);

  const value = useMemo(
    () => ({ documents, loading, error, loadDocuments, getDocument, uploadDocument, deleteDocument }),
    [documents, loading, error, loadDocuments, getDocument, uploadDocument, deleteDocument]
  );
  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}
