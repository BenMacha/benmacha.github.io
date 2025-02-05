import { 
  Server, 
  Layout, 
  Smartphone, 
  Container, 
  TestTube2,
  Network
} from 'lucide-vue-next'

export const skillSections = [
  {
    title: 'backend',
    icon: Server,
    skills: ['PHP', 'Symfony', 'Laravel', 'Node.js', 'Python', 'MySQL', 'Redis']
  },
  {
    title: 'frontend',
    icon: Layout,
    skills: ['ReactJS', 'VueJS', 'Ionic Capacitor', 'HTML5/CSS3', 'JavaScript/TypeScript', 'Tailwind CSS']
  },
  {
    title: 'mobile',
    icon: Smartphone,
    skills: ['Android (Java/Kotlin)', 'PhoneGap/Cordova', 'Ionic', 'React Native', 'Flutter']
  },
  {
    title: 'devops',
    icon: Container,
    skills: ['Docker', 'Jenkins', 'GitHub Actions', 'AWS', 'Linux (Debian/Ubuntu)', 'Nginx/Apache']
  },
  {
    title: 'testing',
    icon: TestTube2,
    skills: ['Codeception', 'PHPUnit', 'Jest', 'Cypress', 'Selenium']
  },
  {
    title: 'other',
    icon: Network,
    skills: ['Apache Kafka', 'FCM/APNS', 'GraphQL', 'REST APIs', 'WebSockets', 'Git/GitHub']
  }
]

export const socialLinks = {
  github: 'https://github.com/BenMacha',
  linkedin: 'https://www.linkedin.com/in/ben-mecha-ali',
  email: 'contact@benmacha.tn',
  website: 'https://benmacha.tn'
}