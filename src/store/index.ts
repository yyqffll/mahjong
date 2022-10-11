import { createStore } from 'vuex'
import { request } from '@/libs/axios'
import {
  getToken,
  setToken,
  setLocalStorage
} from '@/libs/utils'
export default createStore({
  state: {
    token: getToken(),
    userId: '',
    userName: '',
    userStatus: '',
    userMood: '',
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
    },
    setUserStatus(state, userStatus) {
      state.userStatus = userStatus
    },
    setUserMood(state, userMood) {
      state.userMood = userMood
    }
  },
  actions: {
    login({ commit }, { userName, userPwd }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/ecapi/user/login',
          data: {
            userName,
            userPwd
          }
        }).then(res => {
          commit('setToken', 'logined')
          commit('setUserId', res.data.userId)
          commit('setUserName', res.data.userName)
          commit('setUserStatus', res.data.userStatus)
          commit('setUserMood', res.data.userMood)
          setLocalStorage('userName', res.data.userName)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getUserInfo({ commit }, { userName }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/ecapi/user/findOne',
          data: {
            userName
          }
        }).then(res => {
          commit('setUserId', res.data.userId)
          commit('setUserName', res.data.userName)
          commit('setUserStatus', res.data.userStatus)
          commit('setUserMood', res.data.userMood)
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
