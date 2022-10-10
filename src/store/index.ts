import { createStore } from 'vuex'
import { request } from '@/libs/axios'
import {
  getToken,
  setToken
} from '@/libs/utils'
export default createStore({
  state: {
    token: getToken(),
    userId: '',
    userName: ''
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setUserId(state, userId) {
      state.userId = userId
    },
    setUserName(state, userName) {
      state.userName = userName
    }
  },
  actions: {
    login({ commit }, { userName, userPwd }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/api/user/login',
          data: {
            userName,
            userPwd
          }
        }).then(res => {
          commit('setToken', 'logined')
          commit('setUserId', res.data.userId)
          commit('setUserName', res.data.userName)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  modules: {
  }
})
