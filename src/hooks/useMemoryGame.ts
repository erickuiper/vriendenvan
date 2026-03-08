import { useCallback, useState } from 'react'
import type { GameState } from '../types'
import {
  createCardsForTarget,
  createInitialState,
  doCardsMatch,
  areAllMatchesFound,
} from '../logic/memory'

const WRONG_FEEDBACK_MS = 600

export function useMemoryGame() {
  const [state, setState] = useState<GameState>(createInitialState())
  const [showMismatch, setShowMismatch] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  const chooseNumber = useCallback((target: number) => {
    const cards = createCardsForTarget(target)
    setState({
      targetNumber: target,
      cards,
      flippedCardIds: [],
      moves: 0,
      mistakes: 0,
      status: 'playing',
    })
    setShowMismatch(false)
    setIsLocked(false)
  }, [])

  const flipCard = useCallback(
    (cardId: string) => {
      if (isLocked) return
      const card = state.cards.find((c) => c.id === cardId)
      if (!card || card.isMatched) return
      if (state.targetNumber == null) return

      const selected = state.flippedCardIds
      const isSelected = selected.includes(cardId)

      if (isSelected) {
        setState((prev) => ({
          ...prev,
          flippedCardIds: prev.flippedCardIds.filter((id) => id !== cardId),
        }))
        return
      }

      if (selected.length >= 2) return

      const newSelected = [...selected, cardId]
      setState((prev) => ({
        ...prev,
        flippedCardIds: newSelected,
      }))

      if (newSelected.length === 2) {
        const match = doCardsMatch(
          state.cards,
          newSelected[0],
          newSelected[1],
          state.targetNumber
        )
        if (match) {
          const nextCards = state.cards.map((c) =>
            newSelected.includes(c.id) ? { ...c, isFlipped: true, isMatched: true } : c
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
          setState((prev) => ({
            ...prev,
            mistakes: prev.mistakes + 1,
          }))
          setShowMismatch(true)
          setIsLocked(true)
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              flippedCardIds: [],
            }))
            setShowMismatch(false)
            setIsLocked(false)
          }, WRONG_FEEDBACK_MS)
        }
      }
    },
    [state.cards, state.flippedCardIds, state.targetNumber, isLocked]
  )

  const goToStart = useCallback(() => {
    setState(createInitialState())
    setShowMismatch(false)
    setIsLocked(false)
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
