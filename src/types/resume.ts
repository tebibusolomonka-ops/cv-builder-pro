export interface PersonalInfo {
  fullName: string
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  linkedin: string
  github: string
  portfolio: string
  website: string
  profilePhoto: string
}

export interface WorkExperience {
  id: string
  title: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  id: string
  school: string
  degree: string
  fieldOfStudy: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  gpa: string
  description: string
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface Project {
  id: string
  name: string
  description: string
  url: string
  startDate: string
  endDate: string
  technologies: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate: string
  url: string
}

export interface Language {
  id: string
  name: string
  proficiency: 'basic' | 'conversational' | 'proficient' | 'fluent' | 'native'
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description: string
}

export interface VolunteerExperience {
  id: string
  organization: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Reference {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  relationship: string
}

export interface ResumeSection {
  id: string
  type: SectionType
  title: string
  visible: boolean
  order: number
}

export type SectionType =
  | 'personalInfo'
  | 'summary'
  | 'workExperience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteer'
  | 'references'
  | 'custom'

export interface ResumeStyle {
  templateId: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  headingFont: string
  bodyFont: string
  fontSize: number // base size in px
  lineHeight: number
  sectionSpacing: number
  pageMargin: number
  showPhoto: boolean
  columns: 1 | 2
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  awards: Award[]
  volunteer: VolunteerExperience[]
  references: Reference[]
  sections: ResumeSection[]
  style: ResumeStyle
}

export const defaultResumeStyle: ResumeStyle = {
  templateId: 'modern',
  primaryColor: '#7c3aed',
  secondaryColor: '#4f46e5',
  accentColor: '#ec4899',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  headingFont: 'Plus Jakarta Sans',
  bodyFont: 'Inter',
  fontSize: 14,
  lineHeight: 1.5,
  sectionSpacing: 24,
  pageMargin: 40,
  showPhoto: true,
  columns: 1,
}

export const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  linkedin: '',
  github: '',
  portfolio: '',
  website: '',
  profilePhoto: '',
}

export const defaultSections: ResumeSection[] = [
  { id: '1', type: 'personalInfo', title: 'Personal Information', visible: true, order: 0 },
  { id: '2', type: 'summary', title: 'Professional Summary', visible: true, order: 1 },
  { id: '3', type: 'workExperience', title: 'Work Experience', visible: true, order: 2 },
  { id: '4', type: 'education', title: 'Education', visible: true, order: 3 },
  { id: '5', type: 'skills', title: 'Skills', visible: true, order: 4 },
  { id: '6', type: 'projects', title: 'Projects', visible: true, order: 5 },
  { id: '7', type: 'certifications', title: 'Certifications', visible: false, order: 6 },
  { id: '8', type: 'languages', title: 'Languages', visible: false, order: 7 },
  { id: '9', type: 'awards', title: 'Awards', visible: false, order: 8 },
  { id: '10', type: 'volunteer', title: 'Volunteer Experience', visible: false, order: 9 },
  { id: '11', type: 'references', title: 'References', visible: false, order: 10 },
]

export const defaultResumeData: ResumeData = {
  personalInfo: defaultPersonalInfo,
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  volunteer: [],
  references: [],
  sections: defaultSections,
  style: defaultResumeStyle,
}
