export interface SkillSection {
  /** i18n key under `skills.*` */
  key: 'backend' | 'frontend' | 'mobile' | 'devops' | 'testing' | 'other'
  skills: string[]
}

export const skillSections: SkillSection[] = [
  { key: 'backend', skills: ['PHP', 'Symfony', 'Laravel', 'Node.js', 'Python', 'MySQL', 'Redis'] },
  { key: 'frontend', skills: ['ReactJS', 'VueJS', 'Ionic Capacitor', 'HTML5/CSS3', 'JavaScript/TypeScript', 'Tailwind CSS'] },
  { key: 'mobile', skills: ['Android (Java/Kotlin)', 'PhoneGap/Cordova', 'Ionic', 'React Native', 'Flutter'] },
  { key: 'devops', skills: ['Docker', 'Jenkins', 'GitHub Actions', 'AWS', 'Linux (Debian/Ubuntu)', 'Nginx/Apache'] },
  { key: 'testing', skills: ['Codeception', 'PHPUnit', 'Jest', 'Cypress', 'Selenium'] },
  { key: 'other', skills: ['Apache Kafka', 'FCM/APNS', 'GraphQL', 'REST APIs', 'WebSockets', 'Git/GitHub'] },
]

/** Skills shown in the home page hotbar. */
export const hotbarSkills = ['PHP', 'Symfony', 'ReactJS', 'VueJS', 'Docker', 'GraphQL', 'Redis', 'Linux (Debian/Ubuntu)', 'Jenkins']

/** Pixel "item" icon for each skill: [abbreviation, brand color]. */
const skillIcons: Record<string, [string, string]> = {
  'PHP': ['PHP', '#777bb4'],
  'Symfony': ['SF', '#f2f2f2'],
  'Laravel': ['LV', '#ff2d20'],
  'Node.js': ['JS', '#5fa04e'],
  'Python': ['PY', '#3776ab'],
  'MySQL': ['SQL', '#00758f'],
  'Redis': ['RDS', '#dc382d'],
  'ReactJS': ['⚛', '#61dafb'],
  'VueJS': ['V', '#42b883'],
  'Ionic Capacitor': ['ION', '#3880ff'],
  'HTML5/CSS3': ['</>', '#e34f26'],
  'JavaScript/TypeScript': ['TS', '#f7df1e'],
  'Tailwind CSS': ['TW', '#38bdf8'],
  'Android (Java/Kotlin)': ['KT', '#3ddc84'],
  'PhoneGap/Cordova': ['CDV', '#4cc2e4'],
  'Ionic': ['ION', '#3880ff'],
  'React Native': ['RN', '#61dafb'],
  'Flutter': ['FL', '#02569b'],
  'Docker': ['🐳', '#2496ed'],
  'Jenkins': ['JK', '#d24939'],
  'GitHub Actions': ['GHA', '#2088ff'],
  'AWS': ['AWS', '#ff9900'],
  'Linux (Debian/Ubuntu)': ['$_', '#fcc624'],
  'Nginx/Apache': ['NGX', '#009639'],
  'Codeception': ['CC', '#9f5de2'],
  'PHPUnit': ['PU', '#3c9cd7'],
  'Jest': ['JST', '#c21325'],
  'Cypress': ['CY', '#69d3a7'],
  'Selenium': ['SE', '#43b02a'],
  'Apache Kafka': ['KFK', '#e8e8e8'],
  'FCM/APNS': ['PSH', '#ffca28'],
  'GraphQL': ['GQL', '#e10098'],
  'REST APIs': ['API', '#00ff41'],
  'WebSockets': ['WS', '#fbd000'],
  'Git/GitHub': ['GIT', '#f05032'],
}

export interface SkillIcon {
  abbr: string
  color: string
  /** Text color with enough contrast on `color`. */
  ink: string
}

function isLight(hex: string): boolean {
  const n = Number.parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 150
}

export function skillIcon(name: string): SkillIcon {
  const [abbr, color] = skillIcons[name] ?? [name.slice(0, 3).toUpperCase(), '#00ff41']
  return { abbr, color, ink: isLight(color) ? '#10132a' : '#fff' }
}
