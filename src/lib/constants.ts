export const APP_NAME = 'Netsa CV'
export const APP_DESCRIPTION = 'Build professional resumes that get you hired. Create stunning CVs with our modern, easy-to-use builder.'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const STARRED_RESUME_KEY = 'cvb-starred-doc-1'

export type TemplateCategoryId = 'all' | 'modern' | 'professional' | 'creative' | 'simple' | 'academic'
export type TemplateLayoutId =
  | 'premier'
  | 'modern'
  | 'professional'
  | 'minimal'
  | 'academic'
  | 'creative'
  | 'ats'
  | 'timeline'
  | 'banner'
  | 'duo'
  | 'monogram'
  | 'split'
  | 'compact'
  | 'elegant'
  | 'ledger'
  | 'gazette'
  | 'aperture'
  | 'facet'
  | 'halo'
  | 'atrium'
  | 'vista'
  | 'vertex'
  | 'meridian'
  | 'crest'
  | 'obsidian'
  | 'solstice'
  | 'capsule'
  | 'marquee'

export interface TemplateDefinition {
  id: string
  name: string
  description: string
  category: Exclude<TemplateCategoryId, 'all'>
  columns: 1 | 2
  baseTemplate: TemplateLayoutId
  accent: string
  secondary: string
}

// Palette families define how accent and secondary colors are applied.
type PaletteFamily = 'dark' | 'panel' | 'ink'

interface LayoutMeta {
  label: string
  category: Exclude<TemplateCategoryId, 'all'>
  columns: 1 | 2
  family: PaletteFamily
  description: string
}

const LAYOUT_META: Record<TemplateLayoutId, LayoutMeta> = {
  premier: { label: 'Premier', category: 'professional', columns: 2, family: 'ink', description: 'Flagship executive design with a serif headline, diamond detailing, and a refined two-column body.' },
  modern: { label: 'Sidebar', category: 'modern', columns: 2, family: 'dark', description: 'Dark sidebar with photo, icon contact rows, and skill meters beside a clean content column.' },
  professional: { label: 'Executive', category: 'professional', columns: 2, family: 'panel', description: 'Corporate header band with a title badge, photo rail, icon sections, and boxed certifications.' },
  minimal: { label: 'Minimal', category: 'simple', columns: 1, family: 'ink', description: 'Understated serif heading over a spacious two-column grid focused on your content.' },
  academic: { label: 'Scholar', category: 'academic', columns: 2, family: 'panel', description: 'Structured research-friendly layout with a boxed contact card and detailed main column.' },
  creative: { label: 'Studio', category: 'creative', columns: 2, family: 'panel', description: 'Bold color banner, overlapping portrait, and skill chips for portfolio-driven roles.' },
  ats: { label: 'ATS Classic', category: 'simple', columns: 1, family: 'ink', description: 'Single-column, machine-readable classic that parses perfectly in applicant tracking systems.' },
  timeline: { label: 'Timeline', category: 'modern', columns: 2, family: 'ink', description: 'Career story told on a vertical timeline with milestone dots and a compact side rail.' },
  banner: { label: 'Banner', category: 'professional', columns: 2, family: 'dark', description: 'Full-width dark masthead with portrait and contact strip over balanced twin columns.' },
  duo: { label: 'Duo', category: 'modern', columns: 2, family: 'panel', description: 'Content-first main column with a soft tinted profile rail on the right.' },
  monogram: { label: 'Monogram', category: 'creative', columns: 1, family: 'ink', description: 'Signature monogram block, double hairlines, and outlined skill tags with an editorial feel.' },
  split: { label: 'Split', category: 'creative', columns: 2, family: 'dark', description: 'Two-tone split masthead with star-rated languages and a confident modern grid.' },
  compact: { label: 'Compact', category: 'simple', columns: 1, family: 'ink', description: 'Dense, space-efficient single page with a three-column footer for skills and languages.' },
  elegant: { label: 'Elegant', category: 'academic', columns: 1, family: 'ink', description: 'All-serif centered composition with hairline flourishes, for formal and academic audiences.' },
  ledger: { label: 'Ledger', category: 'professional', columns: 1, family: 'ink', description: 'A full-height accent spine with every section hung off a fixed label gutter — precise and quietly authoritative.' },
  gazette: { label: 'Gazette', category: 'creative', columns: 2, family: 'ink', description: 'Broadsheet masthead, an italic standfirst across the page, then a true three-column editorial body.' },
  aperture: { label: 'Aperture', category: 'creative', columns: 2, family: 'ink', description: 'Full-bleed portrait band with your name set into the scrim, over a tinted contact rail and a balanced body.' },
  facet: { label: 'Facet', category: 'modern', columns: 2, family: 'ink', description: 'Your photograph runs the entire page height down the left, with contact and skills resolving out of the shadow.' },
  halo: { label: 'Halo', category: 'professional', columns: 2, family: 'ink', description: 'Portrait ringed in accent at the centre of a perfectly symmetrical, serif-titled composition.' },
  atrium: { label: 'Atrium', category: 'professional', columns: 2, family: 'ink', description: 'Deep header panel with a framed portrait breaking the seam, over a crisp two-column body.' },
  vista: { label: 'Vista', category: 'creative', columns: 2, family: 'ink', description: 'Wide masthead above a cinematic letterbox portrait strip — editorial and unusually confident.' },
  vertex: { label: 'Vertex', category: 'creative', columns: 2, family: 'dark', description: 'Black stage, oversized display name and a tall gradient portrait panel — bold, modern and impossible to skim past.' },
  meridian: { label: 'Meridian', category: 'professional', columns: 2, family: 'dark', description: 'Deep full-height rail led by a ringed portrait, with a dotted career timeline running down the main column.' },
  crest: { label: 'Crest', category: 'professional', columns: 2, family: 'dark', description: 'Full-width colour masthead with the portrait set into it, an accent contact strip, and a timeline body.' },
  obsidian: { label: 'Obsidian', category: 'modern', columns: 2, family: 'dark', description: 'Near-black rail with a squared portrait and skill meters, beside a bright timeline-driven content column.' },
  solstice: { label: 'Solstice', category: 'creative', columns: 2, family: 'panel', description: 'Portrait above a colour block that carries the name, balanced by a light editorial column.' },
  capsule: { label: 'Capsule', category: 'creative', columns: 2, family: 'ink', description: 'Outlined lozenge section labels and a ringed portrait on warm paper, for design and marketing roles.' },
  marquee: { label: 'Marquee', category: 'professional', columns: 2, family: 'dark', description: 'Solid icon heading bars beside a dark rail of pill labels, for corporate and administrative roles.' },
}

