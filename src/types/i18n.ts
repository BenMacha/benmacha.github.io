export interface Experience {
  company: string
  period: string
  role: string
  location?: string
  tasks: string[]
  stack?: string
  website?: string
}

export interface Education {
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

export interface Project {
  name: string
  icon: string
  description: string
  tasks?: string[]
  url?: string
  website?: string
}

export interface GithubProject extends Project {
  url: string
}

export interface Category {
  title: string
  items: string[]
}

export interface Interests {
  sports: Category
  associations: Category
}