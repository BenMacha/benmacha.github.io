export interface BlogArticle {
  slug: string
  title: string
  description: string
  category: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'docker-multi-stage-builds',
    title: 'Builds Docker multi-stage pour PHP',
    description: 'Optimisez vos images Docker PHP grâce aux builds multi-stage pour réduire la taille et améliorer la sécurité.',
    category: 'Docker',
    date: '15 Jan 2024',
    readTime: '8 min',
    tags: ['Docker', 'PHP', 'Optimisation'],
    content: `<h2>Pourquoi utiliser les builds multi-stage ?</h2>
<p>Les builds multi-stage permettent de séparer l'environnement de compilation de l'environnement d'exécution. Résultat : des images plus légères et plus sécurisées.</p>
<h3>Le problème des images monolithiques</h3>
<p>Une image PHP classique avec toutes les dépendances de développement peut facilement dépasser 1 Go. En production, vous n'avez besoin ni de Composer, ni des outils de test, ni des fichiers source non compilés.</p>
<h3>Exemple de Dockerfile multi-stage</h3>
<pre><code># Stage 1 : Build
FROM composer:2 AS builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader
COPY . .

# Stage 2 : Production
FROM php:8.3-fpm-alpine
COPY --from=builder /app /var/www/html
RUN docker-php-ext-install pdo pdo_mysql opcache
EXPOSE 9000
CMD ["php-fpm"]</code></pre>
<h3>Avantages concrets</h3>
<ul>
<li><strong>Taille réduite</strong> : passage de 800 Mo à moins de 150 Mo</li>
<li><strong>Sécurité</strong> : pas d'outils de développement en production</li>
<li><strong>Cache Docker</strong> : chaque stage est mis en cache indépendamment</li>
<li><strong>Reproductibilité</strong> : même résultat sur tous les environnements</li>
</ul>
<h3>Bonnes pratiques</h3>
<p>Utilisez Alpine comme image de base pour minimiser la surface d'attaque. Installez uniquement les extensions PHP nécessaires. Configurez OPcache pour la production avec les paramètres optimaux.</p>
<pre><code>RUN echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini \\
    && echo "opcache.max_accelerated_files=20000" >> /usr/local/etc/php/conf.d/opcache.ini \\
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini</code></pre>
<p>Cette approche est utilisée avec succès sur des plateformes comme Keytchens pour déployer des applications Symfony avec des temps de build réduits de 60%.</p>`
  },
  {
    slug: 'docker-compose-production',
    title: 'Docker Compose en production',
    description: 'Comment configurer Docker Compose pour un environnement de production robuste et performant.',
    category: 'Docker',
    date: '28 Feb 2024',
    readTime: '10 min',
    tags: ['Docker', 'Production', 'DevOps'],
    content: `<h2>Docker Compose au-delà du développement</h2>
<p>Docker Compose n'est pas uniquement réservé au développement. Avec les bonnes pratiques, il devient un outil puissant pour orchestrer des applications en production.</p>
<h3>Structure de fichiers recommandée</h3>
<pre><code>├── docker-compose.yml          # Configuration de base
├── docker-compose.prod.yml     # Overrides production
├── docker-compose.dev.yml      # Overrides développement
├── .env.production             # Variables d'environnement
└── nginx/
    └── default.conf            # Configuration Nginx</code></pre>
<h3>Configuration de production</h3>
<pre><code>version: '3.8'
services:
  app:
    build:
      context: .
      target: production
    restart: always
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    healthcheck:
      test: ["CMD", "php-fpm-healthcheck"]
      interval: 30s
      timeout: 5s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      app:
        condition: service_healthy

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru</code></pre>
<h3>Gestion des logs</h3>
<p>Configurez un driver de logging centralisé pour faciliter le monitoring :</p>
<pre><code>logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"</code></pre>
<h3>Points essentiels</h3>
<ul>
<li>Toujours définir <code>restart: always</code> pour la résilience</li>
<li>Limiter les ressources avec <code>deploy.resources</code></li>
<li>Utiliser des healthchecks pour la haute disponibilité</li>
<li>Séparer les volumes de données persistantes</li>
<li>Ne jamais exposer les ports internes inutilement</li>
</ul>`
  },
  {
    slug: 'docker-php-development',
    title: 'Environnement de développement PHP avec Docker',
    description: 'Créez un environnement de développement PHP complet et reproductible avec Docker.',
    category: 'Docker',
    date: '12 Mar 2024',
    readTime: '7 min',
    tags: ['Docker', 'PHP', 'Développement'],
    content: `<h2>Un environnement de dev identique pour toute l'équipe</h2>
<p>Fini les "ça marche sur ma machine". Docker garantit que chaque développeur travaille dans un environnement identique, éliminant les problèmes de compatibilité.</p>
<h3>Stack de développement complète</h3>
<pre><code>version: '3.8'
services:
  php:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/var/www/html
      - composer-cache:/root/.composer
    environment:
      - APP_ENV=dev
      - XDEBUG_MODE=debug

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: app
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  mailhog:
    image: mailhog/mailhog
    ports:
      - "8025:8025"

volumes:
  composer-cache:
  mysql-data:</code></pre>
<h3>Configuration Xdebug</h3>
<p>Le debugging est essentiel en développement. Voici la configuration Xdebug optimale :</p>
<pre><code>[xdebug]
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_host=host.docker.internal
xdebug.client_port=9003</code></pre>
<h3>Hot reload et performances</h3>
<p>Sur macOS et Windows, les volumes montés peuvent être lents. Utilisez des stratégies de synchronisation :</p>
<ul>
<li>Mutagen pour la synchronisation rapide des fichiers</li>
<li>Exclure <code>vendor/</code> et <code>node_modules/</code> du montage</li>
<li>Utiliser des volumes nommés pour les dépendances</li>
</ul>
<p>Cette approche permet d'avoir un environnement de développement opérationnel en moins de 5 minutes pour tout nouveau développeur rejoignant l'équipe.</p>`
  },
  {
    slug: 'docker-ci-cd-pipeline',
    title: 'Docker dans les pipelines CI/CD',
    description: 'Intégrez Docker dans vos pipelines CI/CD pour des déploiements automatisés et fiables.',
    category: 'Docker',
    date: '05 Apr 2024',
    readTime: '9 min',
    tags: ['Docker', 'CI/CD', 'DevOps'],
    content: `<h2>Docker et l'intégration continue</h2>
<p>Docker est devenu incontournable dans les pipelines CI/CD modernes. Il garantit la cohérence entre les environnements de test et de production.</p>
<h3>Pipeline GitHub Actions avec Docker</h3>
<pre><code>name: CI/CD Pipeline
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build test image
        run: docker build --target test -t app:test .
      - name: Run tests
        run: docker run app:test php bin/phpunit

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build production image
        run: docker build --target production -t app:latest .
      - name: Push to registry
        run: |
          echo "$REGISTRY_TOKEN" | docker login -u user --password-stdin
          docker push app:latest</code></pre>
<h3>Optimisation du cache</h3>
<p>Le cache des couches Docker est crucial pour la vitesse du pipeline :</p>
<pre><code>- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
- name: Build with cache
  uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max</code></pre>
<h3>Tests en parallèle</h3>
<ul>
<li>Utilisez Docker Compose pour lancer les services de test (DB, Redis)</li>
<li>Parallélisez les suites de tests dans des conteneurs séparés</li>
<li>Nettoyez les ressources après chaque exécution</li>
</ul>
<p>Cette stratégie permet de réduire le temps de déploiement de 30 minutes à moins de 5 minutes.</p>`
  },
  {
    slug: 'docker-security-best-practices',
    title: 'Sécurité Docker : bonnes pratiques',
    description: 'Les meilleures pratiques de sécurité pour vos conteneurs Docker en production.',
    category: 'Docker',
    date: '20 May 2024',
    readTime: '8 min',
    tags: ['Docker', 'Sécurité', 'DevOps'],
    content: `<h2>Sécuriser vos conteneurs Docker</h2>
<p>La sécurité des conteneurs est un sujet critique. Voici les pratiques essentielles pour protéger vos applications conteneurisées.</p>
<h3>Principe du moindre privilège</h3>
<pre><code># Ne JAMAIS exécuter en root
FROM php:8.3-fpm-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app
COPY --chown=appuser:appgroup . .</code></pre>
<h3>Scanner les vulnérabilités</h3>
<p>Intégrez un scanner de vulnérabilités dans votre pipeline :</p>
<pre><code># Avec Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  aquasec/trivy image myapp:latest

# Avec Docker Scout
docker scout cves myapp:latest</code></pre>
<h3>Réseau et isolation</h3>
<ul>
<li>Créez des réseaux dédiés pour isoler les services</li>
<li>N'exposez jamais les ports des bases de données</li>
<li>Utilisez des secrets Docker plutôt que des variables d'environnement pour les données sensibles</li>
<li>Activez le mode read-only pour les conteneurs stateless</li>
</ul>
<h3>Gestion des secrets</h3>
<pre><code>services:
  app:
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true</code></pre>
<h3>Images de confiance</h3>
<p>Utilisez uniquement des images officielles ou vérifiées. Épinglez les versions exactes plutôt que d'utiliser <code>latest</code>. Signez vos images avec Docker Content Trust.</p>`
  },
  {
    slug: 'docker-networking-guide',
    title: 'Guide réseau Docker',
    description: 'Comprendre et maîtriser le réseau Docker : bridge, overlay, host et macvlan.',
    category: 'Docker',
    date: '08 Jun 2024',
    readTime: '7 min',
    tags: ['Docker', 'Réseau', 'Infrastructure'],
    content: `<h2>Les modes réseau Docker</h2>
<p>Docker propose plusieurs drivers réseau, chacun adapté à des cas d'usage spécifiques.</p>
<h3>Bridge (par défaut)</h3>
<p>Le mode bridge crée un réseau isolé pour les conteneurs sur un même hôte :</p>
<pre><code>docker network create --driver bridge mon-reseau
docker run --network mon-reseau --name app myapp
docker run --network mon-reseau --name db mysql</code></pre>
<p>Les conteneurs sur le même réseau bridge peuvent communiquer via leur nom de conteneur comme hostname.</p>
<h3>Host</h3>
<p>Le mode host supprime l'isolation réseau. Le conteneur utilise directement le réseau de l'hôte :</p>
<pre><code>docker run --network host nginx</code></pre>
<p>Utile pour les performances maximales mais sans isolation.</p>
<h3>Overlay</h3>
<p>Pour les clusters Docker Swarm, le réseau overlay permet la communication entre conteneurs sur différents nœuds :</p>
<pre><code>docker network create --driver overlay --attachable mon-overlay</code></pre>
<h3>DNS interne</h3>
<p>Docker intègre un serveur DNS permettant la résolution par nom de service :</p>
<pre><code>services:
  app:
    networks:
      - frontend
      - backend
  nginx:
    networks:
      - frontend
  db:
    networks:
      - backend

networks:
  frontend:
  backend:</code></pre>
<h3>Bonnes pratiques réseau</h3>
<ul>
<li>Isolez les services par réseau (frontend, backend, monitoring)</li>
<li>Utilisez des réseaux internes pour les services non exposés</li>
<li>Documentez vos topologies réseau</li>
<li>Limitez les ports exposés au strict minimum</li>
</ul>`
  },
  {
    slug: 'linux-server-hardening',
    title: "Sécurisation d'un serveur Linux",
    description: "Guide complet pour sécuriser un serveur Linux en production : SSH, firewall, mises à jour automatiques.",
    category: 'Linux',
    date: '22 Jan 2024',
    readTime: '10 min',
    tags: ['Linux', 'Sécurité', 'Serveur'],
    content: `<h2>Sécuriser votre serveur Linux</h2>
<p>La sécurisation d'un serveur Linux est la première étape avant tout déploiement en production. Voici les mesures essentielles.</p>
<h3>Configuration SSH</h3>
<pre><code># /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222
MaxAuthTries 3
AllowUsers deploy</code></pre>
<h3>Firewall avec UFW</h3>
<pre><code>sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp    # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable</code></pre>
<h3>Mises à jour automatiques</h3>
<pre><code>sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades</code></pre>
<h3>Fail2Ban</h3>
<p>Protégez-vous contre les attaques par force brute :</p>
<pre><code>sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local</code></pre>
<h3>Checklist de sécurité</h3>
<ul>
<li>Désactiver le login root par SSH</li>
<li>Utiliser uniquement l'authentification par clé</li>
<li>Configurer un firewall restrictif</li>
<li>Installer et configurer Fail2Ban</li>
<li>Activer les mises à jour automatiques de sécurité</li>
<li>Configurer les logs centralisés</li>
<li>Mettre en place un monitoring système</li>
</ul>`
  },
  {
    slug: 'linux-performance-monitoring',
    title: 'Monitoring des performances Linux',
    description: 'Les outils et techniques pour surveiller les performances de vos serveurs Linux.',
    category: 'Linux',
    date: '15 Mar 2024',
    readTime: '8 min',
    tags: ['Linux', 'Monitoring', 'Performance'],
    content: `<h2>Surveiller les performances système</h2>
<p>Un bon monitoring est essentiel pour détecter les problèmes avant qu'ils n'impactent les utilisateurs.</p>
<h3>Outils essentiels</h3>
<pre><code># CPU et mémoire en temps réel
htop

# Statistiques disque
iostat -x 1

# Trafic réseau
iftop -i eth0

# Processus gourmands
ps aux --sort=-%mem | head -20</code></pre>
<h3>Monitoring avec Prometheus et Node Exporter</h3>
<pre><code># Installation Node Exporter
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
tar xvfz node_exporter-*.tar.gz
sudo mv node_exporter-*/node_exporter /usr/local/bin/</code></pre>
<h3>Alertes système</h3>
<p>Configurez des alertes pour les métriques critiques :</p>
<ul>
<li><strong>CPU</strong> : alerte au-dessus de 80% pendant 5 minutes</li>
<li><strong>Mémoire</strong> : alerte au-dessus de 90%</li>
<li><strong>Disque</strong> : alerte au-dessus de 85%</li>
<li><strong>Load average</strong> : alerte au-dessus du nombre de CPUs</li>
</ul>
<h3>Scripts de monitoring personnalisés</h3>
<pre><code>#!/bin/bash
# check_resources.sh
CPU=\$(top -bn1 | grep "Cpu(s)" | awk '{print \$2}')
MEM=\$(free -m | awk 'NR==2{printf "%.1f", \$3*100/\$2}')
DISK=\$(df -h / | awk 'NR==2{print \$5}' | tr -d '%')

echo "CPU: \${CPU}% | MEM: \${MEM}% | DISK: \${DISK}%"

if (( \$(echo "\$CPU > 80" | bc -l) )); then
  echo "ALERTE: CPU élevé !" | mail -s "Alerte serveur" admin@example.com
fi</code></pre>`
  },
  {
    slug: 'linux-shell-scripting',
    title: 'Shell scripting pour le DevOps',
    description: "Automatisez vos tâches DevOps avec des scripts shell efficaces et maintenables.",
    category: 'Linux',
    date: '01 May 2024',
    readTime: '9 min',
    tags: ['Linux', 'Bash', 'Automatisation'],
    content: `<h2>L'art du shell scripting</h2>
<p>Le shell scripting reste un outil fondamental pour tout ingénieur DevOps. Voici les patterns et bonnes pratiques essentiels.</p>
<h3>Structure d'un script robuste</h3>
<pre><code>#!/bin/bash
set -euo pipefail
IFS=$'\\n\\t'

# Variables
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly LOG_FILE="/var/log/deploy.log"

# Fonctions
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

cleanup() {
    log "Nettoyage en cours..."
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Script principal
main() {
    log "Démarrage du déploiement"
    # ...
    log "Déploiement terminé"
}

main "$@"</code></pre>
<h3>Patterns utiles</h3>
<pre><code># Vérifier si un service est actif
check_service() {
    if systemctl is-active --quiet "$1"; then
        echo "$1 est actif"
    else
        echo "$1 est inactif" && return 1
    fi
}

# Retry avec backoff
retry() {
    local max_attempts=$1; shift
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        if "$@"; then return 0; fi
        echo "Tentative $attempt/$max_attempts échouée"
        sleep $((attempt * 2))
        ((attempt++))
    done
    return 1
}</code></pre>
<h3>Bonnes pratiques</h3>
<ul>
<li>Toujours utiliser <code>set -euo pipefail</code></li>
<li>Documenter les variables et fonctions</li>
<li>Utiliser des fonctions pour la lisibilité</li>
<li>Gérer les erreurs avec <code>trap</code></li>
<li>Tester avec shellcheck</li>
</ul>`
  },
  {
    slug: 'linux-nginx-vs-apache',
    title: 'Nginx vs Apache : comparatif complet',
    description: 'Comparaison détaillée entre Nginx et Apache pour choisir le serveur web adapté à vos besoins.',
    category: 'Linux',
    date: '18 Jul 2024',
    readTime: '7 min',
    tags: ['Nginx', 'Apache', 'Linux'],
    content: `<h2>Nginx vs Apache : quel serveur web choisir ?</h2>
<p>Le choix entre Nginx et Apache dépend de votre cas d'usage. Voici une comparaison objective.</p>
<h3>Architecture</h3>
<p><strong>Apache</strong> utilise un modèle basé sur les processus/threads (prefork ou worker). Chaque connexion est gérée par un processus ou thread dédié.</p>
<p><strong>Nginx</strong> utilise une architecture événementielle asynchrone. Un processus worker peut gérer des milliers de connexions simultanées.</p>
<h3>Performances</h3>
<pre><code># Benchmark avec ab (Apache Bench)
ab -n 10000 -c 100 http://localhost/

# Nginx : ~15000 req/s pour du contenu statique
# Apache : ~5000 req/s pour du contenu statique</code></pre>
<h3>Configuration PHP</h3>
<p><strong>Apache avec mod_php :</strong></p>
<pre><code>&lt;VirtualHost *:80&gt;
    DocumentRoot /var/www/html/public
    &lt;Directory /var/www/html/public&gt;
        AllowOverride All
    &lt;/Directory&gt;
&lt;/VirtualHost&gt;</code></pre>
<p><strong>Nginx avec PHP-FPM :</strong></p>
<pre><code>server {
    root /var/www/html/public;
    location ~ \\.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}</code></pre>
<h3>Quand choisir quoi ?</h3>
<ul>
<li><strong>Nginx</strong> : contenu statique, reverse proxy, haute concurrence, microservices</li>
<li><strong>Apache</strong> : .htaccess requis, modules spécifiques, compatibilité héritée</li>
<li><strong>Les deux</strong> : Nginx en reverse proxy devant Apache pour le meilleur des deux mondes</li>
</ul>
<p>Dans des contextes à fort trafic comme chez CCM Benchmark, Nginx est privilégié pour sa gestion efficace des connexions concurrentes.</p>`
  },
  {
    slug: 'linux-systemd-services',
    title: 'Créer des services systemd',
    description: 'Apprenez à créer et gérer des services systemd pour vos applications.',
    category: 'Linux',
    date: '25 Sep 2024',
    readTime: '6 min',
    tags: ['Linux', 'Systemd', 'Services'],
    content: `<h2>Gérer vos applications avec systemd</h2>
<p>systemd est le gestionnaire de services standard sous Linux. Créer un service personnalisé permet de gérer le cycle de vie de vos applications.</p>
<h3>Créer un service</h3>
<pre><code># /etc/systemd/system/myapp.service
[Unit]
Description=Mon Application PHP
After=network.target mysql.service
Requires=mysql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/php bin/console messenger:consume async --limit=100
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target</code></pre>
<h3>Commandes essentielles</h3>
<pre><code>sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl start myapp
sudo systemctl status myapp
journalctl -u myapp -f</code></pre>
<h3>Gestion des workers Symfony Messenger</h3>
<p>Pour les applications Symfony utilisant Messenger, créez un service avec plusieurs instances :</p>
<pre><code># /etc/systemd/system/messenger-worker@.service
[Service]
ExecStart=/usr/bin/php /var/www/app/bin/console messenger:consume async --time-limit=3600
Restart=always

# Lancer 3 workers
sudo systemctl enable messenger-worker@{1..3}
sudo systemctl start messenger-worker@{1..3}</code></pre>
<h3>Bonnes pratiques</h3>
<ul>
<li>Définir les dépendances avec <code>After</code> et <code>Requires</code></li>
<li>Configurer <code>Restart=always</code> pour la résilience</li>
<li>Utiliser les journaux systemd plutôt que des fichiers de log</li>
<li>Limiter les ressources avec les cgroups</li>
</ul>`
  },
  {
    slug: 'php-8-features',
    title: 'Les nouveautés de PHP 8',
    description: 'Découvrez les fonctionnalités majeures de PHP 8 : named arguments, match, fibers, enums et plus.',
    category: 'PHP',
    date: '10 Feb 2024',
    readTime: '8 min',
    tags: ['PHP', 'PHP8', 'Nouveautés'],
    content: `<h2>PHP 8 : une révolution pour le langage</h2>
<p>PHP 8 apporte des améliorations majeures qui modernisent le langage et améliorent les performances grâce au compilateur JIT.</p>
<h3>Named Arguments</h3>
<pre><code>// Avant
htmlspecialchars($string, ENT_COMPAT | ENT_HTML401, 'UTF-8', false);

// PHP 8
htmlspecialchars($string, double_encode: false);</code></pre>
<h3>Match Expression</h3>
<pre><code>$status = match($code) {
    200 => 'OK',
    301 => 'Redirect',
    404 => 'Not Found',
    500 => 'Server Error',
    default => 'Unknown',
};</code></pre>
<h3>Enums (PHP 8.1)</h3>
<pre><code>enum Status: string {
    case Active = 'active';
    case Inactive = 'inactive';
    case Pending = 'pending';

    public function label(): string {
        return match($this) {
            self::Active => 'Actif',
            self::Inactive => 'Inactif',
            self::Pending => 'En attente',
        };
    }
}</code></pre>
<h3>Fibers (PHP 8.1)</h3>
<pre><code>$fiber = new Fiber(function (): void {
    $value = Fiber::suspend('première pause');
    echo "Reçu : $value\\n";
});

$result = $fiber->start(); // 'première pause'
$fiber->resume('données');</code></pre>
<h3>Readonly Properties (PHP 8.2)</h3>
<pre><code>class User {
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly DateTimeImmutable $createdAt = new DateTimeImmutable(),
    ) {}
}</code></pre>
<h3>Performances JIT</h3>
<p>Le compilateur JIT améliore les performances de 2 à 3x pour les opérations intensives en CPU. Activez-le dans php.ini :</p>
<pre><code>opcache.jit=1255
opcache.jit_buffer_size=100M</code></pre>`
  },
  {
    slug: 'symfony-api-platform',
    title: 'Construire des APIs avec Symfony API Platform',
    description: 'Guide pour créer des APIs RESTful robustes avec Symfony et API Platform.',
    category: 'PHP',
    date: '25 Mar 2024',
    readTime: '10 min',
    tags: ['Symfony', 'API Platform', 'REST'],
    content: `<h2>API Platform : le framework API pour Symfony</h2>
<p>API Platform est le framework de référence pour construire des APIs modernes avec Symfony. Il génère automatiquement une API REST et GraphQL à partir de vos entités.</p>
<h3>Installation et configuration</h3>
<pre><code>composer require api
# Crée automatiquement la configuration API Platform</code></pre>
<h3>Créer une ressource API</h3>
<pre><code>use ApiPlatform\\Metadata\\ApiResource;
use ApiPlatform\\Metadata\\Get;
use ApiPlatform\\Metadata\\GetCollection;
use ApiPlatform\\Metadata\\Post;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
    ],
    paginationItemsPerPage: 20,
)]
#[ORM\\Entity]
class Product
{
    #[ORM\\Id, ORM\\GeneratedValue, ORM\\Column]
    private ?int $id = null;

    #[ORM\\Column(length: 255)]
    #[Assert\\NotBlank]
    private string $name;

    #[ORM\\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $price;

    // Getters et setters...
}</code></pre>
<h3>Filtres et recherche</h3>
<pre><code>#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial'])]
#[ApiFilter(RangeFilter::class, properties: ['price'])]
#[ApiFilter(OrderFilter::class, properties: ['name', 'price'])]</code></pre>
<h3>Serialization Groups</h3>
<pre><code>#[ApiResource(
    normalizationContext: ['groups' => ['product:read']],
    denormalizationContext: ['groups' => ['product:write']],
)]</code></pre>
<h3>Avantages</h3>
<ul>
<li>Documentation OpenAPI générée automatiquement</li>
<li>Support JSON-LD et Hydra</li>
<li>Pagination, filtres et tri intégrés</li>
<li>Validation automatique via les contraintes Symfony</li>
<li>Support GraphQL natif</li>
</ul>
<p>Des plateformes comme CCM Benchmark utilisent API Platform pour exposer leurs services internes via des APIs standardisées.</p>`
  },
  {
    slug: 'symfony-migration-guide',
    title: 'Migration Symfony de 2.8 à 6.4',
    description: 'Retour d\'expérience sur la migration progressive de Symfony 2.8 vers 6.4 sans interruption de service.',
    category: 'PHP',
    date: '14 Apr 2024',
    readTime: '12 min',
    tags: ['Symfony', 'Migration', 'PHP'],
    content: `<h2>Migrer Symfony sans interruption de service</h2>
<p>La migration d'une application Symfony de la version 2.8 à 6.4 est un défi majeur. Chez Keytchens, nous avons réalisé cette migration sur une plateforme en production gérant des commandes en temps réel, sans aucune interruption de service.</p>
<h3>Stratégie de migration progressive</h3>
<p>Plutôt qu'une réécriture complète, nous avons opté pour une migration incrémentale :</p>
<ul>
<li><strong>Phase 1</strong> : Symfony 2.8 → 3.4 (compatibilité ascendante)</li>
<li><strong>Phase 2</strong> : Symfony 3.4 → 4.4 (migration vers la structure Flex)</li>
<li><strong>Phase 3</strong> : Symfony 4.4 → 5.4 (suppression des dépréciations)</li>
<li><strong>Phase 4</strong> : Symfony 5.4 → 6.4 (adoption PHP 8.1+)</li>
</ul>
<h3>Outils indispensables</h3>
<pre><code># Détecter les dépréciations
composer require symfony/phpunit-bridge
PHPUnit_SYMFONY_DEPRECATIONS_HELPER=max[total]=0 php bin/phpunit

# Rectifier automatiquement
composer require rector/rector
vendor/bin/rector process src --set symfony54</code></pre>
<h3>Points critiques</h3>
<pre><code># Migration des services (avant - services.yml)
services:
    app.manager.order:
        class: App\\Manager\\OrderManager
        arguments: ['@doctrine.orm.entity_manager']

# Après - services.yaml avec autowiring
services:
    _defaults:
        autowire: true
        autoconfigure: true
    App\\:
        resource: '../src/'</code></pre>
<h3>Gestion du zero-downtime</h3>
<p>Pour maintenir le service pendant la migration :</p>
<ul>
<li>Déploiement blue-green avec Docker</li>
<li>Feature flags pour activer progressivement les nouvelles fonctionnalités</li>
<li>Tests de régression automatisés couvrant 85% du code</li>
<li>Rollback automatique en cas de détection d'erreurs</li>
</ul>
<p>Cette migration a permis d'améliorer les performances de 40% et de réduire la dette technique de manière significative.</p>`
  },
  {
    slug: 'php-performance-optimization',
    title: 'Optimisation des performances PHP',
    description: 'Techniques avancées pour optimiser les performances de vos applications PHP en production.',
    category: 'PHP',
    date: '02 Jun 2024',
    readTime: '9 min',
    tags: ['PHP', 'Performance', 'OPcache'],
    content: `<h2>Optimiser PHP pour la production</h2>
<p>Les performances PHP sont cruciales pour les applications à fort trafic. Chez CCM Benchmark, où les sites gèrent des millions de visiteurs quotidiens, chaque milliseconde compte.</p>
<h3>OPcache : la base</h3>
<pre><code>; php.ini - Configuration optimale OPcache
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.save_comments=1
opcache.preload=/var/www/app/config/preload.php
opcache.preload_user=www-data</code></pre>
<h3>Preloading PHP 8</h3>
<pre><code>// config/preload.php
require dirname(__DIR__).'/vendor/autoload.php';

// Précharger les classes fréquemment utilisées
$files = glob(dirname(__DIR__).'/src/Entity/*.php');
foreach ($files as $file) {
    opcache_compile_file($file);
}</code></pre>
<h3>Profilage avec Blackfire</h3>
<pre><code># Installer l'agent Blackfire
curl -s https://packagecloud.io/install/repositories/blackfire/agent/script.deb.sh | sudo bash
sudo apt install blackfire-agent

# Profiler une requête
blackfire curl http://localhost/api/products</code></pre>
<h3>Optimisations Doctrine</h3>
<ul>
<li>Activer le cache de requêtes et de résultats</li>
<li>Utiliser les requêtes DQL avec des sélections partielles</li>
<li>Éviter le lazy loading avec des jointures explicites</li>
<li>Configurer le cache de second niveau</li>
</ul>
<pre><code>// Cache de requêtes Doctrine
$query = $em->createQuery('SELECT p FROM App\\Entity\\Product p')
    ->enableResultCache(3600, 'products_list');

$results = $query->getResult();</code></pre>
<h3>PHP-FPM tuning</h3>
<pre><code>; Configuration PHP-FPM pour haute performance
pm = dynamic
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 20
pm.max_requests = 500</code></pre>`
  },
  {
    slug: 'symfony-messenger-async',
    title: 'Traitement asynchrone avec Symfony Messenger',
    description: 'Implémentez le traitement asynchrone dans vos applications Symfony avec le composant Messenger.',
    category: 'PHP',
    date: '19 Jul 2024',
    readTime: '8 min',
    tags: ['Symfony', 'Messenger', 'Async'],
    content: `<h2>Symfony Messenger : le traitement asynchrone simplifié</h2>
<p>Le composant Messenger de Symfony permet de décorréler les traitements longs de vos requêtes HTTP pour une meilleure expérience utilisateur.</p>
<h3>Architecture Message/Handler</h3>
<pre><code>// Message
class SendNotificationMessage
{
    public function __construct(
        public readonly int $userId,
        public readonly string $content,
    ) {}
}

// Handler
#[AsMessageHandler]
class SendNotificationHandler
{
    public function __construct(
        private NotificationService $notificationService,
    ) {}

    public function __invoke(SendNotificationMessage $message): void
    {
        $this->notificationService->send(
            $message->userId,
            $message->content,
        );
    }
}</code></pre>
<h3>Configuration des transports</h3>
<pre><code># config/packages/messenger.yaml
framework:
    messenger:
        transports:
            async:
                dsn: '%env(MESSENGER_TRANSPORT_DSN)%'
                retry_strategy:
                    max_retries: 3
                    delay: 1000
                    multiplier: 2
            failed:
                dsn: 'doctrine://default?queue_name=failed'

        routing:
            App\\Message\\SendNotificationMessage: async
            App\\Message\\ProcessOrderMessage: async</code></pre>
<h3>Dispatch des messages</h3>
<pre><code>class OrderController extends AbstractController
{
    #[Route('/order', methods: ['POST'])]
    public function create(
        MessageBusInterface $bus,
        Request $request,
    ): JsonResponse {
        // Traitement synchrone rapide
        $order = $this->orderService->create($request);

        // Traitement asynchrone
        $bus->dispatch(new SendNotificationMessage(
            $order->getUserId(),
            "Commande #{$order->getId()} confirmée"
        ));

        return $this->json($order, 201);
    }
}</code></pre>
<h3>Supervision des workers</h3>
<ul>
<li>Utilisez systemd pour gérer les workers en production</li>
<li>Configurez <code>--time-limit</code> pour éviter les fuites mémoire</li>
<li>Surveillez la file <code>failed</code> pour les messages en erreur</li>
<li>Utilisez le middleware de logging pour le débogage</li>
</ul>`
  },
  {
    slug: 'php-design-patterns',
    title: 'Design patterns en PHP',
    description: 'Les design patterns essentiels pour architecturer vos applications PHP de manière maintenable.',
    category: 'PHP',
    date: '05 Sep 2024',
    readTime: '10 min',
    tags: ['PHP', 'Design Patterns', 'Architecture'],
    content: `<h2>Patterns essentiels pour PHP moderne</h2>
<p>Les design patterns sont des solutions éprouvées aux problèmes récurrents de conception logicielle. Voici les plus utiles en PHP.</p>
<h3>Repository Pattern</h3>
<pre><code>interface ProductRepositoryInterface
{
    public function findById(int $id): ?Product;
    public function findByCategory(string $category): array;
    public function save(Product $product): void;
}

class DoctrineProductRepository implements ProductRepositoryInterface
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {}

    public function findById(int $id): ?Product
    {
        return $this->em->find(Product::class, $id);
    }

    public function save(Product $product): void
    {
        $this->em->persist($product);
        $this->em->flush();
    }
}</code></pre>
<h3>Strategy Pattern</h3>
<pre><code>interface PricingStrategy
{
    public function calculate(float $basePrice): float;
}

class RegularPricing implements PricingStrategy
{
    public function calculate(float $basePrice): float
    {
        return $basePrice;
    }
}

class PremiumPricing implements PricingStrategy
{
    public function calculate(float $basePrice): float
    {
        return $basePrice * 0.8; // 20% de réduction
    }
}</code></pre>
<h3>Observer Pattern avec Symfony Events</h3>
<pre><code>#[AsEventListener(event: OrderCreatedEvent::class)]
class SendOrderConfirmation
{
    public function __invoke(OrderCreatedEvent $event): void
    {
        $this->mailer->send(
            new OrderConfirmationEmail($event->getOrder())
        );
    }
}</code></pre>
<h3>Builder Pattern</h3>
<pre><code>class QueryBuilder
{
    private array $conditions = [];
    private ?int $limit = null;

    public function where(string $field, mixed $value): self
    {
        $this->conditions[$field] = $value;
        return $this;
    }

    public function limit(int $limit): self
    {
        $this->limit = $limit;
        return $this;
    }

    public function build(): Query
    {
        return new Query($this->conditions, $this->limit);
    }
}</code></pre>
<ul>
<li><strong>Repository</strong> : abstraction de la couche de persistance</li>
<li><strong>Strategy</strong> : algorithmes interchangeables</li>
<li><strong>Observer</strong> : découplage par événements</li>
<li><strong>Builder</strong> : construction d'objets complexes</li>
</ul>`
  },
  {
    slug: 'symfony-docker-dev',
    title: 'Développement Symfony avec Docker',
    description: 'Configurez un environnement de développement Symfony complet avec Docker et Docker Compose.',
    category: 'PHP',
    date: '22 Oct 2024',
    readTime: '7 min',
    tags: ['Symfony', 'Docker', 'Développement'],
    content: `<h2>Symfony et Docker : le duo parfait</h2>
<p>Docker et Symfony forment une combinaison puissante pour le développement. Chez Keytchens, plateforme food-tech de gestion de commandes en temps réel, cette stack a permis d'unifier les environnements de développement pour toute l'équipe.</p>
<h3>Docker Compose pour Symfony</h3>
<pre><code>version: '3.8'
services:
  php:
    build: .docker/php
    volumes:
      - .:/var/www/html
    depends_on:
      - mysql
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - .:/var/www/html
      - .docker/nginx/default.conf:/etc/nginx/conf.d/default.conf

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: symfony
    volumes:
      - mysql-data:/var/lib/mysql

  redis:
    image: redis:7-alpine

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "15672:15672"

volumes:
  mysql-data:</code></pre>
<h3>Dockerfile PHP optimisé</h3>
<pre><code>FROM php:8.3-fpm
RUN apt-get update && apt-get install -y \\
    libicu-dev libzip-dev \\
    && docker-php-ext-install intl pdo_mysql zip opcache \\
    && pecl install redis xdebug \\
    && docker-php-ext-enable redis xdebug

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html</code></pre>
<h3>Makefile pour simplifier les commandes</h3>
<pre><code>up:
	docker compose up -d

down:
	docker compose down

console:
	docker compose exec php php bin/console $(cmd)

test:
	docker compose exec php php bin/phpunit

migrate:
	docker compose exec php php bin/console doctrine:migrations:migrate -n</code></pre>
<ul>
<li>Environnement identique pour tous les développeurs</li>
<li>Isolation complète des services</li>
<li>Facilité d'onboarding pour les nouveaux développeurs</li>
</ul>`
  },
  {
    slug: 'graphql-php',
    title: 'GraphQL avec PHP et Symfony',
    description: 'Implémentez une API GraphQL performante avec PHP et le bundle overblog/graphql pour Symfony.',
    category: 'PHP',
    date: '10 Nov 2024',
    readTime: '9 min',
    tags: ['GraphQL', 'PHP', 'API'],
    content: `<h2>GraphQL : une alternative puissante au REST</h2>
<p>GraphQL permet aux clients de demander exactement les données dont ils ont besoin. Dans des projets comme ceux de Matalto et Manymore, cette flexibilité a permis de réduire considérablement le nombre de requêtes API.</p>
<h3>Installation avec Symfony</h3>
<pre><code>composer require overblog/graphql-bundle
composer require overblog/graphiql-bundle --dev</code></pre>
<h3>Définir un schéma</h3>
<pre><code># config/graphql/types/Product.types.yaml
Product:
    type: object
    config:
        fields:
            id:
                type: "ID!"
            name:
                type: "String!"
            price:
                type: "Float!"
            category:
                type: "Category"
                resolve: "@=resolver('product_category', [value])"</code></pre>
<h3>Resolver</h3>
<pre><code>class ProductResolver implements ResolverInterface
{
    public function __construct(
        private ProductRepository $repository,
    ) {}

    public function resolve(Argument $args): array
    {
        if (isset($args['id'])) {
            return $this->repository->find($args['id']);
        }
        return $this->repository->findAll();
    }
}

class ProductCategoryResolver implements ResolverInterface
{
    public function resolve(Product $product): Category
    {
        return $product->getCategory();
    }
}</code></pre>
<h3>Requête GraphQL</h3>
<pre><code>query {
  products(first: 10) {
    id
    name
    price
    category {
      name
    }
  }
}</code></pre>
<h3>Avantages vs REST</h3>
<ul>
<li><strong>Pas de sur-fetching</strong> : le client choisit les champs</li>
<li><strong>Pas de sous-fetching</strong> : une seule requête pour des données liées</li>
<li><strong>Typage fort</strong> : schéma auto-documenté</li>
<li><strong>Évolution facile</strong> : ajout de champs sans casser les clients existants</li>
</ul>`
  },
  {
    slug: 'ci-cd-github-actions',
    title: 'CI/CD avec GitHub Actions',
    description: 'Mettez en place des pipelines CI/CD complets avec GitHub Actions pour vos projets PHP.',
    category: 'DevOps',
    date: '08 Feb 2024',
    readTime: '8 min',
    tags: ['GitHub Actions', 'CI/CD', 'Automatisation'],
    content: `<h2>GitHub Actions pour vos projets PHP</h2>
<p>GitHub Actions offre une solution de CI/CD intégrée directement dans votre dépôt. Voici comment configurer un pipeline complet.</p>
<h3>Workflow de test</h3>
<pre><code>name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  tests:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test
        ports:
          - 3306:3306

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: mbstring, pdo_mysql, intl
          coverage: xdebug

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run PHPStan
        run: vendor/bin/phpstan analyse src

      - name: Run tests
        run: php bin/phpunit --coverage-clover coverage.xml
        env:
          DATABASE_URL: mysql://root:root@127.0.0.1:3306/test</code></pre>
<h3>Déploiement automatique</h3>
<pre><code>  deploy:
    needs: tests
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: deploy
          key: \${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/app
            git pull origin main
            composer install --no-dev
            php bin/console cache:clear
            php bin/console doctrine:migrations:migrate -n</code></pre>
<h3>Bonnes pratiques</h3>
<ul>
<li>Utiliser le cache des dépendances Composer</li>
<li>Paralléliser les jobs de test et de lint</li>
<li>Protéger les branches avec des status checks requis</li>
<li>Stocker les secrets dans GitHub Secrets</li>
</ul>`
  },
  {
    slug: 'monitoring-sentry',
    title: 'Monitoring applicatif avec Sentry',
    description: 'Intégrez Sentry dans vos applications PHP/Symfony pour un monitoring des erreurs en temps réel.',
    category: 'DevOps',
    date: '20 Apr 2024',
    readTime: '7 min',
    tags: ['Sentry', 'Monitoring', 'PHP'],
    content: `<h2>Sentry : ne ratez plus aucune erreur</h2>
<p>Sentry est un outil de monitoring d'erreurs qui capture, agrège et alerte sur les exceptions de votre application en temps réel.</p>
<h3>Installation Symfony</h3>
<pre><code>composer require sentry/sentry-symfony</code></pre>
<h3>Configuration</h3>
<pre><code># config/packages/sentry.yaml
sentry:
    dsn: '%env(SENTRY_DSN)%'
    options:
        environment: '%kernel.environment%'
        release: '%env(APP_VERSION)%'
        traces_sample_rate: 0.2
        profiles_sample_rate: 0.1</code></pre>
<h3>Contexte utilisateur</h3>
<pre><code>use Sentry\\State\\Scope;

class SentryUserListener
{
    #[AsEventListener(event: KernelEvents::REQUEST)]
    public function onRequest(RequestEvent $event): void
    {
        $user = $this->security->getUser();
        if ($user) {
            \\Sentry\\configureScope(function (Scope $scope) use ($user): void {
                $scope->setUser([
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                ]);
            });
        }
    }
}</code></pre>
<h3>Alertes et notifications</h3>
<ul>
<li>Configurez des alertes Slack pour les nouvelles erreurs</li>
<li>Définissez des seuils de volume d'erreurs</li>
<li>Utilisez les traces de performance pour identifier les goulots</li>
<li>Intégrez avec votre workflow GitHub pour le suivi des correctifs</li>
</ul>
<h3>Performance Monitoring</h3>
<pre><code>// Mesurer une opération spécifique
$transaction = \\Sentry\\startTransaction(['name' => 'process-order']);
\\Sentry\\configureScope(fn(Scope $scope) => $scope->setSpan($transaction));

$span = $transaction->startChild(['op' => 'db.query']);
// ... requête base de données
$span->finish();

$transaction->finish();</code></pre>`
  },
  {
    slug: 'jenkins-pipeline',
    title: 'Configuration de pipelines Jenkins',
    description: 'Créez des pipelines Jenkins declaratifs pour automatiser vos builds et déploiements.',
    category: 'DevOps',
    date: '15 Jun 2024',
    readTime: '9 min',
    tags: ['Jenkins', 'Pipeline', 'CI/CD'],
    content: `<h2>Jenkins Pipeline : automatisation avancée</h2>
<p>Jenkins reste une solution CI/CD populaire pour les organisations qui nécessitent un contrôle total sur leur infrastructure de build.</p>
<h3>Pipeline déclaratif</h3>
<pre><code>pipeline {
    agent {
        docker {
            image 'php:8.3-cli'
        }
    }

    environment {
        APP_ENV = 'test'
        DATABASE_URL = credentials('database-url')
    }

    stages {
        stage('Install') {
            steps {
                sh 'composer install --prefer-dist'
            }
        }

        stage('Quality') {
            parallel {
                stage('PHPStan') {
                    steps {
                        sh 'vendor/bin/phpstan analyse src'
                    }
                }
                stage('CS Fixer') {
                    steps {
                        sh 'vendor/bin/php-cs-fixer fix --dry-run --diff'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                sh 'php bin/phpunit --log-junit results.xml'
            }
            post {
                always {
                    junit 'results.xml'
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh './deploy.sh production'
            }
        }
    }

    post {
        failure {
            slackSend channel: '#ci', message: "Build FAILED: \${env.JOB_NAME}"
        }
    }
}</code></pre>
<h3>Bonnes pratiques Jenkins</h3>
<ul>
<li>Utiliser des agents Docker pour l'isolation</li>
<li>Paralléliser les stages indépendants</li>
<li>Stocker les credentials dans Jenkins Credentials</li>
<li>Configurer les notifications pour les échecs</li>
<li>Archiver les artefacts de build</li>
</ul>`
  },
  {
    slug: 'redis-caching-strategies',
    title: 'Stratégies de cache avec Redis',
    description: 'Implémentez des stratégies de cache efficaces avec Redis pour améliorer les performances.',
    category: 'DevOps',
    date: '30 Aug 2024',
    readTime: '8 min',
    tags: ['Redis', 'Cache', 'Performance'],
    content: `<h2>Redis : stratégies de cache avancées</h2>
<p>Redis est bien plus qu'un simple cache clé-valeur. Voici les stratégies pour en tirer le maximum.</p>
<h3>Patterns de cache</h3>
<h3>Cache-Aside (Lazy Loading)</h3>
<pre><code>class ProductService
{
    public function getProduct(int $id): Product
    {
        $cacheKey = "product:{$id}";
        $cached = $this->redis->get($cacheKey);

        if ($cached !== null) {
            return unserialize($cached);
        }

        $product = $this->repository->find($id);
        $this->redis->setex($cacheKey, 3600, serialize($product));

        return $product;
    }
}</code></pre>
<h3>Write-Through</h3>
<pre><code>public function updateProduct(Product $product): void
{
    $this->repository->save($product);
    $this->redis->setex(
        "product:{$product->getId()}",
        3600,
        serialize($product)
    );
}</code></pre>
<h3>Cache avec Symfony</h3>
<pre><code># config/packages/cache.yaml
framework:
    cache:
        pools:
            app.cache.products:
                adapter: cache.adapter.redis
                default_lifetime: 3600
                provider: 'redis://redis:6379'</code></pre>
<pre><code>class ProductController
{
    public function list(CacheInterface $productsCache): Response
    {
        $products = $productsCache->get('products_list', function (ItemInterface $item) {
            $item->expiresAfter(3600);
            $item->tag(['products']);
            return $this->repository->findAll();
        });

        return $this->json($products);
    }
}</code></pre>
<h3>Invalidation du cache</h3>
<ul>
<li><strong>TTL</strong> : expiration automatique après un délai</li>
<li><strong>Tags</strong> : invalidation par groupe avec les tags Symfony</li>
<li><strong>Events</strong> : invalidation sur événement Doctrine</li>
<li><strong>Versioning</strong> : clés de cache versionnées</li>
</ul>`
  },
  {
    slug: 'database-migration-zero-downtime',
    title: 'Migrations base de données sans interruption',
    description: 'Techniques pour exécuter des migrations de base de données sans interrompre le service.',
    category: 'DevOps',
    date: '12 Oct 2024',
    readTime: '10 min',
    tags: ['Database', 'Migration', 'DevOps'],
    content: `<h2>Zero-downtime database migrations</h2>
<p>Les migrations de base de données sont souvent la partie la plus risquée d'un déploiement. Voici comment les réaliser sans interruption.</p>
<h3>Règles fondamentales</h3>
<ul>
<li>Ne jamais supprimer une colonne utilisée par le code en production</li>
<li>Toujours ajouter les nouvelles colonnes comme nullable</li>
<li>Séparer les migrations de schéma des migrations de données</li>
<li>Tester les migrations sur une copie de la base de production</li>
</ul>
<h3>Pattern Expand-Contract</h3>
<p><strong>Phase 1 - Expand :</strong> Ajouter la nouvelle structure</p>
<pre><code>-- Migration 1 : Ajouter la nouvelle colonne
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Migration 2 : Remplir les données
UPDATE users SET email_verified = TRUE WHERE verified_at IS NOT NULL;</code></pre>
<p><strong>Phase 2 - Déployer le code</strong> utilisant les deux colonnes</p>
<p><strong>Phase 3 - Contract :</strong> Supprimer l'ancienne structure</p>
<pre><code>-- Migration 3 : Supprimer l'ancienne colonne
ALTER TABLE users DROP COLUMN verified_at;</code></pre>
<h3>Migrations Doctrine optimisées</h3>
<pre><code>public function up(Schema $schema): void
{
    // Utiliser des opérations non-bloquantes
    $this->addSql('ALTER TABLE orders ADD COLUMN status VARCHAR(50) DEFAULT NULL');

    // Pour les grandes tables, utiliser pt-online-schema-change
    // ou gh-ost pour éviter les locks
}</code></pre>
<h3>Outils recommandés</h3>
<ul>
<li><strong>pt-online-schema-change</strong> : migrations sans lock pour MySQL</li>
<li><strong>gh-ost</strong> : alternative GitHub pour les migrations en ligne</li>
<li><strong>Doctrine Migrations</strong> : gestion versionnée des migrations</li>
<li><strong>Flyway</strong> : outil de migration multi-base</li>
</ul>`
  },
  {
    slug: 'zapier-api-automation',
    title: "Automatisation d'APIs avec Zapier",
    description: "Automatisez vos workflows métier en connectant vos APIs avec Zapier.",
    category: 'DevOps',
    date: '28 Nov 2024',
    readTime: '6 min',
    tags: ['Zapier', 'API', 'Automatisation'],
    content: `<h2>Zapier pour l'automatisation métier</h2>
<p>Dans un contexte d'entreprise comme chez ORPI, l'automatisation des processus métier via les APIs est essentielle pour gagner en efficacité.</p>
<h3>Cas d'usage courants</h3>
<ul>
<li>Synchronisation CRM vers base de données interne</li>
<li>Notification Slack sur événements métier</li>
<li>Génération automatique de rapports</li>
<li>Intégration de formulaires web avec le SI</li>
</ul>
<h3>Créer un webhook personnalisé</h3>
<pre><code>// Endpoint Symfony pour recevoir les webhooks Zapier
#[Route('/api/webhook/zapier', methods: ['POST'])]
class ZapierWebhookController extends AbstractController
{
    public function __invoke(
        Request $request,
        MessageBusInterface $bus,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Valider le token
        if ($request->headers->get('X-Zapier-Token') !== $this->zapierToken) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        // Dispatcher le traitement
        $bus->dispatch(new ProcessZapierDataMessage($data));

        return $this->json(['status' => 'received']);
    }
}</code></pre>
<h3>API pour Zapier Triggers</h3>
<pre><code>#[Route('/api/zapier/new-leads', methods: ['GET'])]
public function newLeads(LeadRepository $repo): JsonResponse
{
    $leads = $repo->findRecent(limit: 50);
    return $this->json(array_map(fn(Lead $l) => [
        'id' => $l->getId(),
        'name' => $l->getName(),
        'email' => $l->getEmail(),
        'created_at' => $l->getCreatedAt()->format('c'),
    ], $leads));
}</code></pre>
<h3>Bonnes pratiques</h3>
<ul>
<li>Sécuriser les webhooks avec des tokens</li>
<li>Logger toutes les interactions pour le débogage</li>
<li>Utiliser des files d'attente pour le traitement asynchrone</li>
<li>Documenter les APIs avec OpenAPI pour l'intégration Zapier</li>
</ul>`
  },
  {
    slug: 'my-journey-tech-lead',
    title: 'Mon parcours : de développeur junior à Tech Lead',
    description: 'Retour sur mon parcours de développeur PHP junior à Tech Lead, en passant par la création de Keytchens et mes expériences chez CCM Benchmark et ORPI.',
    category: 'PHP',
    date: '15 Dec 2024',
    readTime: '11 min',
    tags: ['Carrière', 'Tech Lead', 'Symfony', 'DevOps'],
    content: `<h2>Un parcours guidé par la passion technique</h2>
<p>En tant que développeur, mon parcours a été jalonné de défis techniques stimulants qui m'ont permis de grandir et d'évoluer vers des postes à responsabilité. Voici les étapes clés de cette aventure.</p>

<h3>Les débuts : construire des bases solides</h3>
<p>Mes premiers pas dans le développement web m'ont rapidement orienté vers PHP et l'écosystème Symfony. La rigueur architecturale de ce framework et sa communauté active m'ont convaincu d'en faire mon outil principal.</p>

<h3>Keytchens : créer une startup from scratch</h3>
<p>L'expérience la plus formatrice de ma carrière a été la création de Keytchens. En tant que fondateur technique, j'ai conçu et développé l'intégralité de l'infrastructure technique de cette plateforme food-tech de A à Z.</p>
<p>Les défis étaient nombreux :</p>
<ul>
<li><strong>Architecture temps réel</strong> : gestion des commandes en direct avec intégration Uber Eats et Deliveroo</li>
<li><strong>Scalabilité</strong> : infrastructure capable de gérer les pics de commandes aux heures de repas</li>
<li><strong>Management</strong> : encadrement d'une équipe de 4 développeurs</li>
<li><strong>Migration majeure</strong> : migration de Symfony 2.8 vers 6.4 sans aucune interruption de service</li>
</ul>
<p>Cette migration a été un véritable défi technique. Nous avons procédé de manière incrémentale, version par version, en maintenant une couverture de tests supérieure à 85%. Le déploiement blue-green avec Docker nous a permis de basculer sans downtime.</p>

<h3>CCM Benchmark : le passage à l'échelle</h3>
<p>En tant que Lead Développeur PHP chez CCM Benchmark (CommentCaMarche, Le Journal des Femmes, Linternaute), j'ai travaillé sur des applications à très fort trafic. Cette expérience m'a appris l'importance cruciale de l'optimisation des performances PHP, du cache Redis, et de l'architecture orientée microservices.</p>
<p>Gérer des millions de pages vues quotidiennes impose une discipline technique rigoureuse : chaque requête SQL est optimisée, chaque endpoint API est monitoré, et chaque déploiement est testé en staging avant la mise en production.</p>

<h3>ORPI : Chef de projet SI</h3>
<p>Mon poste actuel chez ORPI en tant que Chef de projet SI me permet de combiner expertise technique et vision stratégique. Je pilote la modernisation des systèmes d'information, l'intégration de nouveaux outils, et l'automatisation des processus métier.</p>
<p>Cette évolution vers la gestion de projet est une suite logique de mon parcours technique. La compréhension profonde de l'architecture logicielle et des contraintes de développement me permet de prendre des décisions éclairées et de communiquer efficacement avec les équipes techniques.</p>

<h3>Les leçons apprises</h3>
<ul>
<li><strong>La qualité du code paie toujours</strong> : investir dans les tests et le refactoring réduit la dette technique</li>
<li><strong>Le leadership technique</strong> : un bon tech lead inspire par l'exemple et forme son équipe</li>
<li><strong>L'apprentissage continu</strong> : Docker, DevOps, cloud - il faut rester à jour</li>
<li><strong>La communication</strong> : savoir expliquer les choix techniques aux parties prenantes non-techniques est essentiel</li>
</ul>`
  }
]
