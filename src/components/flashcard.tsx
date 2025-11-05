"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  front: string
  back: string
  isFlipped: boolean
  onFlip: () => void
}

export function Flashcard({ front, back, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <div
        className={cn(
          "relative w-full aspect-[3/2] transition-transform duration-500 transform-style-3d cursor-pointer",
          isFlipped && "rotate-y-180"
        )}
        onClick={onFlip}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-purple-500/10 p-8 flex items-center justify-center shadow-lg",
            "hover:shadow-xl transition-shadow"
          )}
        >
          <div className="text-center">
            <div className="text-6xl md:text-8xl mb-4">{front}</div>
            <p className="text-sm text-muted-foreground">Click to flip</p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-primary/10 p-8 flex items-center justify-center shadow-lg",
            "hover:shadow-xl transition-shadow"
          )}
        >
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-bold">{back}</div>
            <p className="text-sm text-muted-foreground mt-4">Click to flip back</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
