export type ArticleLocale = 'fr' | 'en' | 'ar'

export interface ArticleSummary {
  title: string
  description: string
}

/**
 * Blog article metadata. The body of each article lives in
 * data/articles/<slug>/<locale>.html (fr.html is the original) and is loaded
 * on demand, so pages that only list articles don't ship their content.
 */
export interface BlogArticle extends ArticleSummary {
  slug: string
  category: string
  date: string
  readTime: string
  tags: string[]
  /** Translated title/description; an <locale>.html body should exist alongside. */
  translations?: Partial<Record<Exclude<ArticleLocale, 'fr'>, ArticleSummary>>
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'docker-multi-stage-builds',
    title: 'Builds Docker multi-stage pour PHP',
    description: 'Optimisez vos images Docker PHP grâce aux builds multi-stage pour réduire la taille et améliorer la sécurité.',
    category: 'Docker',
    date: '15 Jan 2024',
    readTime: '7 min',
    tags: ['Docker', 'PHP', 'Optimisation'],
    translations: {
      en: { title: 'Multi-stage Docker builds for PHP', description: 'Optimize your PHP Docker images with multi-stage builds to reduce their size and improve security.' },
      ar: { title: 'البناء متعدد المراحل في Docker لتطبيقات PHP', description: 'حسّن صور Docker لتطبيقات PHP عبر البناء متعدد المراحل (multi-stage builds) لتقليص حجمها وتعزيز أمانها.' },
    },
  },
  {
    slug: 'docker-compose-production',
    title: 'Docker Compose en production',
    description: 'Comment configurer Docker Compose pour un environnement de production robuste et performant.',
    category: 'Docker',
    date: '28 Feb 2024',
    readTime: '9 min',
    tags: ['Docker', 'Production', 'DevOps'],
    translations: {
      en: { title: 'Docker Compose in production', description: 'How to configure Docker Compose for a robust, high-performance production environment.' },
      ar: { title: 'Docker Compose في بيئة الإنتاج', description: 'كيف تُعدّ Docker Compose لبيئة إنتاج متينة وعالية الأداء: الشبكات والأسرار والموارد وإعادة التشغيل والمراقبة.' },
    },
  },
  {
    slug: 'docker-php-development',
    title: 'Environnement de développement PHP avec Docker',
    description: 'Créez un environnement de développement PHP complet et reproductible avec Docker.',
    category: 'Docker',
    date: '12 Mar 2024',
    readTime: '7 min',
    tags: ['Docker', 'PHP', 'Développement'],
    translations: {
      en: { title: 'A PHP development environment with Docker', description: 'Build a complete, reproducible PHP development environment with Docker.' },
      ar: { title: 'بيئة تطوير PHP باستخدام Docker', description: 'أنشئ بيئة تطوير PHP متكاملة وقابلة لإعادة الإنتاج باستخدام Docker وDocker Compose، مع Xdebug وقاعدة البيانات.' },
    },
  },
  {
    slug: 'docker-ci-cd-pipeline',
    title: 'Docker dans les pipelines CI/CD',
    description: 'Intégrez Docker dans vos pipelines CI/CD pour des déploiements automatisés et fiables.',
    category: 'Docker',
    date: '05 Apr 2024',
    readTime: '9 min',
    tags: ['Docker', 'CI/CD', 'DevOps'],
    translations: {
      en: { title: 'Docker in CI/CD pipelines', description: 'Integrate Docker into your CI/CD pipelines for automated, reliable deployments.' },
      ar: { title: 'Docker في خطوط CI/CD', description: 'ادمج Docker في خطوط CI/CD لديك لعمليات نشر مؤتمتة وموثوقة: بناء الصور واختبارها ونشرها في بيئة الإنتاج.' },
    },
  },
  {
    slug: 'docker-security-best-practices',
    title: 'Sécurité Docker : bonnes pratiques',
    description: 'Les meilleures pratiques de sécurité pour vos conteneurs Docker en production.',
    category: 'Docker',
    date: '20 May 2024',
    readTime: '8 min',
    tags: ['Docker', 'Sécurité', 'DevOps'],
    translations: {
      en: { title: 'Docker security: best practices', description: 'Security best practices for your Docker containers in production: minimal images, non-root users, secrets and scanning.' },
      ar: { title: 'أمان Docker: أفضل الممارسات', description: 'أفضل ممارسات الأمان لحاويات Docker في بيئة الإنتاج: صور مصغّرة، ومستخدم غير root، وإدارة الأسرار، وفحص الثغرات.' },
    },
  },
  {
    slug: 'docker-networking-guide',
    title: 'Guide réseau Docker',
    description: 'Comprendre et maîtriser le réseau Docker : bridge, overlay, host et macvlan.',
    category: 'Docker',
    date: '08 Jun 2024',
    readTime: '7 min',
    tags: ['Docker', 'Réseau', 'Infrastructure'],
    translations: {
      en: { title: 'Docker networking guide', description: 'Understand and master Docker networking: bridge, overlay, host and macvlan.' },
      ar: { title: 'دليل الشبكات في Docker', description: 'فهم الشبكات في Docker وإتقانها: أنواع bridge وoverlay وhost وmacvlan، واتصال الحاويات فيما بينها وعزلها.' },
    },
  },
  {
    slug: 'linux-server-hardening',
    title: 'Sécurisation d\'un serveur Linux',
    description: 'Guide complet pour sécuriser un serveur Linux en production : SSH, firewall, mises à jour automatiques.',
    category: 'Linux',
    date: '22 Jan 2024',
    readTime: '7 min',
    tags: ['Linux', 'Sécurité', 'Serveur'],
    translations: {
      en: { title: 'Hardening a Linux server', description: 'A complete guide to securing a production Linux server: SSH, firewall, automatic updates.' },
      ar: { title: 'تأمين خادم Linux', description: 'دليل شامل لتأمين خادم Linux في بيئة الإنتاج: SSH، جدار الحماية، التحديثات التلقائية.' },
    },
  },
  {
    slug: 'linux-performance-monitoring',
    title: 'Monitoring des performances Linux',
    description: 'Les outils et techniques pour surveiller les performances de vos serveurs Linux.',
    category: 'Linux',
    date: '15 Mar 2024',
    readTime: '9 min',
    tags: ['Linux', 'Monitoring', 'Performance'],
    translations: {
      en: { title: 'Linux performance monitoring', description: 'Tools and techniques for monitoring the performance of your Linux servers.' },
      ar: { title: 'مراقبة أداء Linux', description: 'الأدوات والتقنيات اللازمة لمراقبة أداء خوادم Linux: المعالج والذاكرة والأقراص والشبكة وتحديد الاختناقات.' },
    },
  },
  {
    slug: 'linux-shell-scripting',
    title: 'Shell scripting pour le DevOps',
    description: 'Automatisez vos tâches DevOps avec des scripts shell efficaces et maintenables.',
    category: 'Linux',
    date: '01 May 2024',
    readTime: '8 min',
    tags: ['Linux', 'Bash', 'Automatisation'],
    translations: {
      en: { title: 'Shell scripting for DevOps', description: 'Automate your DevOps tasks with efficient, maintainable shell scripts.' },
      ar: { title: 'كتابة سكربتات Shell لـ DevOps', description: 'أتمت مهام DevOps الخاصة بك باستخدام سكربتات shell فعّالة وسهلة الصيانة.' },
    },
  },
  {
    slug: 'linux-nginx-vs-apache',
    title: 'Nginx vs Apache : comparatif complet',
    description: 'Comparaison détaillée entre Nginx et Apache pour choisir le serveur web adapté à vos besoins.',
    category: 'Linux',
    date: '18 Jul 2024',
    readTime: '7 min',
    tags: ['Nginx', 'Apache', 'Linux'],
    translations: {
      en: { title: 'Nginx vs Apache: a complete comparison', description: 'A detailed comparison of Nginx and Apache to help you choose the right web server for your needs.' },
      ar: { title: 'Nginx أم Apache: مقارنة شاملة', description: 'مقارنة مفصّلة بين Nginx وApache لاختيار خادم الويب المناسب لاحتياجاتك.' },
    },
  },
  {
    slug: 'linux-systemd-services',
    title: 'Créer des services systemd',
    description: 'Apprenez à créer et gérer des services systemd pour vos applications : fichiers unit, redémarrage automatique, logs et timers.',
    category: 'Linux',
    date: '25 Sep 2024',
    readTime: '7 min',
    tags: ['Linux', 'Systemd', 'Services'],
    translations: {
      en: { title: 'Creating systemd services', description: 'Learn how to create and manage systemd services for your applications.' },
      ar: { title: 'إنشاء خدمات systemd', description: 'تعلّم كيفية إنشاء خدمات systemd وإدارتها لتطبيقاتك: ملفات unit وإعادة التشغيل التلقائي والسجلات والمؤقتات.' },
    },
  },
  {
    slug: 'php-8-features',
    title: 'Les nouveautés de PHP 8',
    description: 'Découvrez les fonctionnalités majeures de PHP 8 : named arguments, match, fibers, enums et plus.',
    category: 'PHP',
    date: '10 Feb 2024',
    readTime: '10 min',
    tags: ['PHP', 'PHP8', 'Nouveautés'],
    translations: {
      en: { title: 'What\'s new in PHP 8', description: 'Discover the major features of PHP 8: named arguments, match, fibers, enums and more.' },
      ar: { title: 'مستجدات PHP 8', description: 'اكتشف أبرز ميزات PHP 8: الوسائط المسمّاة (named arguments)، وmatch، وfibers، وenums، وغيرها.' },
    },
  },
  {
    slug: 'symfony-api-platform',
    title: 'Construire des APIs avec Symfony API Platform',
    description: 'Guide pour créer des APIs RESTful robustes avec Symfony et API Platform.',
    category: 'PHP',
    date: '25 Mar 2024',
    readTime: '8 min',
    tags: ['Symfony', 'API Platform', 'REST'],
    translations: {
      en: { title: 'Building APIs with Symfony API Platform', description: 'A guide to building robust RESTful APIs with Symfony and API Platform.' },
      ar: { title: 'بناء واجهات API باستخدام Symfony API Platform', description: 'دليل لإنشاء واجهات RESTful API متينة باستخدام Symfony وAPI Platform: الموارد والتحقق والأمان والتوثيق.' },
    },
  },
  {
    slug: 'symfony-migration-guide',
    title: 'Migration Symfony de 2.8 à 6.4',
    description: 'Retour d\'expérience sur la migration progressive de Symfony 2.8 vers 6.4 sans interruption de service.',
    category: 'PHP',
    date: '14 Apr 2024',
    readTime: '7 min',
    tags: ['Symfony', 'Migration', 'PHP'],
    translations: {
      en: { title: 'Migrating Symfony from 2.8 to 6.4', description: 'Lessons learned from a progressive migration from Symfony 2.8 to 6.4 with zero service interruption.' },
      ar: { title: 'ترحيل Symfony من 2.8 إلى 6.4', description: 'خلاصة تجربة الترحيل التدريجي من Symfony 2.8 إلى 6.4 دون أي انقطاع في الخدمة.' },
    },
  },
  {
    slug: 'php-performance-optimization',
    title: 'Optimisation des performances PHP',
    description: 'Techniques avancées pour optimiser les performances de vos applications PHP en production.',
    category: 'PHP',
    date: '02 Jun 2024',
    readTime: '9 min',
    tags: ['PHP', 'Performance', 'OPcache'],
    translations: {
      en: { title: 'PHP performance optimization', description: 'Advanced techniques for optimizing the performance of your PHP applications in production.' },
      ar: { title: 'تحسين أداء PHP', description: 'تقنيات متقدمة لتحسين أداء تطبيقات PHP في بيئة الإنتاج: OPcache والتخزين المؤقت وقواعد البيانات والتحليل.' },
    },
  },
  {
    slug: 'symfony-messenger-async',
    title: 'Traitement asynchrone avec Symfony Messenger',
    description: 'Implémentez le traitement asynchrone dans vos applications Symfony avec le composant Messenger.',
    category: 'PHP',
    date: '19 Jul 2024',
    readTime: '7 min',
    tags: ['Symfony', 'Messenger', 'Async'],
    translations: {
      en: { title: 'Asynchronous processing with Symfony Messenger', description: 'Implement asynchronous processing in your Symfony applications with the Messenger component.' },
      ar: { title: 'المعالجة غير المتزامنة مع Symfony Messenger', description: 'طبّق المعالجة غير المتزامنة في تطبيقات Symfony الخاصة بك باستخدام مكوّن Messenger.' },
    },
  },
  {
    slug: 'php-design-patterns',
    title: 'Design patterns en PHP',
    description: 'Les design patterns essentiels pour architecturer vos applications PHP de manière maintenable.',
    category: 'PHP',
    date: '05 Sep 2024',
    readTime: '10 min',
    tags: ['PHP', 'Design Patterns', 'Architecture'],
    translations: {
      en: { title: 'Design patterns in PHP', description: 'The essential design patterns for building maintainable PHP applications.' },
      ar: { title: 'أنماط التصميم في PHP', description: 'أنماط التصميم (design patterns) الأساسية لبناء تطبيقات PHP بمعمارية قابلة للصيانة.' },
    },
  },
  {
    slug: 'symfony-docker-dev',
    title: 'Développement Symfony avec Docker',
    description: 'Configurez un environnement de développement Symfony complet avec Docker et Docker Compose.',
    category: 'PHP',
    date: '22 Oct 2024',
    readTime: '7 min',
    tags: ['Symfony', 'Docker', 'Développement'],
    translations: {
      en: { title: 'Symfony development with Docker', description: 'Set up a complete Symfony development environment with Docker and Docker Compose.' },
      ar: { title: 'تطوير Symfony باستخدام Docker', description: 'أعدّ بيئة تطوير Symfony متكاملة باستخدام Docker وDocker Compose، موحّدة لجميع أعضاء الفريق.' },
    },
  },
  {
    slug: 'graphql-php',
    title: 'GraphQL avec PHP et Symfony',
    description: 'Implémentez une API GraphQL performante avec PHP et le bundle overblog/graphql pour Symfony.',
    category: 'PHP',
    date: '10 Nov 2024',
    readTime: '8 min',
    tags: ['GraphQL', 'PHP', 'API'],
    translations: {
      en: { title: 'GraphQL with PHP and Symfony', description: 'Build a high-performance GraphQL API with PHP and the overblog/graphql bundle for Symfony.' },
      ar: { title: 'GraphQL مع PHP وSymfony', description: 'أنشئ واجهة GraphQL API عالية الأداء باستخدام PHP وحزمة overblog/graphql لـ Symfony.' },
    },
  },
  {
    slug: 'ci-cd-github-actions',
    title: 'CI/CD avec GitHub Actions',
    description: 'Mettez en place des pipelines CI/CD complets avec GitHub Actions pour vos projets PHP.',
    category: 'DevOps',
    date: '08 Feb 2024',
    readTime: '8 min',
    tags: ['GitHub Actions', 'CI/CD', 'Automatisation'],
    translations: {
      en: { title: 'CI/CD with GitHub Actions', description: 'Set up complete CI/CD pipelines with GitHub Actions for your PHP projects.' },
      ar: { title: 'CI/CD باستخدام GitHub Actions', description: 'أنشئ خطوط CI/CD متكاملة باستخدام GitHub Actions لمشاريع PHP الخاصة بك.' },
    },
  },
  {
    slug: 'monitoring-sentry',
    title: 'Monitoring applicatif avec Sentry',
    description: 'Intégrez Sentry dans vos applications PHP/Symfony pour un monitoring des erreurs en temps réel.',
    category: 'DevOps',
    date: '20 Apr 2024',
    readTime: '7 min',
    tags: ['Sentry', 'Monitoring', 'PHP'],
    translations: {
      en: { title: 'Application monitoring with Sentry', description: 'Integrate Sentry into your PHP/Symfony applications for real-time error monitoring.' },
      ar: { title: 'مراقبة التطبيقات باستخدام Sentry', description: 'ادمج Sentry في تطبيقات PHP/Symfony لمراقبة الأخطاء في الوقت الفعلي وتتبّع الأداء والتنبيهات.' },
    },
  },
  {
    slug: 'jenkins-pipeline',
    title: 'Configuration de pipelines Jenkins',
    description: 'Créez des pipelines Jenkins declaratifs pour automatiser vos builds et déploiements.',
    category: 'DevOps',
    date: '15 Jun 2024',
    readTime: '8 min',
    tags: ['Jenkins', 'Pipeline', 'CI/CD'],
    translations: {
      en: { title: 'Configuring Jenkins pipelines', description: 'Build declarative Jenkins pipelines to automate your builds and deployments.' },
      ar: { title: 'إعداد مسارات Jenkins Pipeline', description: 'أنشئ مسارات Jenkins تصريحية (declarative) لأتمتة عمليات البناء والنشر لديك.' },
    },
  },
  {
    slug: 'redis-caching-strategies',
    title: 'Stratégies de cache avec Redis',
    description: 'Implémentez des stratégies de cache efficaces avec Redis pour améliorer les performances.',
    category: 'DevOps',
    date: '30 Aug 2024',
    readTime: '8 min',
    tags: ['Redis', 'Cache', 'Performance'],
    translations: {
      en: { title: 'Caching strategies with Redis', description: 'Implement effective caching strategies with Redis to improve performance.' },
      ar: { title: 'استراتيجيات cache باستخدام Redis', description: 'طبّق استراتيجيات cache فعّالة باستخدام Redis لتحسين الأداء: cache-aside وانتهاء الصلاحية والإبطال.' },
    },
  },
  {
    slug: 'database-migration-zero-downtime',
    title: 'Migrations base de données sans interruption',
    description: 'Techniques pour exécuter des migrations de base de données sans interrompre le service.',
    category: 'DevOps',
    date: '12 Oct 2024',
    readTime: '8 min',
    tags: ['Database', 'Migration', 'DevOps'],
    translations: {
      en: { title: 'Zero-downtime database migrations', description: 'Techniques for running database migrations without interrupting service.' },
      ar: { title: 'ترحيل قواعد البيانات دون انقطاع', description: 'تقنيات لتنفيذ عمليات ترحيل قواعد البيانات دون إيقاف الخدمة: التغييرات المتوافقة والترحيل على مراحل.' },
    },
  },
  {
    slug: 'zapier-api-automation',
    title: 'Automatisation d\'APIs avec Zapier',
    description: 'Automatisez vos workflows métier en connectant vos APIs avec Zapier : webhooks, déclencheurs, actions et intégration PHP.',
    category: 'DevOps',
    date: '28 Nov 2024',
    readTime: '7 min',
    tags: ['Zapier', 'API', 'Automatisation'],
    translations: {
      en: { title: 'API automation with Zapier', description: 'Automate your business workflows by connecting your APIs with Zapier: webhooks, triggers, actions and PHP integration.' },
      ar: { title: 'أتمتة واجهات API باستخدام Zapier', description: 'أتمت سير عملك التجاري بربط واجهات API الخاصة بك مع Zapier: الـ webhooks والمشغّلات والإجراءات والدمج مع PHP.' },
    },
  },
  {
    slug: 'my-journey-tech-lead',
    title: 'Mon parcours : de développeur junior à Tech Lead',
    description: 'Retour sur mon parcours de développeur PHP junior à Tech Lead, en passant par la création de Keytchens et mes expériences chez CCM Benchmark et ORPI.',
    category: 'PHP',
    date: '15 Dec 2024',
    readTime: '3 min',
    tags: ['Carrière', 'Tech Lead', 'Symfony', 'DevOps'],
    translations: {
      en: { title: 'My journey: from junior developer to Tech Lead', description: 'A look back at my path from junior PHP developer to Tech Lead, including founding Keytchens and my experience at CCM Benchmark and ORPI.' },
      ar: { title: 'مسيرتي: من مطوّر مبتدئ إلى Tech Lead', description: 'نظرة على مسيرتي من مطوّر PHP مبتدئ إلى Tech Lead، مروراً بتأسيس Keytchens وتجاربي في CCM Benchmark وORPI.' },
    },
  },
  {
    slug: 'mcp-server-php',
    title: 'Créer un serveur MCP en PHP',
    description: 'Exposez vos outils PHP à Claude et aux assistants IA avec le Model Context Protocol et le SDK PHP officiel : outils, ressources, prompts et tests.',
    category: 'PHP',
    date: '22 Sep 2026',
    readTime: '9 min',
    tags: ['PHP', 'MCP', 'IA', 'Symfony'],
    translations: {
      en: { title: 'Building an MCP server in PHP', description: 'Expose your PHP tools to Claude and other AI assistants with the Model Context Protocol and the official PHP SDK: tools, resources, prompts and tests.' },
      ar: { title: 'إنشاء خادم MCP باستخدام PHP', description: 'اجعل أدوات PHP متاحة لـ Claude ولمساعدي الذكاء الاصطناعي عبر Model Context Protocol وحزمة SDK الرسمية لـ PHP: الأدوات والموارد والقوالب.' },
    },
  },
  {
    slug: 'nuxt-cloudflare-pages',
    title: 'Nuxt sur Cloudflare Pages : déploiement et pièges à éviter',
    description: 'Retour d\'expérience : déployer un site Nuxt 3 sur Cloudflare Pages, avec la configuration du build, la branche de production, Node et le lockfile npm.',
    category: 'DevOps',
    date: '26 Sep 2026',
    readTime: '5 min',
    tags: ['Nuxt', 'Cloudflare', 'DevOps', 'CI/CD'],
    translations: {
      en: { title: 'Deploying Nuxt to Cloudflare Pages: pitfalls to avoid', description: 'Lessons learned deploying this Nuxt 3 portfolio to Cloudflare Pages: build settings, production branch, Node version, npm lockfile and redirects.' },
      ar: { title: 'نشر موقع Nuxt على Cloudflare Pages (وتجنّب الأخطاء الشائعة)', description: 'خلاصة تجربة نشر هذا الموقع المبني بـ Nuxt 3 على Cloudflare Pages: إعدادات البناء، فرع الإنتاج، إصدار Node، ملف قفل npm وعمليات إعادة التوجيه.' },
    },
  },
  {
    slug: 'symfony-vps-deployment',
    title: 'Déployer Symfony sur un VPS : Nginx, PHP-FPM, MySQL, HTTPS',
    description: 'Configurer un serveur Ubuntu pour Symfony en production : Nginx, pool PHP-FPM dédié, MySQL, HTTPS avec Let\'s Encrypt, workers Messenger et crons.',
    category: 'Linux',
    date: '08 Sep 2026',
    readTime: '7 min',
    tags: ['Linux', 'Symfony', 'Nginx', 'PHP-FPM', 'MySQL'],
    translations: {
      en: { title: 'Deploying Symfony on a VPS: Nginx, PHP-FPM, MySQL, HTTPS', description: 'Set up an Ubuntu server for Symfony in production: Nginx, a dedicated PHP-FPM pool, MySQL, HTTPS with Let\'s Encrypt, Messenger workers and cron jobs.' },
      ar: { title: 'نشر تطبيق Symfony على خادم VPS: Nginx وPHP-FPM وMySQL وHTTPS', description: 'إعداد خادم Ubuntu لتطبيق Symfony في بيئة الإنتاج: Nginx، مجموعة PHP-FPM مخصصة، MySQL، HTTPS مع Let\'s Encrypt، عمّال Messenger والمهام المجدولة.' },
    },
  },
  {
    slug: 'traefik-docker-https',
    title: 'Traefik et Docker : reverse proxy et HTTPS automatique',
    description: 'Héberger plusieurs applications Docker sur un serveur avec Traefik : routage par domaine, certificats Let\'s Encrypt automatiques et middlewares de sécurité.',
    category: 'Docker',
    date: '25 Aug 2026',
    readTime: '5 min',
    tags: ['Docker', 'Traefik', 'HTTPS', 'Reverse proxy'],
    translations: {
      en: { title: 'Traefik and Docker: reverse proxy and automatic HTTPS', description: 'Host several Docker applications on one server with Traefik: routing by domain name, automatic Let\'s Encrypt certificates and security middlewares.' },
      ar: { title: 'Traefik وDocker: وكيل عكسي وHTTPS تلقائي', description: 'استضافة عدة تطبيقات Docker على الخادم نفسه باستخدام Traefik: توجيه حسب اسم النطاق، شهادات Let\'s Encrypt تلقائية، طبقات أمان وسيطة ولوحة تحكم محمية.' },
    },
  },
  {
    slug: 'server-backups-restic',
    title: 'Sauvegardes serveur automatisées : MySQL, fichiers et restic',
    description: 'Des sauvegardes fiables : dump MySQL cohérent, sauvegarde chiffrée avec restic vers S3, rotation, planification systemd, alertes et tests de restauration.',
    category: 'Linux',
    date: '11 Aug 2026',
    readTime: '7 min',
    tags: ['Linux', 'Sauvegarde', 'MySQL', 'restic', 'systemd'],
    translations: {
      en: { title: 'Automated server backups: MySQL, files and restic', description: 'Reliable backups: a consistent MySQL dump, encrypted backups with restic to S3 storage, retention, systemd scheduling, alerts and restore tests.' },
      ar: { title: 'النسخ الاحتياطي التلقائي للخادم: MySQL والملفات وrestic', description: 'نسخ احتياطية موثوقة: تفريغ متّسق لقاعدة MySQL، ونسخ مشفّرة عبر restic إلى تخزين S3، وسياسة احتفاظ، وجدولة بـ systemd، واختبارات استعادة.' },
    },
  },
]
