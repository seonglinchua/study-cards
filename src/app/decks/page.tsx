"use client"

import { useEffect, useState } from "react"
import { DeckCard } from "@/components/deck-card"
import { Badge } from "@/components/ui/badge"
import { Deck } from "@/types"
import { getAllDecks } from "@/lib/deckService"
import { Library } from "lucide-react"

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [filteredDecks, setFilteredDecks] = useState<Deck[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDecks() {
      try {
        setLoading(true)
        setError(null)
        const allDecks = await getAllDecks()
        setDecks(allDecks)
        setFilteredDecks(allDecks)
      } catch (err) {
        console.error("Error loading decks:", err)
        setError("Failed to load decks. Please check your Firebase configuration.")
      } finally {
        setLoading(false)
      }
    }

    loadDecks()
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredDecks(decks)
    } else {
      setFilteredDecks(decks.filter(deck => deck.category === selectedCategory))
    }
  }, [selectedCategory, decks])

  const categories = ["all", ...Array.from(new Set(decks.map(deck => deck.category)))]

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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Library className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Deck Library</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Browse all available flashcard decks and start learning
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize text-sm px-4 py-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Decks Grid */}
      {filteredDecks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No Decks Found</h3>
          <p className="text-muted-foreground">
            {selectedCategory === "all"
              ? "No decks are available yet."
              : `No decks found in the "${selectedCategory}" category.`}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredDecks.length} {filteredDecks.length === 1 ? 'deck' : 'decks'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
