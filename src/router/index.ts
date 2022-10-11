import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import { getToken, getLocalStorage } from '../libs/utils'
import { request } from '@/libs/axios'
import store from '../store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/chat.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userName = getLocalStorage('userName')
  if (to.name === 'home' || to.name === 'login') {
    next()
  } else {
    if (!getToken) {
      next({ name: 'home' })
    } else if (!userName) {
      next({ name: 'home' })
    } else if (!store.state.userId) {
      try {
        const { success } = await store.dispatch('getUserInfo', { userName })
        if (success) {
          next()
        } else {
          next({ name: 'home' })
        }
      } catch (err) {
        next({ name: 'home' })
      }
    } else {
      next()
    }
  }
  return false
})

export default router
