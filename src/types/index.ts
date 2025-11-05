export interface Card {
  id: string;
  front: string;
  back: string;
  imageUrl?: string;
  learned?: boolean;
  createdAt: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  category: string;
  cards: Card[];
  cardCount: number;
  createdAt: number;
  updatedAt: number;
  isFeatured?: boolean;
}

export interface UserProgress {
  deckId: string;
  cardsLearned: string[]; // array of card IDs
  lastStudied: number;
  totalStudySessions: number;
}

export interface StudySession {
  deckId: string;
  startTime: number;
  endTime?: number;
  cardsStudied: string[];
  cardsLearned: string[];
}

export type Category = 'animals' | 'colors' | 'alphabet' | 'numbers' | 'shapes' | 'other';
