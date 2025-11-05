import { ref, set, get, push, update, remove } from 'firebase/database';
import { database } from './firebase';
import { Deck, Card, UserProgress } from '@/types';
import { seedDecks } from './seedData';

// Initialize database with seed data
export async function initializeDatabase() {
  try {
    const decksRef = ref(database, 'decks');
    const snapshot = await get(decksRef);

    if (!snapshot.exists()) {
      // Database is empty, seed it
      const decksData: { [key: string]: Deck } = {};
      seedDecks.forEach(deck => {
        decksData[deck.id] = deck;
      });

      await set(decksRef, decksData);
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
    const decksRef = ref(database, 'decks');
    const snapshot = await get(decksRef);

    if (snapshot.exists()) {
      const decksData = snapshot.val();
      return Object.values(decksData);
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
    const deckRef = ref(database, `decks/${deckId}`);
    const snapshot = await get(deckRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
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
    const decksRef = ref(database, 'decks');
    const newDeckRef = push(decksRef);
    const deckId = newDeckRef.key!;

    const newDeck: Deck = {
      ...deck,
      id: deckId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(newDeckRef, newDeck);
    return deckId;
  } catch (error) {
    console.error('Error creating deck:', error);
    throw error;
  }
}

// Update a deck
export async function updateDeck(deckId: string, updates: Partial<Deck>): Promise<void> {
  try {
    const deckRef = ref(database, `decks/${deckId}`);
    await update(deckRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating deck:', error);
    throw error;
  }
}

// Delete a deck
export async function deleteDeck(deckId: string): Promise<void> {
  try {
    const deckRef = ref(database, `decks/${deckId}`);
    await remove(deckRef);
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
    const progressRef = ref(database, `userProgress/${userId}/${deckId}`);
    const snapshot = await get(progressRef);

    if (snapshot.exists()) {
      return snapshot.val();
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
    const progressRef = ref(database, `userProgress/${userId}/${deckId}`);
    await update(progressRef, {
      ...progress,
      lastStudied: Date.now(),
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}
