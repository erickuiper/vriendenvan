import type { RewardTier } from '../types'

/**
 * Bepaalt de belonings-tier op basis van het aantal fouten in de ronde.
 * 0 = perfect, 1 = great, 2-3 = good, 4-5 = ok, >5 = needs-encouragement.
 */
export function getRewardTier(mistakes: number): RewardTier {
  if (mistakes === 0) return 'perfect'
  if (mistakes === 1) return 'great'
  if (mistakes <= 3) return 'good'
  if (mistakes <= 5) return 'ok'
  return 'needs-encouragement'
}

export interface RewardCopy {
  title: string
  subtitle: string
  face: string
}

const REWARD_COPY: Record<RewardTier, RewardCopy> = {
  'needs-encouragement': {
    title: 'Goed geprobeerd!',
    subtitle: 'Nog een keer? Je leert het al goed.',
    face: '😕',
  },
  ok: {
    title: 'Goed gedaan!',
    subtitle: 'Nog een keer en dan lukt het nog beter!',
    face: '😐',
  },
  good: {
    title: 'Knap gedaan!',
    subtitle: 'Steeds beter!',
    face: '🙂',
  },
  great: {
    title: 'Super gedaan!',
    subtitle: 'Bijna perfect!',
    face: '😊',
  },
  perfect: {
    title: 'Wauw, 0 foutjes!',
    subtitle: 'Perfect gespeeld! Alles in 1 keer goed!',
    face: '🤩',
  },
}

export function getRewardCopy(tier: RewardTier): RewardCopy {
  return REWARD_COPY[tier]
}

/** 0 = geen viering, 1 = minimaal, 2 = beetje, 3 = meer, 4 = vol */
export function getCelebrationLevel(tier: RewardTier): 0 | 1 | 2 | 3 | 4 {
  switch (tier) {
    case 'needs-encouragement':
      return 0
    case 'ok':
      return 1
    case 'good':
      return 2
    case 'great':
      return 3
    case 'perfect':
      return 4
  }
}