interface Hue {
  id: string
  label: string
  bright: string
  deep: string
  pale: string
  dark: string
  ink: string
}

const HUES: Hue[] = [
  { id: 'gold', label: 'Gold', bright: '#d9a441', deep: '#96702a', pale: '#faf3e3', dark: '#2a2113', ink: '#292018' },
  { id: 'navy', label: 'Navy', bright: '#4f83cc', deep: '#1f3a5f', pale: '#e9f0f8', dark: '#0f1c2e', ink: '#16222f' },
  { id: 'teal', label: 'Teal', bright: '#14b8a6', deep: '#0f766e', pale: '#e6f7f5', dark: '#042f2e', ink: '#113331' },
  { id: 'emerald', label: 'Emerald', bright: '#34d399', deep: '#047857', pale: '#e8f7f0', dark: '#06281c', ink: '#123326' },
  { id: 'indigo', label: 'Indigo', bright: '#818cf8', deep: '#4338ca', pale: '#eef0fd', dark: '#191a3a', ink: '#23244a' },
  { id: 'burgundy', label: 'Burgundy', bright: '#c05f6d', deep: '#8c2f39', pale: '#faeceb', dark: '#2b171a', ink: '#33191d' },
  { id: 'coral', label: 'Coral', bright: '#fb7f5c', deep: '#c2410c', pale: '#fdeee7', dark: '#331410', ink: '#3a1d12' },
  { id: 'slate', label: 'Slate', bright: '#94a3b8', deep: '#475569', pale: '#eef2f6', dark: '#0f172a', ink: '#1e293b' },
  { id: 'plum', label: 'Plum', bright: '#c084fc', deep: '#7e22ce', pale: '#f6eefc', dark: '#2a1038', ink: '#331447' },
  { id: 'olive', label: 'Olive', bright: '#b0bc4a', deep: '#5f6b21', pale: '#f4f6e6', dark: '#20240e', ink: '#272b13' },
  { id: 'cobalt', label: 'Cobalt', bright: '#60a5fa', deep: '#1d4ed8', pale: '#e9f1fe', dark: '#101c3d', ink: '#172554' },
  { id: 'graphite', label: 'Graphite', bright: '#9ca3af', deep: '#374151', pale: '#f3f4f6', dark: '#111827', ink: '#111827' },
]

function paletteFor(family: PaletteFamily, hue: Hue): { accent: string; secondary: string } {
  if (family === 'dark') return { accent: hue.bright, secondary: hue.dark }
  if (family === 'panel') return { accent: hue.deep, secondary: hue.pale }
  return { accent: hue.deep, secondary: hue.ink }
}

