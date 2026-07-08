import React, { createContext, useCallback, useMemo, useState } from 'react';
import { flashcardService } from '../services/flashcardService';
import type { Flashcard } from '../services/types';

type FlashcardContextValue = {
  cards: Flashcard[];
  loading: boolean;
  loadFlashcards: (documentId: number) => Promise<Flashcard[]>;
  reviewFlashcard: (flashcardId: number, quality: number, seconds?: number) => Promise<void>;
};

export const FlashcardContext = createContext<FlashcardContextValue | undefined>(undefined);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFlashcards = useCallback(async (documentId: number) => {
    setLoading(true);
    try {
      const data = await flashcardService.list(documentId);
      setCards(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const reviewFlashcard = useCallback(async (flashcardId: number, quality: number, seconds = 0) => {
    await flashcardService.review({ flashcard_id: flashcardId, quality, response_time_seconds: seconds });
    setCards((current) => current.filter((card) => card.id !== flashcardId));
  }, []);

  const value = useMemo(() => ({ cards, loading, loadFlashcards, reviewFlashcard }), [cards, loading, loadFlashcards, reviewFlashcard]);
  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
}
