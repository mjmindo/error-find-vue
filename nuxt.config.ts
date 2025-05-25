// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: false,
    typeCheck: false
  },
  routeRules: {
    '/api/**': {
      proxy: 'https://s3.eu-west-2.amazonaws.com/interview.mock.data/**'
    }
  },
  imports: {
		dirs: [
			'composables',
			'composables/*/index.{ts,js,mjs,mts}',
			'composables/**',
			'stores',
      'types'
		]
	},
	build: {
		transpile: []
	},
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  // Enable source maps in development
  sourcemap: {
    server: true,
    client: true
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://s3.eu-west-2.amazonaws.com/interview.mock.data'
    }
  },
})
