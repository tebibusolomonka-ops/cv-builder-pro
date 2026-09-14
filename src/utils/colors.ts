export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function adjustBrightness(hex: string, amount: number): string {
  hex = hex.replace('#', '')
  const num = parseInt(hex, 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount))
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

export const presetPalettes = [
  { name: 'Royal Purple', primary: '#7c3aed', secondary: '#4f46e5', accent: '#ec4899' },
  { name: 'Ocean Blue', primary: '#2563eb', secondary: '#0ea5e9', accent: '#06b6d4' },
  { name: 'Emerald', primary: '#059669', secondary: '#10b981', accent: '#34d399' },
  { name: 'Sunset', primary: '#f97316', secondary: '#ef4444', accent: '#f59e0b' },
  { name: 'Rose', primary: '#e11d48', secondary: '#f43f5e', accent: '#fb7185' },
  { name: 'Slate', primary: '#475569', secondary: '#64748b', accent: '#94a3b8' },
  { name: 'Teal', primary: '#0d9488', secondary: '#14b8a6', accent: '#2dd4bf' },
  { name: 'Indigo', primary: '#4f46e5', secondary: '#6366f1', accent: '#818cf8' },
]

export const fontPairs = [
  { heading: 'Plus Jakarta Sans', body: 'Inter', label: 'Modern' },
  { heading: 'Playfair Display', body: 'Source Sans 3', label: 'Elegant' },
  { heading: 'Poppins', body: 'Open Sans', label: 'Clean' },
  { heading: 'Montserrat', body: 'Lato', label: 'Professional' },
  { heading: 'Raleway', body: 'Nunito', label: 'Soft' },
  { heading: 'Roboto Slab', body: 'Roboto', label: 'Classic' },
]
