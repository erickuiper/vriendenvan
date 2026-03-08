import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMemoryGame } from '../../src/hooks/useMemoryGame'
import { createCardsForTarget } from '../../src/logic/memory'

describe('useMemoryGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with mistakes 0 when choosing a number', () => {
    const { result } = renderHook(() => useMemoryGame())
    act(() => {
      result.current.chooseNumber(4)
    })
    expect(result.current.state.mistakes).toBe(0)
  })

  it('increments mistakes after an incorrect match', () => {
    const { result } = renderHook(() => useMemoryGame())
    act(() => {
      result.current.chooseNumber(3)
    })
    const cards = createCardsForTarget(3)
    const card0 = cards.find((c) => c.value === 0)!
    const card1 = cards.find((c) => c.value === 1)!
    expect(card0).toBeDefined()
    expect(card1).toBeDefined()
    act(() => {
      result.current.flipCard(card0.id)
    })
    act(() => {
      result.current.flipCard(card1.id)
    })
    expect(result.current.state.mistakes).toBe(1)
    act(() => {
      vi.advanceTimersByTime(700)
    })
    expect(result.current.state.mistakes).toBe(1)
  })

  it('does not increment mistakes on correct match', () => {
    const { result } = renderHook(() => useMemoryGame())
    act(() => {
      result.current.chooseNumber(3)
    })
    const cards = createCardsForTarget(3)
    const card0 = cards.find((c) => c.value === 0)!
    const card3 = cards.find((c) => c.value === 3)!
    act(() => {
      result.current.flipCard(card0.id)
    })
    act(() => {
      result.current.flipCard(card3.id)
    })
    expect(result.current.state.mistakes).toBe(0)
  })
})
