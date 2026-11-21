/**
 * Renders cv/cv.html → public/Stanley-Ansong-CV.pdf and cv/og.html →
 * public/og-image.png using local Chrome. Run: `npm run cv`.
 */
import puppeteer from 'puppeteer-core'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = (p) => pathToFileURL(resolve(p)).href

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
try {
  const page = await browser.newPage()
  await page.goto(url('cv/cv.html'), { waitUntil: 'load' })
  await page.pdf({ path: 'public/Stanley-Ansong-CV.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true })
  console.log('Wrote public/Stanley-Ansong-CV.pdf')

  await page.setViewport({ width: 1200, height: 630 })
  await page.goto(url('cv/og.html'), { waitUntil: 'load' })
  await page.screenshot({ path: 'public/og-image.png' })
  console.log('Wrote public/og-image.png')
} finally {
  await browser.close()
}
