import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import { Deck } from "@/types"

interface DeckCardProps {
  deck: Deck
}

export function DeckCard({ deck }: DeckCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-2xl">{deck.title}</CardTitle>
          <Badge variant="secondary" className="capitalize">
            {deck.category}
          </Badge>
        </div>
        <CardDescription>{deck.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{deck.cardCount} cards</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/study/${deck.id}`} className="w-full">
          <Button className="w-full" size="lg">
            Start Learning
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
