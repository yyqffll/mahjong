<template>
  <div class="main-header">
    <van-cell center>眼神</van-cell>
    <van-cell center>{{userName}}</van-cell>
  </div>
  <div class="main-container">
    <router-view v-if="isRouterActive"></router-view>
  </div>
</template>

<script>
import { computed, watch, onMounted, onUnmounted, getCurrentInstance, ref, provide, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import {
  setLocalStorage
} from '@/libs/utils'
import { Notify } from 'vant'
export default {
  name: 'App',
  setup () {
    const { proxy } = getCurrentInstance()
    const store = useStore()
    const route = useRoute()
    const isRouterActive = ref(true)
    const reload = () => {
      isRouterActive.value = false
      nextTick(() => {
        isRouterActive.value = true
      })
    }
    provide('reload', reload)

    const userName = computed(() => {
      return store.state.userName
    })
    const userData = computed(() => {
      return store.state.userData
    })
    const routeName = computed(() => {
      return route.name
    })
    const loginoutMobile = () => {
      setLocalStorage('loginoutMobile', 'loginoutMobile')
    }
    watch(
      userName,
      val => {
        console.log(val, 'val')
        if (val) {
          // 用户登录则把状态分发给其他用户
          proxy.$socket.emit('linkPersonIn', userData.value)
          // 更改登录状态
          if (userData.value?.userStatus !== 'loginIn') {
            proxy.$axios({
              url: '/ecapi/user/update',
              data: Object.assign({}, userData.value, { userStatus: 'loginIn' })
            })
          }
        }
      }
    )
    onMounted(async () => {
      // 监听其他登录用户
      proxy.$socket.on('updateLinkPersonIn', (linkPerson) => {
        if (routeName.value === 'chat') {
          Notify({ type: 'success', message: `${linkPerson.userName}登录` })
        }
        store.commit('setChatPerson', linkPerson.userName)
      })
      // 监听其他退出用户
      proxy.$socket.on('updateLinkPersonOut', linkPerson => {
        if (routeName.value === 'chat') {
          Notify({ type: 'success', message: `${linkPerson.userName}退出` })
        }
        store.commit('delChatPerson', linkPerson.userName)
      })
      // 禁止双指放大
      document.documentElement.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
          event.preventDefault()
        }
      }, { passive: false })
      // 禁止双击放大
      let lastTouchEnd = 0
      document.documentElement.addEventListener('touchend', function (event) {
        var now = Date.now()
        if (now - lastTouchEnd <= 300) {
          event.preventDefault()
        }
        lastTouchEnd = now
      }, { passive: false })
    })
    onUnmounted(() => {
      proxy.$socket.removeAllListeners('updateLinkPersonIn')
      proxy.$socket.removeAllListeners('updateLinkPersonOut')
    })
    return {
      isRouterActive,
      reload,
      userName,
      userData,
      routeName,
      loginoutMobile
    }
  },
}

</script>

<style lang="less" scoped>
.main-header {
  background: #fff;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #b5b2b2;
  padding: 0 24px;
  .van-cell {
    padding: 0;
    font-size: 18px;
    &:last-child {
      /deep/.van-cell__value {
        text-align: end;
      }
    }
    &::after {
      border: none;
    }
  }
}
.main-container {
  height: calc(100% - 60px);
}
</style>
