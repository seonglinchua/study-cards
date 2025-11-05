import { Deck, Card, UserProgress } from '@/types';
import { seedDecks } from './seedData';

const STORAGE_KEYS = {
  DECKS: 'study-cards-decks',
  USER_PROGRESS: 'study-cards-progress',
};

// Helper to safely access localStorage (for SSR compatibility)
function getLocalStorage() {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

// Initialize database with seed data
export async function initializeDatabase() {
  try {
    const storage = getLocalStorage();
    if (!storage) return false;

    const existingDecks = storage.getItem(STORAGE_KEYS.DECKS);

    if (!existingDecks) {
      // Database is empty, seed it
      storage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(seedDecks));
      console.log('Database initialized with seed data');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Get all decks
export async function getAllDecks(): Promise<Deck[]> {
  try {
    const storage = getLocalStorage();
    if (!storage) return [];

    const decksData = storage.getItem(STORAGE_KEYS.DECKS);

    if (decksData) {
      return JSON.parse(decksData);
    }
    return [];
  } catch (error) {
    console.error('Error getting decks:', error);
    throw error;
  }
}

// Get a single deck by ID
export async function getDeckById(deckId: string): Promise<Deck | null> {
  try {
    const decks = await getAllDecks();
    const deck = decks.find(d => d.id === deckId);
    return deck || null;
  } catch (error) {
    console.error('Error getting deck:', error);
    throw error;
  }
}

// Get featured decks
export async function getFeaturedDecks(): Promise<Deck[]> {
  try {
    const decks = await getAllDecks();
    return decks.filter(deck => deck.isFeatured);
  } catch (error) {
    console.error('Error getting featured decks:', error);
    throw error;
  }
}

// Create a new deck
export async function createDeck(deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const storage = getLocalStorage();
    if (!storage) throw new Error('localStorage not available');

    const decks = await getAllDecks();
    const deckId = `deck-${Date.now()}`;

    const newDeck: Deck = {
      ...deck,
      id: deckId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    decks.push(newDeck);
    storage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));

    return deckId;
  } catch (error) {
    console.error('Error creating deck:', error);
    throw error;
  }
}

// Update a deck
export async function updateDeck(deckId: string, updates: Partial<Deck>): Promise<void> {
  try {
    const storage = getLocalStorage();
    if (!storage) throw new Error('localStorage not available');

    const decks = await getAllDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);

    if (deckIndex === -1) throw new Error('Deck not found');

    decks[deckIndex] = {
      ...decks[deckIndex],
      ...updates,
      updatedAt: Date.now(),
    };

    storage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  } catch (error) {
    console.error('Error updating deck:', error);
    throw error;
  }
}

// Delete a deck
export async function deleteDeck(deckId: string): Promise<void> {
  try {
    const storage = getLocalStorage();
    if (!storage) throw new Error('localStorage not available');

    const decks = await getAllDecks();
    const filteredDecks = decks.filter(d => d.id !== deckId);

    storage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(filteredDecks));
  } catch (error) {
    console.error('Error deleting deck:', error);
    throw error;
  }
}

// Add a card to a deck
export async function addCardToDeck(deckId: string, card: Omit<Card, 'id' | 'createdAt'>): Promise<string> {
  try {
    const deck = await getDeckById(deckId);
    if (!deck) throw new Error('Deck not found');

    const newCard: Card = {
      ...card,
      id: `card-${Date.now()}`,
      createdAt: Date.now(),
      learned: false,
    };

    const updatedCards = [...deck.cards, newCard];

    await updateDeck(deckId, {
      cards: updatedCards,
      cardCount: updatedCards.length,
    });

    return newCard.id;
  } catch (error) {
    console.error('Error adding card:', error);
    throw error;
  }
}

// Mark card as learned
export async function markCardAsLearned(deckId: string, cardId: string, learned: boolean): Promise<void> {
  try {
    const deck = await getDeckById(deckId);
    if (!deck) throw new Error('Deck not found');

    const updatedCards = deck.cards.map(card =>
      card.id === cardId ? { ...card, learned } : card
    );

    await updateDeck(deckId, {
      cards: updatedCards,
    });
  } catch (error) {
    console.error('Error marking card:', error);
    throw error;
  }
}

// Get user progress for a deck
export async function getUserProgress(userId: string, deckId: string): Promise<UserProgress | null> {
  try {
    const storage = getLocalStorage();
    if (!storage) return null;

    const progressData = storage.getItem(STORAGE_KEYS.USER_PROGRESS);

    if (progressData) {
      const allProgress = JSON.parse(progressData);
      const userProgress = allProgress[userId]?.[deckId];
      return userProgress || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
}

// Update user progress
export async function updateUserProgress(
  userId: string,
  deckId: string,
  progress: Partial<UserProgress>
): Promise<void> {
  try {
    const storage = getLocalStorage();
    if (!storage) throw new Error('localStorage not available');

    const progressData = storage.getItem(STORAGE_KEYS.USER_PROGRESS);
    const allProgress = progressData ? JSON.parse(progressData) : {};

    if (!allProgress[userId]) {
      allProgress[userId] = {};
    }

    allProgress[userId][deckId] = {
      ...allProgress[userId][deckId],
      ...progress,
      lastStudied: Date.now(),
    };

    storage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}
