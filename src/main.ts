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
import 'amfe-flexible'
import SocketIO from './libs/io'

const app = createApp(App)
const devHosturl = 'http://localhost:3001'
const proHosturl = 'http://124.223.7.93:3001'
const baseUrl = process.env.NODE_ENV === 'development' ? devHosturl : proHosturl

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

app.use(SocketIO, {
  connection: baseUrl,
  options: {
    autoConnect: true, // 自动连接
    transports: ['websocket'], // 指定为websocket连接
    reconnect: true,
    reconnectionAttempts: 5, // 重连次数
    'sync disconnect on unload': false
  }
})

app.use(store).use(router).mount('#app')
