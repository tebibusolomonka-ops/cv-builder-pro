/**
 * Derives, for every layout, which resume fields it actually renders and in
 * what order it renders them -- straight from the renderer source.
 *
 * The editor form uses this to ask only for what the chosen template prints,
 * and to order its sections the way that template reads. Hand-maintaining that
 * for 51 layouts would drift the first time someone edited a renderer, so it is
 * generated instead.
 *
 *   node scripts/derive-template-fields.mjs
 *
 * Writes src/lib/templateFields.ts. Re-run it after adding or changing a layout.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const SRC = 'src/components/editor/LiveResumePreview.tsx'
const OUT = 'src/lib/templateFields.ts'
const source = readFileSync(SRC, 'utf8')

// layout id -> renderer function name, read from the RENDERERS map itself.
// Non-greedy through the type annotation, whose `=>` also contains an '='.
const renderersBlock = source.match(/const RENDERERS[\s\S]*?=\s*\{([\s\S]*?)\n\}/)
if (!renderersBlock) throw new Error('RENDERERS map not found')
const layoutToFn = new Map()
for (const line of renderersBlock[1].split('\n')) {
  const m = line.match(/^\s*([A-Za-z0-9_]+):\s*([A-Za-z0-9_]+)\s*,/)
  if (m) layoutToFn.set(m[1], m[2])
}

function bodyOf(fnName) {
  const start = source.indexOf(`function ${fnName}(`)
  if (start === -1) throw new Error(`renderer not found: ${fnName}`)
  // Renderers are top-level, so the next line that is exactly "}" closes it.
  const end = source.indexOf('\n}\n', start)
  return source.slice(start, end === -1 ? source.length : end)
}

// A field counts as used when the renderer references it directly, or uses a
// helper that renders it on the renderer's behalf.
const CONTACT_HELPERS = /<ContactStrip|<ContactChips|contactItems\(/
const PORTRAIT_HELPERS = /<Portrait\b|<Avatar\b/

const DIRECT = {
  summary: /model\.summary/,
  experience: /model\.experience/,
  education: /model\.education/,
  skills: /model\.skills/,
  languages: /model\.languages/,
  certifications: /model\.certifications/,
  projects: /model\.projects/,
  references: /model\.references/,
  website: /model\.website/,
  linkedin: /model\.linkedin/,
  github: /model\.github/,
}

// Which model field marks each form section, for ordering.
const SECTION_MARKER = {
  summary: ['summary'],
  experience: ['experience'],
  education: ['education'],
  skills: ['skills'],
  extras: ['languages', 'certifications', 'projects', 'references'],
}

const fields = {}
const order = {}

for (const [layout, fn] of layoutToFn) {
  const body = bodyOf(fn)
  const used = new Set()

  for (const [key, re] of Object.entries(DIRECT)) if (re.test(body)) used.add(key)
  if (PORTRAIT_HELPERS.test(body)) used.add('photo')
  if (CONTACT_HELPERS.test(body)) {
    used.add('website')
    used.add('linkedin')
    used.add('github')
  }

  fields[layout] = [...used].sort()

  // Section order follows the source, with one correction: a two-column layout
  // usually writes its <aside> first, so raw source order would put the narrow
  // rail ahead of the main column -- asking for Education before the summary.
  // Anything inside an <aside> is therefore ranked after everything outside it,
  // which is the order a reader takes the page in.
  // A rail is written either as <aside> or with the shared <SideColumn> helper.
  // Recognising only the first put Tagged's skills ahead of its work experience.
  const asideRanges = []
  for (const [openSrc, closeTag] of [
    ['<aside\\b', '</aside>'],
    ['<SideColumn\\b', '</SideColumn>'],
  ]) {
    const openTag = new RegExp(openSrc, 'g')
    let om
    while ((om = openTag.exec(body)) !== null) {
      const close = body.indexOf(closeTag, om.index)
      asideRanges.push([om.index, close === -1 ? body.length : close])
    }
  }
  const inAside = (i) => asideRanges.some(([a, b]) => i >= a && i <= b)

  const at = (key) => {
    const i = body.indexOf(`model.${key}`)
    if (i === -1) return Infinity
    // Rail content sorts after main content; source order breaks ties within each.
    return (inAside(i) ? 1e6 : 0) + i
  }
  const positions = Object.entries(SECTION_MARKER).map(([section, keys]) => ({
    section,
    pos: Math.min(...keys.map(at)),
  }))
  const derived = positions
    .filter((p) => Number.isFinite(p.pos))
    .sort((a, b) => a.pos - b.pos)
    .map((p) => p.section)

  // Summary and experience lead, always.
  //
  // Source order is only a proxy for reading order, and across 51 hand-written
  // layouts it is not a good enough one: eleven of them write a rail as a plain
  // <div>, so the derived order put skills or certificates ahead of work
  // experience. Nobody fills in a CV that way. The real per-template variation
  // is where education, skills and the optional sections sit, and that is still
  // taken from the template.
  const LEAD = ['summary', 'experience']
  order[layout] = [
    ...LEAD.filter((section) => derived.includes(section)),
    ...derived.filter((section) => !LEAD.includes(section)),
  ]
}

const banner = `// GENERATED FILE -- do not edit by hand.
// Produced by scripts/derive-template-fields.mjs from the renderer source, so
// it cannot drift from what the templates actually print. Re-run that script
// after adding or changing a layout.
`

const body = `${banner}
import type { TemplateLayoutId } from './constants'

/** A field the editor can ask for, beyond the ones every CV needs. */
export type ResumeFieldKey =
  | 'photo'
  | 'website'
  | 'linkedin'
  | 'github'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects'
  | 'references'

/** Form sections, in the order the editor lists them by default. */
export type FormSectionId = 'summary' | 'experience' | 'education' | 'skills' | 'extras'

/** What each layout renders. Anything absent is not printed by that template. */
export const LAYOUT_FIELDS: Record<TemplateLayoutId, ResumeFieldKey[]> = ${JSON.stringify(fields, null, 2)}

/** The order each layout reads in, used to order the form to match. */
export const LAYOUT_SECTION_ORDER: Record<TemplateLayoutId, FormSectionId[]> = ${JSON.stringify(order, null, 2)}
`

writeFileSync(OUT, body.replace(/"([a-zA-Z]+)":/g, '$1:'), 'utf8')

const counts = {}
for (const list of Object.values(fields)) for (const f of list) counts[f] = (counts[f] || 0) + 1
console.log(`derived ${Object.keys(fields).length} layouts ->`, OUT)
console.log('layouts rendering each field:')
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(15)} ${v}`)
