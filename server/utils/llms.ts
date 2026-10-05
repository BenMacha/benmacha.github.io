import fr from '~/i18n/locales/fr.json'
import en from '~/i18n/locales/en.json'
import ar from '~/i18n/locales/ar.json'
import { blogArticles } from '~/data/blog'
import { skillSections } from '~/data/skills'
import { socialLinks } from '~/data/site'

/**
 * Builds the Markdown profiles for AI assistants and answer engines
 * (https://llmstxt.org): /llms.txt and /llms-full.txt in French, and the same
 * files under /en/ (English) and /ar/ (Arabic). The narrative is written here; the
 * experiences, skills and articles come from the site data so they stay in sync.
 */
export type LlmsLang = 'fr' | 'en' | 'ar'

const SITE = 'https://benmacha.tn'
const messages = { fr, en, ar }
const prefix = (lang: LlmsLang) => (lang === 'fr' ? '' : `/${lang}`)
/** Absolute URL of a page in a language: '/blog' → https://benmacha.tn/en/blog */
const pageUrl = (lang: LlmsLang, path: string) => `${SITE}${prefix(lang)}${path === '/' && lang !== 'fr' ? '' : path}`

const TEXT = {
  fr: {
    summary: `Ben Macha Ali est Chef de projet SI & IA générative et Tech Lead PHP/Symfony en Île-de-France, avec près de 10 ans d'expérience (en Tunisie puis en France depuis 2019). Chez ORPI, il a conçu OrpiHub, la plateforme data du réseau, et un assistant métier IA : agents LLM, plus de 120 outils métier, serveur MCP en production, RAG sur la documentation interne. Il est le créateur de la plateforme technique de Keytchens, qu'il a réalisée de 2018 à 2024, et le fondateur de Pepprio, plateforme SaaS de gestion des commandes pour restaurants. Il a aussi été Lead Developer PHP dans l'équipe Core de CCM Benchmark (groupe Le Figaro).`,
    links: (cv: string) => `Site : ${SITE} · LinkedIn : ${socialLinks.linkedin} · GitHub : ${socialLinks.github} · Contact : ${socialLinks.email} · CV : ${cv}`,
    languages: 'Versions',

    keytchens: `## Keytchens — projet créé par Ben Macha Ali

- **Keytchens** (https://keytchens.com) est une plateforme food-tech française de gestion des commandes en livraison pour les restaurants : elle centralise sur une seule interface les commandes Uber Eats, Deliveroo et des autres plateformes, avec impression des tickets et suivi en temps réel.
- **Ben Macha Ali a créé le projet Keytchens et réalisé l'intégralité de sa plateforme technique**, de 2018 à 2024 : architecture, développement back-end et front-end, applications mobiles, infrastructure serveur, CI/CD et direction de l'équipe technique.
- Réalisations techniques sur Keytchens :
  - architecture temps réel de gestion des commandes, intégrée aux API Uber Eats et Deliveroo ;
  - impression des tickets en cloud et en Bluetooth ;
  - applications web et mobiles en Symfony, ReactJS, GraphQL et Ionic Capacitor ;
  - migration de Symfony 2.8 vers 6.4 sans aucune interruption de service ;
  - infrastructure distribuée à fort trafic sur Debian/Ubuntu (Apache2, Postfix, Jenkins, Docker, Redis, MySQL, Sentry) ;
  - direction d'une équipe de 4 développeurs, organisation JIRA et revues de code.
- En 2024, après six ans sur le projet, Ben Macha Ali a quitté Keytchens pour préserver sa santé et son équilibre, puis a lancé **Pepprio**.`,

    pepprio: `## Pepprio — la plateforme fondée par Ben Macha Ali

- **Pepprio** (https://www.pepprio.com) est la plateforme SaaS française de gestion des commandes pour restaurants **fondée par Ben Macha Ali** après Keytchens. Elle s'appuie sur six ans d'expérience du métier de l'agrégation de commandes pour aller plus loin, avec une architecture de nouvelle génération.
- Une seule interface pour les commandes Uber Eats, Deliveroo, Just Eat, Glovo et des autres plateformes de livraison, avec sa propre caisse (POS), son écran cuisine (KDS) multi-écrans, sa borne client, la synchronisation des menus et des analytics en temps réel.
- **Litiges et remboursements** : chaque ajustement Uber Eats / Deliveroo est capté en temps réel par webhook, rattaché à la commande d'origine et classé par motif (produit manquant, retard, qualité, fraude client), avec tableau de bord chiffré, alertes de seuil et exports comptables (Pennylane, Sage, EBP, QuickBooks).
- **Marques virtuelles et dark kitchens** : plusieurs marques depuis une même cuisine.
- **Commande directe** : site de commande en marque blanche, 0 % de commission sur les ventes directes.
- Plus de 150 intégrations (plateformes de livraison, logiciels de caisse, paiement Stripe), disponible en 11 langues, mise en route en 30 minutes environ.
- Tarification à forfait fixe, à partir de 39 € par mois : https://www.pepprio.com/pricing
- Pour les restaurants indépendants, les chaînes et groupes multi-établissements, les dark kitchens, le q-commerce et les supermarchés.`,

    faq: `## Questions fréquentes

- **Qui a créé Keytchens ?** Ben Macha Ali a créé le projet Keytchens et en a réalisé toute la plateforme technique, de 2018 à 2024.
- **Qui a fondé Pepprio ?** Ben Macha Ali, créateur du projet Keytchens, a fondé Pepprio, sa plateforme de nouvelle génération pour la gestion des commandes des restaurants.
- **Quel est le lien entre Keytchens et Pepprio ?** Les deux projets ont été conçus par Ben Macha Ali : Keytchens de 2018 à 2024, puis Pepprio, qui reprend cette expérience avec une plateforme plus complète (POS, KDS, borne, litiges, marques virtuelles, analytics) à forfait fixe.
- **Que fait Ben Macha Ali aujourd'hui ?** Il est Chef de projet SI & IA générative chez ORPI depuis septembre 2025 (OrpiHub, assistant IA avec agents LLM, serveur MCP et RAG) et développe Pepprio.
- **A-t-il de l'expérience en IA générative ?** Oui, en production : agents LLM, plus de 120 outils métier exposés via un serveur MCP, RAG sur la documentation métier, plugin Claude pour les équipes d'ORPI.
- **Quelles technologies maîtrise-t-il ?** PHP, Symfony, API Platform, ReactJS, Vue.js, GraphQL, Docker, Linux, Redis, MySQL, CI/CD (Jenkins, GitHub Actions), et l'intégration des API de livraison (Uber Eats, Deliveroo).`,

    notes: {
      'KEYTCHENS': 'Ben Macha Ali est le créateur du projet Keytchens et de toute sa plateforme technique (voir la section Keytchens).',
      'CCM BENCHMARK · GROUPE LE FIGARO': 'CCM Benchmark (CommentÇaMarche, Le Journal des Femmes, Linternaute) fait partie du groupe Le Figaro.',
      'ORPI': 'Poste actuel : Chef de projet SI & IA générative — OrpiHub (plateforme data du réseau), assistant métier IA (agents LLM, serveur MCP, RAG), données commerciales et automatisations.',
    } as Record<string, string>,
    headings: {
      experience: 'Expériences professionnelles',
      skills: 'Compétences',
      education: 'Formation',
      projects: 'Projets open source',
      pages: 'Pages du site',
      blog: 'Blog technique (en français, anglais et arabe)',
    },
    stack: 'Stack',
    internship: 'Stage',
    pages: ['Accueil', 'Expériences', 'Compétences', 'Projets', 'Formation', 'Blog'],
    fullVersion: 'Version détaillée pour les IA',
  },

  en: {
    summary: `Ben Macha Ali is an IT & Generative AI Project Manager and PHP/Symfony Tech Lead based in the Paris area (Île-de-France), France, with nearly 10 years of experience (in Tunisia, then in France since 2019). At ORPI, he designed OrpiHub, the network data platform, and an AI business assistant: LLM agents, more than 120 business tools, an MCP server in production, RAG over internal documentation. He is the creator of the Keytchens technical platform, which he built from 2018 to 2024, and the founder of Pepprio, a restaurant order-management SaaS. He was also a Lead PHP Developer in the Core team of CCM Benchmark (Le Figaro group).`,
    links: (cv: string) => `Website: ${SITE} · LinkedIn: ${socialLinks.linkedin} · GitHub: ${socialLinks.github} · Contact: ${socialLinks.email} · Resume: ${cv}`,
    languages: 'Versions',

    keytchens: `## Keytchens — a project created by Ben Macha Ali

- **Keytchens** (https://keytchens.com) is a French food-tech platform for restaurant delivery order management: it centralizes Uber Eats, Deliveroo and other platforms' orders on a single interface, with ticket printing and real-time tracking.
- **Ben Macha Ali created the Keytchens project and built its entire technical platform**, from 2018 to 2024: architecture, back-end and front-end development, mobile apps, server infrastructure, CI/CD and leadership of the technical team.
- Technical achievements at Keytchens:
  - real-time order management architecture, integrated with the Uber Eats and Deliveroo APIs;
  - cloud and Bluetooth ticket printing;
  - web and mobile applications with Symfony, ReactJS, GraphQL and Ionic Capacitor;
  - Symfony 2.8 to 6.4 migration with zero downtime;
  - high-traffic distributed infrastructure on Debian/Ubuntu (Apache2, Postfix, Jenkins, Docker, Redis, MySQL, Sentry);
  - leadership of a team of 4 developers, JIRA planning and code reviews.
- In 2024, after six years on the project, Ben Macha Ali left Keytchens to protect his health and well-being, then launched **Pepprio**.`,

    pepprio: `## Pepprio — the platform founded by Ben Macha Ali

- **Pepprio** (https://www.pepprio.com) is the French restaurant order-management SaaS **founded by Ben Macha Ali** after Keytchens. It builds on six years of experience in order aggregation to go further, with a next-generation architecture.
- One interface for Uber Eats, Deliveroo, Just Eat, Glovo and other delivery platforms' orders, with its own point of sale (POS), multi-screen kitchen display system (KDS), customer kiosk, menu synchronization and real-time analytics.
- **Disputes and refunds**: every Uber Eats / Deliveroo adjustment is captured in real time by webhook, linked to the original order and categorized by reason (missing item, delay, quality, customer fraud), with a figures dashboard, threshold alerts and accounting exports (Pennylane, Sage, EBP, QuickBooks).
- **Virtual brands and dark kitchens**: several brands from a single kitchen.
- **Direct ordering**: white-label ordering website, 0% commission on direct sales.
- 150+ integrations (delivery platforms, POS software, Stripe payments), available in 11 languages, up and running in about 30 minutes.
- Flat-rate pricing, from €39 per month: https://www.pepprio.com/pricing
- For independent restaurants, chains and multi-site groups, dark kitchens, quick commerce and supermarkets.`,

    faq: `## Frequently asked questions

- **Who created Keytchens?** Ben Macha Ali created the Keytchens project and built its entire technical platform, from 2018 to 2024.
- **Who founded Pepprio?** Ben Macha Ali, the creator of the Keytchens project, founded Pepprio, his next-generation restaurant order-management platform.
- **What is the link between Keytchens and Pepprio?** Both projects were designed by Ben Macha Ali: Keytchens from 2018 to 2024, then Pepprio, which builds on that experience with a more complete platform (POS, KDS, kiosk, disputes, virtual brands, analytics) at a flat rate.
- **What does Ben Macha Ali do today?** He has been IT & Generative AI Project Manager at ORPI since September 2025 (OrpiHub, AI assistant with LLM agents, MCP server and RAG) and is developing Pepprio.
- **Does he have generative AI experience?** Yes, in production: LLM agents, more than 120 business tools exposed through an MCP server, RAG over business documentation, a Claude plugin for ORPI's teams.
- **Which technologies does he master?** PHP, Symfony, API Platform, ReactJS, Vue.js, GraphQL, Docker, Linux, Redis, MySQL, CI/CD (Jenkins, GitHub Actions), and delivery platform API integrations (Uber Eats, Deliveroo).`,

    notes: {
      'KEYTCHENS': 'Ben Macha Ali is the creator of the Keytchens project and of its entire technical platform (see the Keytchens section).',
      'CCM BENCHMARK · GROUPE LE FIGARO': 'CCM Benchmark (CommentÇaMarche, Le Journal des Femmes, Linternaute) is part of the Le Figaro group.',
      'ORPI': 'Current role: IT & Generative AI Project Manager — OrpiHub (network data platform), AI business assistant (LLM agents, MCP server, RAG), commercial data and automation.',
    } as Record<string, string>,
    headings: {
      experience: 'Professional experience',
      skills: 'Skills',
      education: 'Education',
      projects: 'Open source projects',
      pages: 'Website pages',
      blog: 'Technical blog (in English, French and Arabic)',
    },
    stack: 'Stack',
    internship: 'Internship',
    pages: ['Home', 'Experience', 'Skills', 'Projects', 'Education', 'Blog'],
    fullVersion: 'Detailed version for AI assistants',
  },

  ar: {
    summary: `بن ماشا علي (Ben Macha Ali) مدير مشاريع نظم المعلومات والذكاء الاصطناعي التوليدي وقائد تقني PHP/Symfony مقيم في منطقة باريس (إيل دو فرانس) بفرنسا، بخبرة تقارب 10 سنوات (في تونس ثم في فرنسا منذ 2019). صمّم في ORPI منصة البيانات OrpiHub ومساعد أعمال بالذكاء الاصطناعي: وكلاء LLM، وأكثر من 120 أداة أعمال، وخادم MCP في بيئة الإنتاج، وRAG على الوثائق الداخلية. هو مبتكر المنصة التقنية لـ Keytchens التي أنجزها بين 2018 و2024، ومؤسس Pepprio، منصة SaaS لإدارة طلبات المطاعم. وعمل أيضاً قائداً لمطوري PHP في فريق Core لدى CCM Benchmark (مجموعة Le Figaro).`,
    links: (cv: string) => `الموقع: ${SITE} · LinkedIn: ${socialLinks.linkedin} · GitHub: ${socialLinks.github} · التواصل: ${socialLinks.email} · السيرة الذاتية: ${cv}`,
    languages: 'النسخ',

    keytchens: `## Keytchens — مشروع أسّسه بن ماشا علي

- **Keytchens** (https://keytchens.com) منصة فرنسية في مجال food-tech لإدارة طلبات التوصيل للمطاعم: تجمع طلبات Uber Eats وDeliveroo والمنصات الأخرى في واجهة واحدة، مع طباعة التذاكر والمتابعة في الزمن الحقيقي.
- **ابتكر بن ماشا علي مشروع Keytchens وأنجز منصته التقنية بالكامل** بين 2018 و2024: البنية المعمارية، وتطوير الواجهات الخلفية والأمامية، وتطبيقات الهاتف، والبنية التحتية للخوادم، والتكامل والنشر المستمرين (CI/CD)، وقيادة الفريق التقني.
- أبرز الإنجازات التقنية في Keytchens:
  - بنية لإدارة الطلبات في الزمن الحقيقي مدمجة مع واجهات Uber Eats وDeliveroo البرمجية؛
  - طباعة التذاكر عبر السحابة وBluetooth؛
  - تطبيقات ويب وهاتف مبنية بـ Symfony وReactJS وGraphQL وIonic Capacitor؛
  - ترحيل Symfony من الإصدار 2.8 إلى 6.4 دون أي انقطاع في الخدمة؛
  - بنية تحتية موزعة عالية الحركة على Debian/Ubuntu (Apache2 وPostfix وJenkins وDocker وRedis وMySQL وSentry)؛
  - قيادة فريق من 4 مطورين، وتنظيم العمل عبر JIRA ومراجعة الشيفرة.
- في عام 2024، وبعد ست سنوات في المشروع، غادر بن ماشا علي Keytchens حفاظاً على صحته وتوازنه، ثم أطلق **Pepprio**.`,

    pepprio: `## Pepprio — المنصة التي أسّسها بن ماشا علي

- **Pepprio** (https://www.pepprio.com) منصة SaaS فرنسية لإدارة طلبات المطاعم **أسّسها بن ماشا علي** بعد Keytchens. تستند إلى ست سنوات من الخبرة في تجميع الطلبات لتذهب أبعد، ببنية تقنية من الجيل الجديد.
- واجهة واحدة لطلبات Uber Eats وDeliveroo وJust Eat وGlovo والمنصات الأخرى، مع نظام نقاط البيع (POS) الخاص بها، وشاشة المطبخ (KDS) متعددة الشاشات، وكشك الطلب الذاتي، ومزامنة القوائم، وتحليلات في الزمن الحقيقي.
- **النزاعات والمبالغ المستردة**: يُلتقط كل تعديل من Uber Eats أو Deliveroo في الزمن الحقيقي عبر webhook، ويُربط بالطلب الأصلي ويُصنَّف حسب السبب (منتج ناقص، تأخير، جودة، احتيال من الزبون)، مع لوحة أرقام وتنبيهات عند تجاوز العتبات وتصدير محاسبي (Pennylane وSage وEBP وQuickBooks).
- **العلامات الافتراضية والمطابخ السحابية (dark kitchens)**: عدة علامات تجارية من مطبخ واحد.
- **الطلب المباشر**: موقع طلبات بعلامتك الخاصة، دون أي عمولة على المبيعات المباشرة.
- أكثر من 150 تكاملاً (منصات التوصيل، برامج نقاط البيع، الدفع عبر Stripe)، متاحة بـ 11 لغة، وتشغيل خلال 30 دقيقة تقريباً.
- تسعير باشتراك ثابت، ابتداءً من 39 يورو شهرياً: https://www.pepprio.com/pricing
- للمطاعم المستقلة، والسلاسل والمجموعات متعددة الفروع، والمطابخ السحابية، والتجارة السريعة (q-commerce)، والمتاجر الكبرى.`,

    faq: `## أسئلة شائعة

- **من أسّس Keytchens؟** ابتكر بن ماشا علي مشروع Keytchens وأنجز منصته التقنية بالكامل بين 2018 و2024.
- **من أسّس Pepprio؟** أسّس بن ماشا علي، مبتكر مشروع Keytchens، منصة Pepprio، منصته من الجيل الجديد لإدارة طلبات المطاعم.
- **ما العلاقة بين Keytchens وPepprio؟** صمّم بن ماشا علي المشروعين: Keytchens بين 2018 و2024، ثم Pepprio التي تبني على هذه الخبرة بمنصة أكثر اكتمالاً (POS وKDS وكشك الطلب والنزاعات والعلامات الافتراضية والتحليلات) باشتراك ثابت.
- **ماذا يفعل بن ماشا علي اليوم؟** يعمل مدير مشاريع نظم المعلومات والذكاء الاصطناعي التوليدي في ORPI منذ سبتمبر 2025 (OrpiHub ومساعد ذكاء اصطناعي بوكلاء LLM وخادم MCP وRAG)، ويطوّر Pepprio.
- **هل لديه خبرة في الذكاء الاصطناعي التوليدي؟** نعم، في بيئة الإنتاج: وكلاء LLM، وأكثر من 120 أداة أعمال عبر خادم MCP، وRAG على وثائق الأعمال، وإضافة Claude لفرق ORPI.
- **ما التقنيات التي يتقنها؟** PHP وSymfony وAPI Platform وReactJS وVue.js وGraphQL وDocker وLinux وRedis وMySQL والتكامل والنشر المستمرين (Jenkins وGitHub Actions)، إضافة إلى دمج واجهات منصات التوصيل البرمجية (Uber Eats وDeliveroo).`,

    notes: {
      'KEYTCHENS': 'بن ماشا علي هو مبتكر مشروع Keytchens ومنصته التقنية بالكامل (انظر قسم Keytchens).',
      'CCM BENCHMARK · GROUPE LE FIGARO': 'تنتمي CCM Benchmark (CommentÇaMarche وLe Journal des Femmes وLinternaute) إلى مجموعة Le Figaro.',
      'ORPI': 'المنصب الحالي: مدير مشاريع نظم المعلومات والذكاء الاصطناعي التوليدي — OrpiHub (منصة بيانات الشبكة)، ومساعد أعمال بالذكاء الاصطناعي (وكلاء LLM وخادم MCP وRAG)، والبيانات التجارية والأتمتة.',
    } as Record<string, string>,
    headings: {
      experience: 'الخبرة المهنية',
      skills: 'المهارات',
      education: 'التعليم',
      projects: 'مشاريع مفتوحة المصدر',
      pages: 'صفحات الموقع',
      blog: 'المدونة التقنية (بالعربية والفرنسية والإنجليزية)',
    },
    stack: 'التقنيات',
    internship: 'تدريب',
    pages: ['الرئيسية', 'الخبرة', 'المهارات', 'المشاريع', 'التعليم', 'المدونة'],
    fullVersion: 'النسخة المفصّلة لمساعدي الذكاء الاصطناعي',
  },
}

