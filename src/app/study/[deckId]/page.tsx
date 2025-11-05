import { StudyPageClient } from "@/components/study-page-client"
import { seedDecks } from "@/lib/seedData"

export function generateStaticParams() {
  return seedDecks.map((deck) => ({
    deckId: deck.id,
  }))
}

export default function StudyPage() {
  return <StudyPageClient />
}
