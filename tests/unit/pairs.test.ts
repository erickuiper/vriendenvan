import { describe, it, expect } from 'vitest'
import { generateCardValuesFor, MIN_TARGET, MAX_TARGET } from '../../src/logic/pairs'

describe('generateCardValuesFor', () => {
  it('genereert kaartwaarden voor getal 3 (combinaties 0+3 en 1+2)', () => {
    const values = generateCardValuesFor(3)
    expect(values).toHaveLength(4)
    expect(values.sort((a, b) => a - b)).toEqual([0, 1, 2, 3])
  })

  it('genereert kaartwaarden voor getal 5', () => {
    const values = generateCardValuesFor(5)
    expect(values).toHaveLength(6)
    expect(values.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('bevat twee keer 2 voor getal 4 (combinatie 2+2)', () => {
    const values = generateCardValuesFor(4)
    expect(values.filter((v) => v === 2)).toHaveLength(2)
    expect(values).toHaveLength(6)
  })

  it('geeft lege array voor getal buiten 3-10', () => {
    expect(generateCardValuesFor(2)).toEqual([])
    expect(generateCardValuesFor(11)).toEqual([])
  })
})