// Keep legacy template IDs compatible with saved resumes.
const SIGNATURE_TEMPLATES: TemplateDefinition[] = [
  { id: 'premier', name: 'Premier', description: LAYOUT_META.premier.description, category: 'professional', columns: 2, baseTemplate: 'premier', accent: '#b08d3e', secondary: '#1c2b3a' },
  { id: 'modern', name: 'Indigo Sidebar', description: LAYOUT_META.modern.description, category: 'modern', columns: 2, baseTemplate: 'modern', accent: '#6366f1', secondary: '#0f172a' },
  { id: 'professional', name: 'Sienna Executive', description: LAYOUT_META.professional.description, category: 'professional', columns: 2, baseTemplate: 'professional', accent: '#7b4a2a', secondary: '#f3ebe4' },
  { id: 'minimal', name: 'Pine Minimal', description: LAYOUT_META.minimal.description, category: 'simple', columns: 1, baseTemplate: 'minimal', accent: '#2f7d78', secondary: '#273139' },
  { id: 'academic', name: 'Steel Scholar', description: LAYOUT_META.academic.description, category: 'academic', columns: 2, baseTemplate: 'academic', accent: '#34495e', secondary: '#eaf0f4' },
  { id: 'creative', name: 'Amber Studio', description: LAYOUT_META.creative.description, category: 'creative', columns: 2, baseTemplate: 'creative', accent: '#b45309', secondary: '#fff4e6' },
  { id: 'ats', name: 'ATS Classic', description: LAYOUT_META.ats.description, category: 'simple', columns: 1, baseTemplate: 'ats', accent: '#111827', secondary: '#1f2937' },
  { id: 'premier-slate', name: 'Premier Slate', description: 'The Premier layout in a cool graphite-and-silver palette for understated seniority.', category: 'professional', columns: 2, baseTemplate: 'premier', accent: '#64748b', secondary: '#1e293b' },
  { id: 'premier-burgundy', name: 'Premier Burgundy', description: 'The Premier layout with deep burgundy accents for law, finance, and academia.', category: 'professional', columns: 2, baseTemplate: 'premier', accent: '#8c2f39', secondary: '#2b1d20' },
]

function buildTemplates(): TemplateDefinition[] {
  const layouts = Object.keys(LAYOUT_META) as TemplateLayoutId[]
  const generated: TemplateDefinition[] = []
  // Interleave hues so adjacent gallery cards do not share a palette.
  for (const hue of HUES) {
    for (const layout of layouts) {
      const meta = LAYOUT_META[layout]
      const { accent, secondary } = paletteFor(meta.family, hue)
      generated.push({
        id: `${layout}-${hue.id}`,
        name: `${hue.label} ${meta.label}`,
        description: meta.description,
        category: meta.category,
        columns: meta.columns,
        baseTemplate: layout,
        accent,
        secondary,
      })
    }
  }
  return [...SIGNATURE_TEMPLATES, ...generated]
}

export const TEMPLATES: TemplateDefinition[] = buildTemplates()

// Default gallery colorway for each layout.
export const SHOWCASE_VARIANT: Record<TemplateLayoutId, string> = {
  premier: 'premier',
  modern: 'modern-navy',
  professional: 'professional',
  minimal: 'minimal',
  academic: 'academic',
  creative: 'creative',
  ats: 'ats',
  timeline: 'timeline-cobalt',
  banner: 'banner-slate',
  duo: 'duo-emerald',
  monogram: 'monogram-graphite',
  split: 'split-teal',
  compact: 'compact-navy',
  elegant: 'elegant-burgundy',
  ledger: 'ledger-gold',
  gazette: 'gazette-burgundy',
  aperture: 'aperture-navy',
  facet: 'facet-graphite',
  halo: 'halo-gold',
  atrium: 'atrium-teal',
  vista: 'vista-burgundy',
  vertex: 'vertex-gold',
  meridian: 'meridian-navy',
  crest: 'crest-burgundy',
  obsidian: 'obsidian-coral',
  solstice: 'solstice-cobalt',
  capsule: 'capsule-coral',
  marquee: 'marquee-navy',
}

// Layout names without color prefixes.
export const LAYOUT_LABELS: Record<TemplateLayoutId, string> = Object.fromEntries(
  (Object.keys(LAYOUT_META) as TemplateLayoutId[]).map((id) => [id, LAYOUT_META[id].label])
) as Record<TemplateLayoutId, string>

export const TEMPLATE_CATEGORIES: { id: TemplateCategoryId; label: string }[] = [
  { id: 'all', label: 'All Templates' },
  { id: 'modern', label: 'Modern' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
  { id: 'simple', label: 'Simple' },
  { id: 'academic', label: 'Academic' },
]

export const MAX_UNDO_HISTORY = 50
