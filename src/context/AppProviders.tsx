import React from 'react';
import { AuthProvider } from './AuthContext';
import { DocumentProvider } from './DocumentContext';
import { FlashcardProvider } from './FlashcardContext';
import { QuizProvider } from './QuizContext';
import { ThemeProvider } from './ThemeContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DocumentProvider>
          <FlashcardProvider>
            <QuizProvider>{children}</QuizProvider>
          </FlashcardProvider>
        </DocumentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
