import { test, expect } from '@playwright/test'

test('print media hides site chrome and shows the CV sheet', async ({ page }) => {
  await page.goto('/sobre-mi')
  await page.emulateMedia({ media: 'print' })
  await expect(page.locator('.cv-sheet')).toBeVisible()
  // Navbar hidden in print
  const navDisplay = await page.locator('.VPNav').first().evaluate(
    (el) => getComputedStyle(el).display
  ).catch(() => 'none')
  expect(navDisplay).toBe('none')
  // Download button hidden in print
  const btn = page.locator('.cm-cv-btn')
  await expect(btn).toHaveCount(1)
  const btnDisplay = await btn.evaluate((el) => getComputedStyle(el).display)
  expect(btnDisplay).toBe('none')
})

test('download button is visible on screen', async ({ page }) => {
  await page.goto('/sobre-mi')
  await expect(page.locator('.cm-cv-btn')).toBeVisible()
})
