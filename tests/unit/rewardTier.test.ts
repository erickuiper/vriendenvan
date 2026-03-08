import { describe, it, expect } from 'vitest'
import {
  getRewardTier,
  getRewardCopy,
  getCelebrationLevel,
} from '../../src/logic/rewardTier'

describe('getRewardTier', () => {
  it('returns perfect for 0 mistakes', () => {
    expect(getRewardTier(0)).toBe('perfect')
  })

  it('returns great for 1 mistake', () => {
    expect(getRewardTier(1)).toBe('great')
  })

  it('returns good for 2 or 3 mistakes', () => {
    expect(getRewardTier(2)).toBe('good')
    expect(getRewardTier(3)).toBe('good')
  })

  it('returns ok for 4 or 5 mistakes', () => {
    expect(getRewardTier(4)).toBe('ok')
    expect(getRewardTier(5)).toBe('ok')
  })

  it('returns needs-encouragement for more than 5 mistakes', () => {
    expect(getRewardTier(6)).toBe('needs-encouragement')
    expect(getRewardTier(10)).toBe('needs-encouragement')
  })
})

describe('getRewardCopy', () => {
  it('returns title, subtitle and face for each tier', () => {
    const tiers = ['needs-encouragement', 'ok', 'good', 'great', 'perfect'] as const
    for (const tier of tiers) {
      const copy = getRewardCopy(tier)
      expect(copy.title).toBeTruthy()
      expect(copy.subtitle).toBeTruthy()
      expect(copy.face).toBeTruthy()
    }
  })

  it('perfect tier has 0 foutjes message', () => {
    const copy = getRewardCopy('perfect')
    expect(copy.title).toMatch(/0 foutjes|perfect/i)
    expect(copy.subtitle).toMatch(/perfect|1 keer goed/i)
  })
})

describe('getCelebrationLevel', () => {
  it('returns 0 for needs-encouragement', () => {
    expect(getCelebrationLevel('needs-encouragement')).toBe(0)
  })

  it('returns 1 for ok', () => {
    expect(getCelebrationLevel('ok')).toBe(1)
  })

  it('returns 2 for good', () => {
    expect(getCelebrationLevel('good')).toBe(2)
  })

  it('returns 3 for great', () => {
    expect(getCelebrationLevel('great')).toBe(3)
  })

  it('returns 4 for perfect', () => {
    expect(getCelebrationLevel('perfect')).toBe(4)
  })
})