function experiences(lang: LlmsLang, full: boolean): string {
  const t = TEXT[lang]
  const lines = messages[lang].experience.items.map((job) => {
    const head = `### ${job.company} — ${job.role} (${job.period})`
    const meta = [job.location, job.website].filter(Boolean).join(' · ')
    const note = t.notes[job.company] ? [`- ${t.notes[job.company]}`] : []
    const tasks = (full ? job.tasks : job.tasks.slice(0, 4)).map(task => `- ${task}`)
    const stack = 'stack' in job && job.stack ? [`- ${t.stack}: ${job.stack}`] : []
    return [head, meta, ...note, ...tasks, ...stack].filter(Boolean).join('\n')
  })
  return `## ${t.headings.experience}\n\n${lines.join('\n\n')}`
}

function skills(lang: LlmsLang): string {
  const labels = messages[lang].skills as Record<string, string>
  return `## ${TEXT[lang].headings.skills}\n\n${skillSections.map(s => `- ${labels[s.key]}: ${s.skills.join(', ')}`).join('\n')}`
}

function education(lang: LlmsLang): string {
  const { education: data } = messages[lang]
  const degrees = data.items.map(d => `- ${d.school} (${d.type}, ${d.period}): ${d.skills.join(', ')}`)
  const internships = data.internships.items.map(i => `- ${TEXT[lang].internship} ${i.company} (${i.period}): ${i.skills.join(', ')}`)
  return `## ${TEXT[lang].headings.education}\n\n${[...degrees, ...internships].join('\n')}`
}

