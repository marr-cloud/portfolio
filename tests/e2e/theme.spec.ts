import { test, expect } from '@playwright/test'

async function brand(page) {
  return page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--vp-c-brand-1').trim()
  )
}

test('bronze accent applies in dark and light modes', async ({ page }) => {
  await page.goto('/')
  // Force dark
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  expect((await brand(page)).toLowerCase()).toBe('#c8a05a')
  // Force light
  await page.evaluate(() => document.documentElement.classList.remove('dark'))
  expect((await brand(page)).toLowerCase()).toBe('#a9762f')
})
