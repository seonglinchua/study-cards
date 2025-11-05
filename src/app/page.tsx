"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DeckCard } from "@/components/deck-card"
import { Button } from "@/components/ui/button"
import { Deck } from "@/types"
import { getFeaturedDecks, initializeDatabase } from "@/lib/deckService"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  const [featuredDecks, setFeaturedDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Initialize database with seed data if needed
        await initializeDatabase()

        // Load featured decks
        const decks = await getFeaturedDecks()
        setFeaturedDecks(decks)
      } catch (err) {
        console.error("Error loading decks:", err)
        setError("Failed to load decks. Please check your Firebase configuration.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading decks...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Unable to Load Decks</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Make sure you have configured Firebase in your .env.local file.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          <span>Interactive Learning Made Fun</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Learn with Flashcards
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Master new concepts through interactive flashcards. Perfect for kids and learners of all ages!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/decks">
            <Button size="lg" className="gap-2">
              Browse All Decks
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="lg" variant="outline">
              Create Your Own
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Decks */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Decks</h2>
            <p className="text-muted-foreground">Start learning with our popular flashcard decks</p>
          </div>
          <Link href="/decks">
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {featuredDecks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured decks available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
          <p className="text-muted-foreground">
            Flip cards, track progress, and master concepts at your own pace
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
          <p className="text-muted-foreground">
            Kid-friendly interface with bright colors and smooth animations
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
          <p className="text-muted-foreground">
            Learn anywhere, anytime on any device with responsive design
          </p>
        </div>
      </section>
    </div>
  )
}
