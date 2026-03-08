import type { Card as CardType } from '../types'
import styles from './MemoryCard.module.css'

interface MemoryCardProps {
  card: CardType
  onClick: () => void
  showMismatch?: boolean
}

export function MemoryCard({ card, onClick, showMismatch }: MemoryCardProps) {
  const isRevealed = card.isFlipped || card.isMatched
  const isWrong = showMismatch && card.isFlipped && !card.isMatched

  return (
    <button
      type="button"
      className={`${styles.card} ${isRevealed ? styles.revealed : ''} ${isWrong ? styles.wrong : ''} ${card.isMatched ? styles.matched : ''}`}
      onClick={onClick}
      disabled={card.isMatched}
      aria-label={isRevealed ? `Kaart ${card.value}` : 'Gesloten kaart'}
      aria-pressed={isRevealed}
    >
      <span className={styles.face} aria-hidden>{isRevealed ? card.value : '★'}</span>
    </button>
  )
}
