import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import * as ElementPlusIconsVue from "@heroicons/vue/24/outline"
import VueCookies from 'vue-cookies'

const app = createApp(App);
app.use(VueCookies);
app.use(router);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
    console.log(key);
}

app.mount('#app');