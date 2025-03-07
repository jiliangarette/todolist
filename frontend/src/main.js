import './styles/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import route from './router/routes'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const app = createApp(App)
const pinia = createPinia()

app.use(route)
app.use(pinia)
app.mount('#app')
