import { useCallback, useState } from 'react'
import type { GameState } from '../types'
import {
  createCardsForTarget,
  createInitialState,
  doCardsMatch,
  areAllMatchesFound,
} from '../logic/memory'

const FLIP_BACK_DELAY_MS = 800

export function useMemoryGame() {
  const [state, setState] = useState<GameState>(createInitialState())
  const [showMismatch, setShowMismatch] = useState(false)
  const [isFlippingLocked, setIsFlippingLocked] = useState(false)

  const chooseNumber = useCallback((target: number) => {
    const cards = createCardsForTarget(target)
    setState({
      targetNumber: target,
      cards,
      flippedCardIds: [],
      moves: 0,
      status: 'playing',
    })
    setShowMismatch(false)
    setIsFlippingLocked(false)
  }, [])

  const flipCard = useCallback(
    (cardId: string) => {
      if (isFlippingLocked) return
      const card = state.cards.find((c) => c.id === cardId)
      if (!card || card.isMatched || card.isFlipped) return
      if (state.flippedCardIds.length >= 2) return
      if (state.targetNumber == null) return

      const newFlipped = [...state.flippedCardIds, cardId]
      setState((prev) => ({
        ...prev,
        flippedCardIds: newFlipped,
        cards: prev.cards.map((c) =>
          c.id === cardId ? { ...c, isFlipped: true } : c
        ),
      }))

      if (newFlipped.length === 2) {
        const match = doCardsMatch(
          state.cards,
          newFlipped[0],
          newFlipped[1],
          state.targetNumber
        )
        if (match) {
          const nextCards = state.cards.map((c) =>
            c.id === newFlipped[0] || c.id === newFlipped[1]
              ? { ...c, isFlipped: true, isMatched: true }
              : c
          )
          const won = areAllMatchesFound(nextCards)
          setState((prev) => ({
            ...prev,
            moves: prev.moves + 1,
            cards: nextCards,
            flippedCardIds: [],
            status: won ? 'won' : prev.status,
          }))
        } else {
          setShowMismatch(true)
          setIsFlippingLocked(true)
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              flippedCardIds: [],
              cards: prev.cards.map((c) =>
                newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
              ),
            }))
            setShowMismatch(false)
            setIsFlippingLocked(false)
          }, FLIP_BACK_DELAY_MS)
        }
      }
    },
    [state.cards, state.flippedCardIds, state.targetNumber, isFlippingLocked]
  )

  const goToStart = useCallback(() => {
    setState(createInitialState())
    setShowMismatch(false)
    setIsFlippingLocked(false)
  }, [])

  const playAgain = useCallback(() => {
    if (state.targetNumber != null) {
      chooseNumber(state.targetNumber)
    }
  }, [state.targetNumber, chooseNumber])

  return {
    state,
    showMismatch,
    chooseNumber,
    flipCard,
    goToStart,
    playAgain,
  }
}
