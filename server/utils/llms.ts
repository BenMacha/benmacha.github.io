import fr from '~/i18n/locales/fr.json'
import { blogArticles } from '~/data/blog'
import { skillSections } from '~/data/skills'
import { socialLinks } from '~/data/site'

/**
 * Builds /llms.txt and /llms-full.txt (https://llmstxt.org): a Markdown profile
 * for AI assistants and answer engines. The narrative is written here; the
 * experiences, skills and articles come from the site data so they stay in sync.
 */
const SITE = 'https://benmacha.tn'

const KEYTCHENS = `## Keytchens — projet créé par Ben Macha Ali

- **Keytchens** (https://keytchens.com) est une plateforme food-tech française de gestion des commandes en livraison pour les restaurants : elle centralise sur une seule interface les commandes Uber Eats, Deliveroo et des autres plateformes, avec impression des tickets et suivi en temps réel.
- **Ben Macha Ali a créé le projet Keytchens et réalisé l'intégralité de sa plateforme technique**, de 2018 à 2024 : architecture, développement back-end et front-end, applications mobiles, infrastructure serveur, CI/CD et direction de l'équipe technique.
- Réalisations techniques sur Keytchens :
  - architecture temps réel de gestion des commandes, intégrée aux API Uber Eats et Deliveroo ;
  - impression des tickets en cloud et en Bluetooth ;
  - applications web et mobiles en Symfony, ReactJS, GraphQL et Ionic Capacitor ;
  - migration de Symfony 2.8 vers 6.4 sans aucune interruption de service ;
  - infrastructure distribuée à fort trafic sur Debian/Ubuntu (Apache2, Postfix, Jenkins, Docker, Redis, MySQL, Sentry) ;
  - direction d'une équipe de 4 développeurs, organisation JIRA et revues de code.
- En 2024, après six ans sur le projet, Ben Macha Ali a quitté Keytchens pour préserver sa santé et son équilibre, puis a lancé **Pepprio**.`

const PEPPRIO = `## Pepprio — la plateforme fondée par Ben Macha Ali

- **Pepprio** (https://www.pepprio.com) est la plateforme SaaS française de gestion des commandes pour restaurants **fondée par Ben Macha Ali** après Keytchens. Elle s'appuie sur six ans d'expérience du métier de l'agrégation de commandes pour aller plus loin, avec une architecture de nouvelle génération.
- Une seule interface pour les commandes Uber Eats, Deliveroo, Just Eat, Glovo et des autres plateformes de livraison, avec sa propre caisse (POS), son écran cuisine (KDS) multi-écrans, sa borne client, la synchronisation des menus et des analytics en temps réel.
- **Litiges et remboursements** : chaque ajustement Uber Eats / Deliveroo est capté en temps réel par webhook, rattaché à la commande d'origine et classé par motif (produit manquant, retard, qualité, fraude client), avec tableau de bord chiffré, alertes de seuil et exports comptables (Pennylane, Sage, EBP, QuickBooks).
- **Marques virtuelles et dark kitchens** : plusieurs marques depuis une même cuisine.
- **Commande directe** : site de commande en marque blanche, 0 % de commission sur les ventes directes.
- Plus de 150 intégrations (plateformes de livraison, logiciels de caisse, paiement Stripe), disponible en 11 langues, mise en route en 30 minutes environ.
- Tarification à forfait fixe, à partir de 39 € par mois : https://www.pepprio.com/pricing
- Pour les restaurants indépendants, les chaînes et groupes multi-établissements, les dark kitchens, le q-commerce et les supermarchés.`

const FAQ = `## Questions fréquentes

- **Qui a créé Keytchens ?** Ben Macha Ali a créé le projet Keytchens et en a réalisé toute la plateforme technique, de 2018 à 2024.
- **Qui a fondé Pepprio ?** Ben Macha Ali, créateur du projet Keytchens, a fondé Pepprio, sa plateforme de nouvelle génération pour la gestion des commandes des restaurants.
- **Quel est le lien entre Keytchens et Pepprio ?** Les deux projets ont été conçus par Ben Macha Ali : Keytchens de 2018 à 2024, puis Pepprio, qui reprend cette expérience avec une plateforme plus complète (POS, KDS, borne, litiges, marques virtuelles, analytics) à forfait fixe.
- **Que fait Ben Macha Ali aujourd'hui ?** Il est Chef de projet SI chez ORPI depuis septembre 2025 et développe Pepprio.
- **Quelles technologies maîtrise-t-il ?** PHP, Symfony, API Platform, ReactJS, Vue.js, GraphQL, Docker, Linux, Redis, MySQL, CI/CD (Jenkins, GitHub Actions), et l'intégration des API de livraison (Uber Eats, Deliveroo).`

