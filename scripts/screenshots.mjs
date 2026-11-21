/**
 * Captures project preview screenshots from the live sites into
 * src/assets/projects/*.jpg. Run: `npm run screenshots`.
 */
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const shots = [
  { name: 'evexia', url: 'https://evexia-nasa-space-app-2026.vercel.app/', demoLogin: true },
  { name: 'ridon', url: 'https://ridon-frontend.vercel.app' },
  { name: 'therion', url: 'https://therion-alpha.vercel.app' },
]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
try {
  for (const { name, url, demoLogin } of shots) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
    await new Promise((r) => setTimeout(r, 4000))
    // Dismiss install / cookie prompts that would cover the UI.
    await page.evaluate(() => {
      for (const b of document.querySelectorAll('button')) {
        if (/not now|dismiss|close|got it/i.test(b.textContent || b.getAttribute('aria-label') || '')) b.click()
      }
    })
    await new Promise((r) => setTimeout(r, 1000))
    if (demoLogin) {
      // Sign in with the first fictional demo account to show the dashboard.
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button')]
        btns.find((b) => b.textContent?.trim() === 'Use')?.click()
      })
      await new Promise((r) => setTimeout(r, 500))
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button')]
        btns.find((b) => b.textContent?.trim() === 'Sign in')?.click()
      })
      await new Promise((r) => setTimeout(r, 5000))
    }
    await page.screenshot({ path: `src/assets/projects/${name}.jpg`, type: 'jpeg', quality: 78 })
    console.log('saved', name)
    await page.close()
  }
} finally {
  await browser.close()
}
