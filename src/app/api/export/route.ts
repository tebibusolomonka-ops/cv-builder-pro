import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import { existsSync } from 'node:fs'

/**
 * Renders the editor's own print view to a real PDF and streams it back, so the
 * browser downloads a file instead of opening the print dialog.
 *
 * Why not generate the PDF in the browser: the html2canvas/jsPDF approach
 * produces a flat image with no selectable text, which applicant tracking
 * systems cannot read. That would break the ATS promise on the homepage.
 *
 * This deliberately reuses the existing print stylesheet rather than
 * re-implementing the layout — whatever Ctrl+P produces is what downloads.
 */

export const runtime = 'nodejs'
export const maxDuration = 60

/** puppeteer-core ships no browser; use whichever Chrome/Edge is installed. */
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean) as string[]

function findChrome(): string | null {
  return CHROME_CANDIDATES.find((p) => existsSync(p)) ?? null
}

function safeFilename(title: string): string {
  const cleaned = title
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)
  return `${cleaned || 'Resume'}.pdf`
}

export async function POST(request: Request) {
  const chromePath = findChrome()
  if (!chromePath) {
    return NextResponse.json(
      { error: 'No Chrome or Edge installation found. Set CHROME_PATH, or use Export via print instead.' },
      { status: 501 }
    )
  }

  let payload: { title?: string; storeState?: unknown }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // A missing store is legitimate: zustand only writes to localStorage after the
  // first edit, so a brand-new visitor has nothing saved yet. Render whatever the
  // editor shows by default rather than refusing.

  const origin = new URL(request.url).origin
  let browser

  try {
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    })

    const page = await browser.newPage()
    // Puppeteer's default viewport is 800px wide. At that width the editor's
    // preview is intentionally hidden behind the mobile Edit/Preview tabs, so
    // the A4 fitter cannot measure it and the PDF keeps the small 0.79 fallback
    // zoom. Render at the same desktop breakpoint used by the visible editor.
    await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 })

    // Seed the store BEFORE the app boots, so the editor hydrates straight into
    // the caller's resume rather than the default sample.
    //
    // The client sends localStorage.getItem(), which is ALREADY a JSON string.
    // Calling JSON.stringify on it again double-encodes it, zustand's persist
    // middleware fails to parse, and it silently falls back to the default
    // template — which looks like a working export of the wrong CV.
    const seed =
      typeof payload.storeState === 'string'
        ? payload.storeState
        : payload.storeState
          ? JSON.stringify(payload.storeState)
          : null

    if (seed) {
      await page.evaluateOnNewDocument((state: string) => {
        window.localStorage.setItem('cv-builder-resume', state)
      }, seed)
    }

    await page.goto(`${origin}/resume/1/edit`, { waitUntil: 'networkidle0', timeout: 30_000 })
    // The preview mounts client-side and fits iteratively after hydration and
    // font loading. Waiting only for the article catches its server-rendered
    // fallback zoom; wait for the visible, settled page instead.
    await page.waitForSelector('.resume-print-frame article[data-resume-fit-ready="true"]', {
      visible: true,
      timeout: 12_000,
    })
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all(
        Array.from(document.querySelectorAll<HTMLImageElement>('.resume-print-frame img')).map(
          async (image) => {
            const loadAndDecode = async () => {
              if (!image.complete) {
                await new Promise<void>((resolve) => {
                  image.addEventListener('load', () => resolve(), { once: true })
                  image.addEventListener('error', () => resolve(), { once: true })
                })
              }
              try {
                await image.decode()
              } catch {
                // A failed optional portrait must not prevent an otherwise valid
                // text resume from exporting; its fixed frame still fits safely.
              }
            }

            await Promise.race([
              loadAndDecode(),
              new Promise<void>((resolve) => setTimeout(resolve, 3_000)),
            ])
          }
        )
      )

      let stableFrames = 0
      let previousZoom = ''
      const deadline = performance.now() + 4_000
      while (stableFrames < 3 && performance.now() < deadline) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
        const article = document.querySelector<HTMLElement>('.resume-print-frame article')
        const zoom = article?.style.zoom ?? ''
        const ready = article?.dataset.resumeFitReady === 'true'
        const visible = Boolean(article && article.getBoundingClientRect().height > 0)

        stableFrames = ready && visible && zoom === previousZoom ? stableFrames + 1 : 0
        previousZoom = zoom
      }

      if (stableFrames < 3) throw new Error('Resume layout did not finish fitting before export')
    })

    const pdf = await page.pdf({
      printBackground: true,
      // Honour the @page rule in globals.css rather than restating A4 here —
      // one source of truth for paper size.
      preferCSSPageSize: true,
    })

    return new NextResponse(pdf as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename(String(payload.title ?? ''))}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[export] PDF generation failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'PDF generation failed' },
      { status: 500 }
    )
  } finally {
    await browser?.close()
  }
}
