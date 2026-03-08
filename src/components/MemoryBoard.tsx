import type { Card as CardType } from '../types'
import { MemoryCard } from './MemoryCard'
import styles from './MemoryBoard.module.css'

interface MemoryBoardProps {
  cards: CardType[]
  showMismatch: boolean
  selectedCardIds: string[]
  onCardClick: (cardId: string) => void
}

function getGridSize(n: number): { cols: number; rows: number } {
  const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(n))))
  const rows = Math.ceil(n / cols)
  return { cols, rows }
}

export function MemoryBoard({ cards, showMismatch, selectedCardIds, onCardClick }: MemoryBoardProps) {
  const { cols, rows } = getGridSize(cards.length)
  return (
    <div className={styles.boardFill}>
      <div
        className={styles.grid}
        role="grid"
        aria-label="Memory kaarten"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
      {cards.map((card) => (
        <MemoryCard
          key={card.id}
          card={card}
          showMismatch={showMismatch}
          isSelected={selectedCardIds.includes(card.id)}
          onClick={() => onCardClick(card.id)}
        />
      ))}
      </div>
    </div>
  )
}
