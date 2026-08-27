import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/css/variables.css'
import './assets/css/main.css'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())

const MyCustomPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: 'var(--primary-color-soft)',
            100: 'var(--primary-color-soft)',
            200: 'var(--primary-color)',
            300: 'var(--primary-color)',
            400: 'var(--primary-color)',
            500: 'var(--primary-color)',
            600: 'var(--primary-color-dark)',
            700: 'var(--primary-color-dark)',
            800: 'var(--primary-color-dark)',
            900: 'var(--primary-color-dark)',
            950: 'var(--primary-color-dark)'
        },
        formField: {
            borderRadius: 'var(--border-radius)'
        }
    },
})

app.use(PrimeVue, {
    theme: {
        preset: MyCustomPreset,
    }
})

app.use(router)
app.mount('#app')
