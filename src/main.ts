import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { request } from './libs/axios'
import { v4 } from 'uuid'
import * as echarts from 'echarts'
import {
  Form,
  Field,
  CellGroup,
  Button,
  PullRefresh,
  List,
  Cell
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.config.globalProperties.$axios = request
app.config.globalProperties.$v4 = v4
app.config.globalProperties.$echarts = echarts

app.use(Form)
app.use(Field)
app.use(CellGroup)
app.use(Button)
app.use(PullRefresh)
app.use(List)
app.use(Cell)

app.use(store).use(router).mount('#app')
