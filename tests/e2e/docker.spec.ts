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
    const cards = page.getByRole('button', { name: /gesloten kaart|kaart \d+/i })
    await expect(cards.first()).toBeVisible({ timeout: 10000 })
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('volledige flow: alle matches vinden en winstscherm', async ({ page }) => {
    test.setTimeout(75000)
    await page.goto('/')
    await page.getByRole('button', { name: '3' }).click()
    await expect(page.getByText(/zoek de combinaties die samen \d+ maken/i)).toBeVisible()

    for (let round = 0; round < 30; round++) {
      const closed = page.getByRole('button', { name: /gesloten kaart/i })
      const count = await closed.count()
      if (count < 2) break
      await closed.nth(0).click()
      await page.waitForTimeout(250)
      const stillClosed = page.getByRole('button', { name: /gesloten kaart/i })
      await stillClosed.nth(0).click()
      await page.waitForTimeout(1200)
      const winVisible = await page.getByRole('heading', { name: /goed gedaan/i }).isVisible().catch(() => false)
      if (winVisible) break
    }

    await expect(page.getByRole('heading', { name: /goed gedaan/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /nog een keer/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /kies een ander getal/i })).toBeVisible()
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
    const cards = page.getByRole('button', { name: /gesloten kaart|kaart \d+/i })
    await expect(cards.first()).toBeVisible({ timeout: 10000 })
    const box = await cards.first().boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeGreaterThanOrEqual(96)
    expect(box!.height).toBeGreaterThanOrEqual(96)
  })
})
