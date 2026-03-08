import { describe, it, expect } from 'vitest'
import {
  createCardsForTarget,
  doCardsMatch,
  areAllMatchesFound,
  createInitialState,
} from '../../src/logic/memory'

describe('createCardsForTarget', () => {
  it('maakt juiste aantal kaarten voor getal 3 (4 kaarten met één getal elk)', () => {
    const cards = createCardsForTarget(3)
    expect(cards).toHaveLength(4)
    const values = cards.map((c) => c.value).sort((a, b) => a - b)
    expect(values).toEqual([0, 1, 2, 3])
  })

  it('bevat twee kaarten met waarde 2 voor getal 4', () => {
    const cards = createCardsForTarget(4)
    const twos = cards.filter((c) => c.value === 2)
    expect(twos).toHaveLength(2)
    expect(cards).toHaveLength(6)
  })

  it('elke kaart heeft unieke id', () => {
    const cards = createCardsForTarget(5)
    const ids = cards.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('doCardsMatch', () => {
  it('kaarten 1 en 3 matchen voor doelgetal 4', () => {
    const cards = createCardsForTarget(4)
    const card1 = cards.find((c) => c.value === 1)
    const card3 = cards.find((c) => c.value === 3)
    expect(card1).toBeDefined()
    expect(card3).toBeDefined()
    expect(doCardsMatch(cards, card1!.id, card3!.id, 4)).toBe(true)
  })

  it('zelfde kaart matcht niet met zichzelf', () => {
    const cards = createCardsForTarget(4)
    expect(doCardsMatch(cards, cards[0].id, cards[0].id, 4)).toBe(false)
  })

  it('twee kaarten die niet samen het doelgetal maken matchen niet', () => {
    const cards = createCardsForTarget(5)
    const card0 = cards.find((c) => c.value === 0)
    const card1 = cards.find((c) => c.value === 1)
    expect(card0).toBeDefined()
    expect(card1).toBeDefined()
    expect(doCardsMatch(cards, card0!.id, card1!.id, 5)).toBe(false)
  })
})

describe('areAllMatchesFound', () => {
  it('geeft true wanneer alle kaarten isMatched hebben', () => {
    const cards = createCardsForTarget(3).map((c) => ({ ...c, isMatched: true }))
    expect(areAllMatchesFound(cards)).toBe(true)
  })

  it('geeft false wanneer niet alle kaarten gematcht zijn', () => {
    const cards = createCardsForTarget(4)
    expect(areAllMatchesFound(cards)).toBe(false)
  })
})

describe('createInitialState', () => {
  it('geeft start status en lege cards', () => {
    const state = createInitialState()
    expect(state.status).toBe('start')
    expect(state.targetNumber).toBeNull()
    expect(state.cards).toEqual([])
    expect(state.flippedCardIds).toEqual([])
    expect(state.moves).toBe(0)
  })
})
