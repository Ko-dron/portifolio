/**
 * Headless smoke test: loads the running preview, drives scroll through every
 * section, and reports any console errors/warnings or uncaught page errors.
 * Not part of the shipped app — a dev-only verification aid.
 */
import puppeteer from 'puppeteer-core'

const URL = process.env.SMOKE_URL || 'http://localhost:4173/'
const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const errors = []
const warnings = []

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--no-sandbox',
    '--enable-unsafe-swiftshader', // software WebGL so the 3D scene can init headless
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--window-size=1440,900',
  ],
})

try {
  const page = await browser.newPage()
  const mobile = process.env.MOBILE === '1'
  await page.setViewport(
    mobile ? { width: 390, height: 844, isMobile: true, hasTouch: true } : { width: 1440, height: 900 },
  )

  if (process.env.REDUCED === '1') {
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
  }

  page.on('console', (msg) => {
    const type = msg.type()
    const text = msg.text()
    // SwiftShader/ANGLE emits benign perf notes headlessly — ignore GL software warnings.
    const benign = /SwiftShader|software renderer|Automatic fallback to software|GroupMarker/i.test(text)
    if (benign) return
    if (type === 'error') errors.push(text)
    if (type === 'warning') warnings.push(text)
  })
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))
  page.on('requestfailed', (req) => {
    const u = req.url()
    // Google Fonts may be unreachable in a sandboxed run — that's environmental.
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return
    errors.push('requestfailed: ' + u + ' — ' + (req.failure()?.errorText || ''))
  })

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 45000 })

  // Wait out the intro loader.
  await new Promise((r) => setTimeout(r, 2500))

  // Drive scroll through the whole page in steps (exercises reveals + pin).
  const height = await page.evaluate(() => document.body.scrollHeight)
  const steps = 24
  for (let i = 0; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), (height * i) / steps)
    await new Promise((r) => setTimeout(r, 120))
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 500))

  if (process.env.SHOT) {
    await page.evaluate(() => window.scrollTo(0, 0))
    await new Promise((r) => setTimeout(r, 600))
    await page.screenshot({ path: process.env.SHOT })
  }

  // Confirm the canvas actually mounted (3D hero present).
  const hasCanvas = await page.evaluate(() => !!document.querySelector('canvas'))
  const heroText = await page.evaluate(
    () => document.querySelector('h1')?.textContent?.slice(0, 40) || '',
  )

  console.log('canvas mounted :', hasCanvas)
  console.log('hero headline  :', JSON.stringify(heroText))
  console.log('console errors :', errors.length)
  console.log('console warns  :', warnings.length)
  if (warnings.length) console.log('  warnings:\n   - ' + warnings.join('\n   - '))
  if (errors.length) console.log('  errors:\n   - ' + errors.join('\n   - '))

  process.exitCode = errors.length ? 1 : 0
} finally {
  await browser.close()
}
