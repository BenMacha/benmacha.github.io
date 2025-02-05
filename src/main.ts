import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './style.css'

const app = createApp(App)
const head = createHead()

// SEO handling for each route
router.beforeEach((to, _from, next) => {
  const { t } = i18n.global
  const defaultTitle = 'Ben Mecha Ali - ' + t('home.title')
  const defaultDescription = t('home.description')

  // Update document title and meta description
  document.title = to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', (to.meta.description as string) || defaultDescription)
  }

  next()
})

app.use(router)
app.use(head)
app.use(MotionPlugin)
app.use(i18n)

app.mount('#app')