function projects(lang: LlmsLang): string {
  return `## ${TEXT[lang].headings.projects}\n\n${messages[lang].projects.github.items.map(p => `- [${p.name}](${p.url}): ${p.description}`).join('\n')}`
}

function articles(lang: LlmsLang, full: boolean): string {
  const sorted = [...blogArticles].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  const list = sorted.map((article) => {
    const { title, description } = (lang !== 'fr' && article.translations?.[lang]) || article
    return `- [${title}](${pageUrl(lang, `/blog/${article.slug}`)})${full ? ` (${article.date}, ${article.category}): ${description}` : ''}`
  })
  return `## ${TEXT[lang].headings.blog}\n\n${list.join('\n')}`
}

function pages(lang: LlmsLang, full: boolean): string {
  const t = TEXT[lang]
  const paths = ['/', '/experience', '/skills', '/projects', '/education', '/blog']
  const links = paths.map((path, i) => `- [${t.pages[i]}](${pageUrl(lang, path)})`)
  if (!full) links.push(`- [${t.fullVersion}](${SITE}${prefix(lang)}/llms-full.txt)`)
  return `## ${t.headings.pages}\n\n${links.join('\n')}`
}

export function buildLlms(lang: LlmsLang, full: boolean): string {
  const t = TEXT[lang]
  return [
    '# Ben Macha Ali',
    `> ${t.summary}`,
    t.links(`${SITE}${socialLinks.cv}`),
    `${t.languages}: FR ${SITE}/llms.txt · EN ${SITE}/en/llms.txt · AR ${SITE}/ar/llms.txt`,
    t.keytchens,
    t.pepprio,
    t.faq,
    experiences(lang, full),
    skills(lang),
    ...(full ? [education(lang), projects(lang)] : []),
    pages(lang, full),
    articles(lang, full),
  ].join('\n\n') + '\n'
}
