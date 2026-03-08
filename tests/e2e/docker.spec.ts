import { test, expect } from '@playwright/test'

/**
 * Integration tests: run against the Docker container (no dev server).
 * Start container first: docker run -p 8080:80 erickuiper/vriendenvan
 * Then: npm run test:e2e:docker
 */
test.describe('Vriendjes van Getallen (Docker)', () => {
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
    await expect(cards.first()).toBeVisible({ timeout: 10000 })
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
      const winVisible = await page
        .getByRole('heading', { name: /goed gedaan|wauw|knap gedaan|super gedaan|goed geprobeerd/i })
        .isVisible()
        .catch(() => false)
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

test.describe('Tablet-ervaring', () => {
  test.describe.configure({ project: 'tablet' })
  test.use({ viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: false })

  test('toont tablet-ui (data-tablet-ui) bij touch + breed scherm', async ({ page }) => {
    await page.goto('/')
    const root = page.locator('[data-tablet-ui="true"]').first()
    await expect(root).toBeVisible({ timeout: 5000 })
  })

  test('startscherm heeft grotere knoppen op tablet', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-tablet-ui="true"]')).toBeVisible({ timeout: 5000 })
    const firstNumberBtn = page.getByRole('button', { name: '3' })
    await expect(firstNumberBtn).toBeVisible()
    const box = await firstNumberBtn.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeGreaterThanOrEqual(72)
    expect(box!.height).toBeGreaterThanOrEqual(72)
  })

  test('memorykaarten zijn groter op tablet', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-tablet-ui="true"]')).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: '4' }).click()
    await expect(page.getByText(/zoek de combinaties die samen \d+ maken/i)).toBeVisible()
    const cards = page.getByRole('button', { name: /^Kaart \d+$/ })
    await expect(cards.first()).toBeVisible({ timeout: 10000 })
    const box = await cards.first().boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeGreaterThanOrEqual(96)
    expect(box!.height).toBeGreaterThanOrEqual(96)
  })
})
