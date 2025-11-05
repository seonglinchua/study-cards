"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Flashcard } from "@/components/flashcard"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Deck } from "@/types"
import { getDeckById, markCardAsLearned } from "@/lib/deckService"
import { ArrowLeft, ChevronLeft, ChevronRight, Check, X } from "lucide-react"
import Link from "next/link"

export default function StudyPage() {
  const params = useParams()
  const router = useRouter()
  const deckId = params.deckId as string

  const [deck, setDeck] = useState<Deck | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadDeck() {
      try {
        setLoading(true)
        setError(null)
        const deckData = await getDeckById(deckId)

        if (!deckData) {
          setError("Deck not found")
          return
        }

        setDeck(deckData)

        // Initialize learned cards from deck data
        const learned = new Set<string>()
        deckData.cards.forEach(card => {
          if (card.learned) {
            learned.add(card.id)
          }
        })
        setLearnedCards(learned)
      } catch (err) {
        console.error("Error loading deck:", err)
        setError("Failed to load deck")
      } finally {
        setLoading(false)
      }
    }

    loadDeck()
  }, [deckId])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (deck && currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleToggleLearned = async () => {
    if (!deck) return

    const currentCard = deck.cards[currentCardIndex]
    const newLearnedState = !learnedCards.has(currentCard.id)

    try {
      await markCardAsLearned(deckId, currentCard.id, newLearnedState)

      const newLearnedCards = new Set(learnedCards)
      if (newLearnedState) {
        newLearnedCards.add(currentCard.id)
      } else {
        newLearnedCards.delete(currentCard.id)
      }
      setLearnedCards(newLearnedCards)
    } catch (err) {
      console.error("Error updating card status:", err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading deck...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !deck) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Deck Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || "The requested deck could not be found."}</p>
            <Link href="/decks">
              <Button>Back to Decks</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentCard = deck.cards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / deck.cards.length) * 100
  const isCurrentCardLearned = learnedCards.has(currentCard.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/decks" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Decks
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{deck.title}</h1>
            <p className="text-muted-foreground">{deck.description}</p>
          </div>
          <Badge variant="secondary" className="capitalize text-sm">
            {deck.category}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Card {currentCardIndex + 1} of {deck.cards.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {learnedCards.size} / {deck.cards.length} learned
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <Flashcard
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>

        <Button
          variant={isCurrentCardLearned ? "destructive" : "default"}
          size="lg"
          onClick={handleToggleLearned}
          className="w-full sm:w-auto"
        >
          {isCurrentCardLearned ? (
            <>
              <X className="h-5 w-5 mr-2" />
              Mark as Not Learned
            </>
          ) : (
            <>
              <Check className="h-5 w-5 mr-2" />
              Mark as Learned
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          disabled={currentCardIndex === deck.cards.length - 1}
          className="w-full sm:w-auto"
        >
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Completion Message */}
      {currentCardIndex === deck.cards.length - 1 && learnedCards.size === deck.cards.length && (
        <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-lg text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-semibold mb-2">Congratulations!</h3>
          <p className="text-muted-foreground mb-4">
            You've mastered all cards in this deck!
          </p>
          <Link href="/decks">
            <Button>Browse More Decks</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
