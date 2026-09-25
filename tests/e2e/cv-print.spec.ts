import { test, expect } from '@playwright/test'

test('print media hides site chrome and shows the CV sheet', async ({ page }) => {
  await page.goto('/sobre-mi')
  await page.emulateMedia({ media: 'print' })
  await expect(page.locator('.cv-sheet')).toBeVisible()
  // Navbar exists in the DOM and is hidden in print (assert presence, don't mask a missing selector)
  const nav = page.locator('.VPNav').first()
  await expect(nav).toBeAttached()
  const navDisplay = await nav.evaluate((el) => getComputedStyle(el).display)
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

test('CV skills render as grouped chips, not a single text blob', async ({ page }) => {
  await page.goto('/sobre-mi')
  const groups = page.locator('.cm-skill-group')
  expect(await groups.count()).toBeGreaterThanOrEqual(5)
  // each group exposes an icon
  await expect(page.locator('.cm-skill-group .cm-cat-icon').first()).toBeVisible()
})

test('printed section headings show a single divider, not double', async ({ page }) => {
  await page.goto('/sobre-mi')
  await page.emulateMedia({ media: 'print' })
  const h2 = page.locator('.cv-sheet h2').first()
  const borders = await h2.evaluate((el) => {
    const s = getComputedStyle(el)
    return { top: s.borderTopWidth, bottom: s.borderBottomWidth }
  })
  // exactly one rule per heading: a bottom border, no top border
  expect(borders.top).toBe('0px')
  expect(borders.bottom).toBe('1px')
})
