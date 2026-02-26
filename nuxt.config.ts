export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/google-fonts',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    turso: {
      databaseUrl: '',
      authToken: '',
    },
    resendApiKey: '',
    betterAuth: {
      secret: '',
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#f5f3f8' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      ],
      title: 'auklm | Mon Cycle',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },

  googleFonts: {
    families: {
      'Plus Jakarta Sans': [400, 500, 600, 700],
      'DM Sans': [400, 500, 600, 700],
    },
    display: 'swap',
    download: true,
    overwriting: false,
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'auklm | Mon Cycle',
      short_name: 'auklm',
      description: 'Suivi de cycle menstruel simple et élégant',
      theme_color: '#f5f3f8',
      background_color: '#f5f3f8',
      display: 'standalone',
      scope: '/',
      start_url: '/login',
      orientation: 'portrait',
      lang: 'fr',
      icons: [
        {
          src: '/pwa-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    },
  },
})
