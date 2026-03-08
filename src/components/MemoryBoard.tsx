import type { Card as CardType } from '../types'
import { MemoryCard } from './MemoryCard'
import styles from './MemoryBoard.module.css'

interface MemoryBoardProps {
  cards: CardType[]
  showMismatch: boolean
  onCardClick: (cardId: string) => void
}

export function MemoryBoard({ cards, showMismatch, onCardClick }: MemoryBoardProps) {
  return (
    <div className={styles.grid} role="grid" aria-label="Memory kaarten">
      {cards.map((card) => (
        <MemoryCard
          key={card.id}
          card={card}
          showMismatch={showMismatch}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  )
}
