import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import { getToken } from '../libs/utils'

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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'home' || to.name === 'login') {
    next()
  } else {
    if (!getToken) {
      next({
        name: 'home'
      })
    } else {
      next()
    }
  }
  return false
})

export default router
