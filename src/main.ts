import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { v4 } from 'uuid'
import * as echarts from 'echarts'

const app = createApp(App)
app.config.globalProperties.$v4 = v4
app.config.globalProperties.$echarts = echarts

app.use(store).use(router).mount('#app')
