import type { Card as CardType } from '../types'
import styles from './MemoryCard.module.css'

interface MemoryCardProps {
  card: CardType
  onClick: () => void
  showMismatch?: boolean
  isSelected?: boolean
}

export function MemoryCard({ card, onClick, showMismatch, isSelected }: MemoryCardProps) {
  const isWrong = showMismatch && isSelected && !card.isMatched

  return (
    <button
      type="button"
      className={`${styles.card} ${styles.revealed} ${isSelected ? styles.selected : ''} ${isWrong ? styles.wrong : ''} ${card.isMatched ? styles.matched : ''}`}
      onClick={onClick}
      disabled={card.isMatched}
      aria-label={`Kaart ${card.value}`}
      aria-pressed={isSelected}
    >
      <span className={styles.face} aria-hidden>{card.value}</span>
    </button>
  )
}
