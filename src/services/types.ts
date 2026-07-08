export type User = {
  id: number;
  email: string;
  full_name: string;
  study_goal?: string | null;
  is_active: boolean;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type Document = {
  id: number;
  title: string;
  filename: string;
  category: string;
  summary: string;
  keywords: string[];
  page_count: number;
  word_count: number;
  created_at: string;
  flashcard_count: number;
  quiz_count: number;
  mnemonic_count: number;
  chunks?: Chunk[];
};

export type Chunk = {
  id: number;
  order_index: number;
  text: string;
  keywords: string[];
};

export type Flashcard = {
  id: number;
  document_id: number;
  topic: string;
  front: string;
  back: string;
  difficulty: string;
  due_at: string;
};

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: number;
  document_id: number;
  question: string;
  options: QuizOption[];
  correct_answer: string;
  explanation: string;
  topic: string;
  difficulty: string;
};

export type Mnemonic = {
  id: number;
  document_id: number;
  topic: string;
  source_terms: string[];
  mnemonic_text: string;
};

export type Analytics = {
  stats: Record<string, number>;
  progress: Array<Record<string, string | number>>;
  subjects: Array<Record<string, string | number>>;
  recent_activity: Array<Record<string, string | number | null>>;
  weak_topics: Array<Record<string, string | number>>;
  strong_topics: Array<Record<string, string | number>>;
  review: { due_count: number; cards: Flashcard[] };
};
