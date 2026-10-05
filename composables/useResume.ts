/**
 * Typed, locale-reactive access to the resume content stored in the i18n files.
 */
export interface Experience {
  company: string
  period: string
  role: string
  location?: string
  tasks: string[]
  stack: string[]
  website?: string
  /** Successive contracts within the same company (e.g. freelance, then permanent). */
  phases: ExperiencePhase[]
}

export interface ExperiencePhase {
  /** `freelance` is drawn on the yellow branch pipe, `permanent` on the green trunk. */
  kind: 'freelance' | 'permanent'
  label: string
  period: string
  text: string
}

export interface Project {
  name: string
  icon: string
  description: string
  tasks: string[]
  url: string
}

export interface Degree {
  school: string
  type: string
  period: string
  skills: string[]
}

export interface Internship {
  company: string
  period: string
  role: string
  skills: string[]
}

export interface Interest {
  title: string
  items: string[]
}

type Raw = Record<string, any>

export function useResume() {
  const { tm, rt } = useI18n()

  const str = (value: unknown) => (value ? rt(value as any) : undefined)
  const list = (value: unknown) => ((value as unknown[] | undefined) ?? []).map(v => rt(v as any))
  const items = (key: string) => (tm(key) as Raw[] | Raw) ?? []

  const experiences = computed<Experience[]>(() =>
    (items('experience.items') as Raw[]).map(item => ({
      company: rt(item.company),
      period: rt(item.period),
      role: rt(item.role),
      location: str(item.location),
      tasks: list(item.tasks),
      stack: str(item.stack)?.split(', ') ?? [],
      website: str(item.website),
      phases: ((item.phases as Raw[] | undefined) ?? []).map(phase => ({
        kind: rt(phase.kind) as ExperiencePhase['kind'],
        label: rt(phase.label),
        period: rt(phase.period),
        text: rt(phase.text),
      })),
    })),
  )

  const projects = computed<Project[]>(() =>
    (items('projects.github.items') as Raw[]).map(item => ({
      name: rt(item.name),
      icon: rt(item.icon),
      description: rt(item.description),
      tasks: list(item.tasks),
      url: rt(item.url),
    })),
  )

  const education = computed<Degree[]>(() =>
    (items('education.items') as Raw[]).map(item => ({
      school: rt(item.school),
      type: rt(item.type),
      period: rt(item.period),
      skills: list(item.skills),
    })),
  )

  const internships = computed<Internship[]>(() =>
    (items('education.internships.items') as Raw[]).map(item => ({
      company: rt(item.company),
      period: rt(item.period),
      role: rt(item.role),
      skills: list(item.skills),
    })),
  )

  const interests = computed<Interest[]>(() =>
    Object.values(items('education.interests.items') as Raw).map(item => ({
      title: rt(item.title),
      items: list(item.items),
    })),
  )

  return { experiences, projects, education, internships, interests }
}
