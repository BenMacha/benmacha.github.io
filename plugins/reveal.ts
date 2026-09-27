export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', revealDirective)
  nuxtApp.vueApp.directive('lift', liftDirective)
  nuxtApp.vueApp.directive('wiggle', wiggleDirective)

  if (import.meta.client) {
    nuxtApp.hook('app:mounted', () => {
      installPressFeedback()
    })
  }
})
