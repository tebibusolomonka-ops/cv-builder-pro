// GENERATED FILE -- do not edit by hand.
// Produced by scripts/derive-template-fields.mjs from the renderer source, so
// it cannot drift from what the templates actually print. Re-run that script
// after adding or changing a layout.

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
export const LAYOUT_FIELDS: Record<TemplateLayoutId, ResumeFieldKey[]> = {
  premier: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "projects",
    "references",
    "skills",
    "summary",
    "website"
  ],
  modern: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "photo",
    "projects",
    "references",
    "skills",
    "summary",
    "website"
  ],
  professional: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "photo",
    "projects",
    "references",
    "skills",
    "summary",
    "website"
  ],
  minimal: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "projects",
    "skills",
    "summary",
    "website"
  ],
  academic: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "photo",
    "projects",
    "references",
    "skills",
    "summary",
    "website"
  ],
  creative: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "photo",
    "projects",
    "skills",
    "summary",
    "website"
  ],
  ats: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "skills",
    "summary",
    "website"
  ],
  timeline: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "skills",
    "summary",
    "website"
  ],
  banner: [
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  duo: [
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "photo",
    "projects",
    "references",
    "skills",
    "summary",
    "website"
  ],
  monogram: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "skills",
    "summary",
    "website"
  ],
  split: [
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "projects",
    "references",
    "skills",
    "summary",
    "website"
  ],
  compact: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "skills",
    "summary",
    "website"
  ],
  elegant: [
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "skills",
    "summary",
    "website"
  ],
  ledger: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "references",
    "skills",
    "summary",
    "website"
  ],
  gazette: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "projects",
    "skills",
    "summary",
    "website"
  ],
  aperture: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "photo",
    "projects",
    "skills",
    "summary",
    "website"
  ],
  facet: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  halo: [
    "certifications",
    "education",
    "experience",
    "github",
    "languages",
    "linkedin",
    "photo",
    "skills",
    "summary",
    "website"
  ],
  atrium: [
    "certifications",
    "education",
    "experience",
    "languages",
    "linkedin",
    "photo",
    "references",
    "skills",
    "summary"
  ],
  vista: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "projects",
    "skills",
    "summary",
    "website"
  ],
  vertex: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary"
  ],
  meridian: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  crest: [
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  obsidian: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary"
  ],
  solstice: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary"
  ],
  capsule: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  marquee: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  bureau: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "skills",
    "summary",
    "website"
  ],
  terminal: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  gauge: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  tagged: [
    "certifications",
    "education",
    "experience",
    "languages",
    "projects",
    "skills",
    "summary",
    "website"
  ],
  placard: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  regent: [
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  signature: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  corner: [
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  dossier: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "projects",
    "references",
    "skills",
    "summary",
    "website"
  ],
  pillar: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  bulletin: [
    "certifications",
    "education",
    "experience",
    "languages",
    "linkedin",
    "photo",
    "skills",
    "summary",
    "website"
  ],
  quill: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  rosette: [
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  bloom: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  column: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary",
    "website"
  ],
  alcove: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary"
  ],
  tablet: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary"
  ],
  gutter: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "references",
    "skills",
    "summary"
  ],
  billboard: [
    "certifications",
    "education",
    "experience",
    "photo",
    "skills",
    "summary"
  ],
  verdant: [
    "education",
    "experience",
    "languages",
    "photo",
    "skills",
    "summary",
    "website"
  ],
  envoy: [
    "certifications",
    "education",
    "experience",
    "languages",
    "linkedin",
    "references",
    "skills",
    "summary",
    "website"
  ],
  ribbon: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "skills",
    "summary"
  ],
  lattice: [
    "certifications",
    "education",
    "experience",
    "languages",
    "photo",
    "skills",
    "summary"
  ]
}

/** The order each layout reads in, used to order the form to match. */
export const LAYOUT_SECTION_ORDER: Record<TemplateLayoutId, FormSectionId[]> = {
  premier: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  modern: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  professional: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  minimal: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  academic: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  creative: [
    "summary",
    "experience",
    "extras",
    "skills",
    "education"
  ],
  ats: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  timeline: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  banner: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  duo: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  monogram: [
    "summary",
    "experience",
    "skills",
    "education",
    "extras"
  ],
  split: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  compact: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  elegant: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  ledger: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  gazette: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  aperture: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  facet: [
    "summary",
    "experience",
    "skills",
    "extras",
    "education"
  ],
  halo: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  atrium: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  vista: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  vertex: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  meridian: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  crest: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  obsidian: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  solstice: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  capsule: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  marquee: [
    "summary",
    "experience",
    "education",
    "extras",
    "skills"
  ],
  bureau: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  terminal: [
    "summary",
    "experience",
    "skills",
    "education",
    "extras"
  ],
  gauge: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  tagged: [
    "summary",
    "experience",
    "skills",
    "extras",
    "education"
  ],
  placard: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  regent: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  signature: [
    "summary",
    "experience",
    "extras",
    "skills",
    "education"
  ],
  corner: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  dossier: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  pillar: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  bulletin: [
    "summary",
    "experience",
    "extras",
    "skills",
    "education"
  ],
  quill: [
    "summary",
    "experience",
    "extras",
    "skills",
    "education"
  ],
  rosette: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  bloom: [
    "summary",
    "experience",
    "extras",
    "skills",
    "education"
  ],
  column: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  alcove: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  tablet: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  gutter: [
    "summary",
    "experience",
    "extras",
    "education",
    "skills"
  ],
  billboard: [
    "summary",
    "experience",
    "education",
    "extras",
    "skills"
  ],
  verdant: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  envoy: [
    "summary",
    "experience",
    "education",
    "extras",
    "skills"
  ],
  ribbon: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ],
  lattice: [
    "summary",
    "experience",
    "education",
    "skills",
    "extras"
  ]
}
