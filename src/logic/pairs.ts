const MIN_TARGET = 3
const MAX_TARGET = 10

/**
 * Genereert de waarden voor kaarten: per combinatie (i, target-i) twee kaarten,
 * één met waarde i en één met waarde target-i. Voor target 4: [0, 4, 1, 3, 2, 2].
 * Elke kaart toont dus één getal; twee kaarten matchen als hun som het doelgetal is.
 */
export function generateCardValuesFor(target: number): number[] {
  if (target < MIN_TARGET || target > MAX_TARGET) {
    return []
  }
  const values: number[] = []
  for (let i = 0; i <= Math.floor(target / 2); i++) {
    values.push(i)
    values.push(target - i)
  }
  return values
}

export { MIN_TARGET, MAX_TARGET }
