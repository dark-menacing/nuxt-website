// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxthub/core',
    'nuxt-auth-utils'
  ],
  hub: {
    database: true
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'favicon.svg'}
      ]
    }
  }
})