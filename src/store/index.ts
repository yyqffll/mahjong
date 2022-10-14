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
    userData: null,
    chatPerson: [] as string[]
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
    },
    setUserData(state, userData) {
      state.userData = userData
    },
    setChatPerson(state, chatPerson) {
      state.chatPerson.indexOf(chatPerson) < 0 && state.chatPerson.push(chatPerson)
    },
    delChatPerson(state, chatPerson) {
      if (state.chatPerson.indexOf(chatPerson) > -1) {
        state.chatPerson.splice(state.chatPerson.indexOf(chatPerson), 1)
      }
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
          commit('setUserData', res.data)
          setLocalStorage('userName', res.data.userName)
          // sessionStorage.setItem('refresh', 'refresh')
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
          commit('setUserData', res.data)
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
