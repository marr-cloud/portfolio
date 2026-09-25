import { test, expect } from '@playwright/test'

test('English home renders and localizes', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.locator('.cm-hero__name')).toHaveText('Mauricio Rodriguez')
  await expect(page.locator('.cm-hero__role')).toContainText('DevOps Engineer')
  // project card descriptions use the English text
  await page.goto('/en/proyectos')
  await expect(page.locator('.cm-card__desc').first()).toContainText(/proxy|Worker|CLI|starter|POSIX/i)
})

test('English projects page exists and is localized', async ({ page }) => {
  await page.goto('/en/proyectos')
  await expect(page).toHaveURL(/\/en\/proyectos/)
  await expect(page.locator('h1')).toContainText('Projects')
  await expect(page.locator('.cm-grid')).toBeVisible()
})

test('English stack page has no untranslated Spanish items', async ({ page }) => {
  await page.goto('/en/stack')
  const text = await page.locator('.cm-stack').innerText()
  expect(text).not.toMatch(/multi-entorno|Automatización de infraestructura/i)
})