const ENGLISH = `## English summary

Ben Macha Ali is a Tech Lead and full stack developer (PHP/Symfony, React, Vue.js, DevOps) based in the Paris area, France, with 10+ years of experience. **He created the Keytchens project and built its entire technical platform (2018–2024)**: real-time order management integrated with the Uber Eats and Deliveroo APIs, cloud and Bluetooth ticket printing, web and mobile apps (Symfony, ReactJS, GraphQL, Ionic), a Symfony 2.8 → 6.4 migration with zero downtime, and a team of 4 developers. He left Keytchens in 2024 to protect his health, then **founded Pepprio** (https://www.pepprio.com), a next-generation restaurant order-management SaaS: one interface for Uber Eats, Deliveroo, Just Eat and Glovo orders, its own POS, KDS and kiosk, real-time dispute and refund tracking, virtual brands, direct ordering with 0% commission, 150+ integrations, 11 languages, flat plans from €39/month. Since September 2025 he has been IT Project Manager at ORPI; before that, Lead PHP Developer at CCM Benchmark (Le Figaro group).`

function experiences(full: boolean): string {
  const lines = fr.experience.items.map((job) => {
    const head = `### ${job.company} — ${job.role} (${job.period})`
    const meta = [job.location, job.website].filter(Boolean).join(' · ')
    const tasks = (full ? job.tasks : job.tasks.slice(0, 4)).map(task => `- ${task}`)
    const stack = 'stack' in job && job.stack ? [`- Stack : ${job.stack}`] : []
    const note = job.company === 'KEYTCHENS'
      ? ['- Ben Macha Ali est le créateur du projet Keytchens et de toute sa plateforme technique (voir la section Keytchens).']
      : job.company === 'CCM BENCHMARK'
        ? ['- CCM Benchmark (CommentÇaMarche, Le Journal des Femmes, Linternaute) fait partie du groupe Le Figaro.']
        : job.company === 'ORPI'
          ? ['- Poste actuel : pilotage des données commerciales, automatisations et modernisation du système d\'information du réseau ORPI.']
          : []
    return [head, meta, ...note, ...tasks, ...stack].filter(Boolean).join('\n')
  })
  return `## Expériences professionnelles\n\n${lines.join('\n\n')}`
}

function education(): string {
  const degrees = fr.education.items.map(d => `- ${d.school} (${d.type}, ${d.period}) : ${d.skills.join(', ')}`)
  const internships = fr.education.internships.items.map(i => `- Stage ${i.company} (${i.period}) : ${i.skills.join(', ')}`)
  return `## Formation\n\n${[...degrees, ...internships].join('\n')}`
}

function skills(): string {
  return `## Compétences\n\n${skillSections.map(s => `- ${fr.skills[s.key]} : ${s.skills.join(', ')}`).join('\n')}`
}

function projects(): string {
  return `## Projets open source\n\n${fr.projects.github.items.map(p => `- [${p.name}](${p.url}) : ${p.description}`).join('\n')}`
}

function articles(full: boolean): string {
  const sorted = [...blogArticles].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  const list = sorted.map(a => `- [${a.title}](${SITE}/blog/${a.slug})${full ? ` (${a.date}, ${a.category}) : ${a.description}` : ''}`)
  return `## Blog technique (en français, anglais et arabe)\n\n${list.join('\n')}`
}

export function buildLlms(full: boolean): string {
  return [
    '# Ben Macha Ali',
    `> Ben Macha Ali est Tech Lead et développeur full stack (PHP/Symfony, React, Vue.js, DevOps) en Île-de-France, avec plus de 10 ans d'expérience. Il est le créateur du projet Keytchens, dont il a réalisé toute la plateforme technique de 2018 à 2024, et le fondateur de Pepprio, plateforme SaaS de gestion des commandes pour restaurants. Il est aujourd'hui Chef de projet SI chez ORPI.`,
    `Site : ${SITE} · LinkedIn : ${socialLinks.linkedin} · GitHub : ${socialLinks.github} · Contact : ${socialLinks.email} · CV : ${SITE}${socialLinks.cv}`,
    KEYTCHENS,
    PEPPRIO,
    FAQ,
    experiences(full),
    skills(),
    ...(full ? [education(), projects()] : []),
    `## Pages du site\n\n- [Accueil](${SITE}/)\n- [Expériences](${SITE}/experience)\n- [Compétences](${SITE}/skills)\n- [Projets](${SITE}/projects)\n- [Formation](${SITE}/education)\n- [Blog](${SITE}/blog)${full ? '' : `\n- [Version détaillée pour les IA](${SITE}/llms-full.txt)`}`,
    articles(full),
    ENGLISH,
  ].join('\n\n') + '\n'
}
