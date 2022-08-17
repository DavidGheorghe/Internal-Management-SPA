import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import "@/assets/colors.less";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
createApp(App)
    .use(router)
    .use(pinia)
    .use(ElementPlus)
    .mount('#app')
