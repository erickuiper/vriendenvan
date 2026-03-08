export interface Card {
  id: string
  value: number
  isFlipped: boolean
  isMatched: boolean
}

export interface GameState {
  targetNumber: number | null
  cards: Card[]
  flippedCardIds: string[]
  moves: number
  status: 'start' | 'playing' | 'won'
}
