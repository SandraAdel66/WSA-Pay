export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,
  pinia: {
    autoImports: ['defineStore'],
  },
  runtimeConfig: {
    public: {
      appUrl: process.env.APP_URL ?? 'http://localhost:3300',
      apiUrl: `${process.env.APP_URL ?? 'http://localhost:3300'}/backend`,
    },
  },
  nitro: {
    routeRules: {
      '/backend/**': {
        proxy: `${process.env.API_URL ?? 'http://127.0.0.1:8000'}/**`,
      },
      '/get-geoip/**': {
        proxy: `http://ip-api.com/json/**`,
      },
    },
    compressPublicAssets: true,
  },
  
  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@pinia/nuxt'
    
   ],

  image: {
    inject: true,
    quality: 65,
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
  imports: {
    dirs: ['./stores'],
  },
  app: {
    head: {
      title: 'WSA PAY',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'description', content: 'Vuexy admin is super flexible, powerful, clean & modern responsive bootstrap 4 admin template with unlimited possibilities.' },
        { name: 'keywords', content: 'admin template, Vuexy admin template, dashboard template, flat admin template, responsive admin template, web app' },
        { name: 'author', content: 'PIXINVENT' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/app-assets/images/ico/apple-icon-120.html' },
        { rel: 'icon', type: 'image/x-icon', href: '/app-assets/images/ico/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/vendors.min.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/charts/apexcharts.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/extensions/tether-theme-arrows.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/extensions/tether.min.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/extensions/shepherd-theme-default.css' },
        { rel: 'stylesheet', href: '/app-assets/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/bootstrap-extended.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/colors.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/components.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/themes/dark-layout.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/themes/semi-dark-layout.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/core/menu/menu-types/vertical-menu.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/core/colors/palette-gradient.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/pages/dashboard-analytics.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/pages/card-analytics.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/plugins/tour/tour.min.css' },
        { rel: 'stylesheet', href: '/assets/css/style.css' }
      ],
      script: [
        { src: '/app-assets/vendors/js/vendors.min.js', defer: true },
        { src: '/app-assets/vendors/js/charts/apexcharts.min.js', defer: true },
        { src: '/app-assets/vendors/js/extensions/tether.min.js', defer: true },
        { src: '/app-assets/vendors/js/extensions/shepherd.min.js', defer: true },
        { src: '/app-assets/js/core/app-menu.min.js', defer: true },
        { src: '/app-assets/js/core/app.min.js', defer: true },
        { src: '/app-assets/js/scripts/components.min.js', defer: true },
        { src: '/app-assets/js/scripts/customizer.min.js', defer: true },
        { src: '/app-assets/js/scripts/footer.min.js', defer: true },
        { src: '/app-assets/js/scripts/pages/dashboard-analytics.min.js', defer: true },

      ]

    }
  }
})
