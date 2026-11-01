export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', revealDirective)
  nuxtApp.vueApp.directive('lift', liftDirective)
  nuxtApp.vueApp.directive('wiggle', wiggleDirective)
  nuxtApp.vueApp.directive('count', countDirective)
  nuxtApp.vueApp.directive('draw', drawDirective)

  if (import.meta.client) {
    nuxtApp.hook('app:mounted', () => {
      installPressFeedback()
    })
  }
})
