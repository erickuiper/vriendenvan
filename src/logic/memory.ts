import type { Card, GameState } from '../types'
import { generateCardValuesFor } from './pairs'
import { shuffle } from './shuffle'

function createCard(value: number, index: number): Card {
  return {
    id: `card-${value}-${index}`,
    value,
    isFlipped: false,
    isMatched: false,
  }
}

/**
 * Maakt een set kaarten voor het memoryspel.
 * Elke kaart toont één getal. Twee kaarten matchen als hun som gelijk is aan het doelgetal.
 */
export function createCardsForTarget(target: number): Card[] {
  const values = generateCardValuesFor(target)
  const cards: Card[] = values.map((value, index) => createCard(value, index))
  return shuffle([...cards])
}

/**
 * Twee kaarten matchen als de som van hun waarden gelijk is aan het doelgetal.
 */
export function doCardsMatch(
  cards: Card[],
  idA: string,
  idB: string,
  target: number
): boolean {
  if (idA === idB) return false
  const cardA = cards.find((c) => c.id === idA)
  const cardB = cards.find((c) => c.id === idB)
  if (!cardA || !cardB) return false
  return cardA.value + cardB.value === target
}

/**
 * Alle kaarten zijn gematcht.
 */
export function areAllMatchesFound(cards: Card[]): boolean {
  return cards.length > 0 && cards.every((c) => c.isMatched)
}

export function createInitialState(): GameState {
  return {
    targetNumber: null,
    cards: [],
    flippedCardIds: [],
    moves: 0,
    status: 'start',
  }
}
