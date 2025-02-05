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
router.beforeEach((to, from, next) => {
  const { t } = i18n.global
  const defaultTitle = 'Ben Mecha Ali - ' + t('home.title')
  const defaultDescription = t('home.description')

  // Update meta tags based on route
  head.updateDOM({
    title: to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle,
    meta: [
      {
        name: 'description',
        content: to.meta.description || defaultDescription
      }
    ]
  })

  next()
})

app.use(router)
app.use(head)
app.use(MotionPlugin)
app.use(i18n)

app.mount('#app')