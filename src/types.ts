export interface Card {
  id: string
  value: number
  isFlipped: boolean
  isMatched: boolean
}

export type RewardTier =
  | 'needs-encouragement'
  | 'ok'
  | 'good'
  | 'great'
  | 'perfect'

export interface GameState {
  targetNumber: number | null
  cards: Card[]
  flippedCardIds: string[]
  moves: number
  mistakes: number
  status: 'start' | 'playing' | 'won'
}
