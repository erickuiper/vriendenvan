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
    const cards = page.getByRole('button', { name: /gesloten kaart|kaart \d+/i })
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('volledige flow: alle matches vinden en winstscherm', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('/')
    await page.getByRole('button', { name: '3' }).click()
    await expect(page.getByText(/zoek de combinaties die samen \d+ maken/i)).toBeVisible()

    for (let round = 0; round < 25; round++) {
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
