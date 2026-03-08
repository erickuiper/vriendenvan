import { test, expect } from '@playwright/test'

test.describe('Vriendjes van Getallen', () => {
  test('app opent en toont startscherm', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /vriendjes van getallen/i })).toBeVisible()
    await expect(page.getByText(/kies een getal/i)).toBeVisible()
    for (let n = 3; n <= 10; n++) {
      await expect(page.getByRole('button', { name: new RegExp(`${n}`) })).toBeVisible()
    }
  })

  test('gebruiker kiest getal en ziet memorybord', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '4' }).click()
    await expect(page.getByText(/getal: 4/i)).toBeVisible()
    await expect(page.getByText(/zoek de combinaties die samen \d+ maken/i)).toBeVisible()
    const cards = page.getByRole('button', { name: /^Kaart \d+$/ })
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('volledige flow: alle matches vinden en winstscherm', async ({ page }) => {
    test.setTimeout(90000)
    await page.goto('/')
    await page.getByRole('button', { name: '3' }).click()
    await expect(page.getByText(/zoek de combinaties die samen \d+ maken/i)).toBeVisible()

    const cardSelector = 'button[aria-label^="Kaart "]:not([disabled])'
    for (let round = 0; round < 50; round++) {
      const enabledCards = page.locator(cardSelector)
      const count = await enabledCards.count()
      if (count < 2) break
      const pairCount = (count * (count - 1)) / 2
      const pairIndex = round % pairCount
      let k = 0
      let remaining = pairIndex
      while (remaining >= count - 1 - k) {
        remaining -= count - 1 - k
        k += 1
      }
      const firstIdx = k
      const secondIdx = k + 1 + remaining
      await enabledCards.nth(firstIdx).click()
      await page.waitForTimeout(300)
      const stillEnabled = page.locator(cardSelector)
      const count2 = await stillEnabled.count()
      if (count2 < 2) break
      const secondClickIdx = count2 < count ? (secondIdx > firstIdx ? secondIdx - 1 : secondIdx) : secondIdx
      await stillEnabled.nth(secondClickIdx).click()
      await page.waitForTimeout(800)
      const winVisible = await page.getByRole('heading', { name: /goed gedaan/i }).isVisible().catch(() => false)
      if (winVisible) break
    }

    await expect(
      page.getByRole('heading', {
        name: /goed gedaan|wauw|knap gedaan|super gedaan|goed geprobeerd/i,
      })
    ).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/foutjes gemaakt: \d+/i)).toBeVisible({ timeout: 5000 })
    const nogEenKeer = page.getByRole('button', { name: /nog een keer/i })
    await expect(nogEenKeer).toBeVisible({ timeout: 5000 })
    await expect(nogEenKeer).toBeEnabled({ timeout: 5000 })
    await expect(page.getByRole('button', { name: /kies een ander getal/i })).toBeVisible({ timeout: 5000 })
  })

  test('knop "Kies een ander getal" gaat terug naar start', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '5' }).click()
    await page.getByRole('button', { name: /terug/i }).click()
    await expect(page.getByRole('heading', { name: /vriendjes van getallen/i })).toBeVisible()
  })
})
