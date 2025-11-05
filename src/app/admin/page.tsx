"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createDeck, addCardToDeck } from "@/lib/deckService"
import { Settings, Plus, Trash2 } from "lucide-react"
import { Category } from "@/types"

interface CardForm {
  front: string
  back: string
}

export default function AdminPage() {
  const router = useRouter()
  const [deckTitle, setDeckTitle] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [deckCategory, setDeckCategory] = useState<Category>("other")
  const [cards, setCards] = useState<CardForm[]>([{ front: "", back: "" }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const categories: Category[] = ["animals", "colors", "alphabet", "numbers", "shapes", "other"]

  const handleAddCard = () => {
    setCards([...cards, { front: "", back: "" }])
  }

  const handleRemoveCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index)
    setCards(newCards.length === 0 ? [{ front: "", back: "" }] : newCards)
  }

  const handleCardChange = (index: number, field: "front" | "back", value: string) => {
    const newCards = [...cards]
    newCards[index][field] = value
    setCards(newCards)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!deckTitle.trim()) {
      setError("Please enter a deck title")
      return
    }

    if (!deckDescription.trim()) {
      setError("Please enter a deck description")
      return
    }

    const validCards = cards.filter(card => card.front.trim() && card.back.trim())
    if (validCards.length === 0) {
      setError("Please add at least one card with both front and back content")
      return
    }

    try {
      setLoading(true)

      // Create the deck
      const deckId = await createDeck({
        title: deckTitle.trim(),
        description: deckDescription.trim(),
        category: deckCategory,
        cardCount: validCards.length,
        cards: [],
        isFeatured: false,
      })

      // Add all cards to the deck
      for (const card of validCards) {
        await addCardToDeck(deckId, {
          front: card.front.trim(),
          back: card.back.trim(),
        })
      }

      setSuccess(true)

      // Reset form
      setDeckTitle("")
      setDeckDescription("")
      setDeckCategory("other")
      setCards([{ front: "", back: "" }])

      // Redirect to the new deck after a short delay
      setTimeout(() => {
        router.push(`/study/${deckId}`)
      }, 1500)
    } catch (err) {
      console.error("Error creating deck:", err)
      setError("Failed to create deck. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Deck Manager</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Create and manage your flashcard decks
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Deck Information</CardTitle>
            <CardDescription>Basic details about your flashcard deck</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Deck Title *
              </label>
              <input
                id="title"
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                placeholder="e.g., Spanish Vocabulary"
                className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                placeholder="Brief description of what this deck covers"
                rows={3}
                className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={deckCategory === category ? "default" : "outline"}
                    className="cursor-pointer capitalize text-sm px-4 py-2"
                    onClick={() => !loading && setDeckCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Flashcards</CardTitle>
                <CardDescription>Add cards to your deck (front and back)</CardDescription>
              </div>
              <Button type="button" onClick={handleAddCard} disabled={loading} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cards.map((card, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Card {index + 1}</span>
                  {cards.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCard(index)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Front (Question/Image)</label>
                  <input
                    type="text"
                    value={card.front}
                    onChange={(e) => handleCardChange(index, "front", e.target.value)}
                    placeholder="e.g., Hello or 🐶"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-lg"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Back (Answer)</label>
                  <input
                    type="text"
                    value={card.back}
                    onChange={(e) => handleCardChange(index, "back", e.target.value)}
                    placeholder="e.g., Hola or Dog"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={loading}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary">
            ✓ Deck created successfully! Redirecting to study page...
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={loading} className="flex-1">
            {loading ? "Creating Deck..." : "Create Deck"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push("/decks")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
