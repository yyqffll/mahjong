<template>
  <div class="main-header">
    <span>眼神</span>
    <span>{{userName}}</span>
  </div>
  <div class="main-container">
    <router-view></router-view>
  </div>
</template>

<script>
import { onMounted, computed, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'App',
  setup () {
    const store = useStore()
    const userName = computed(() => {
      return store.state.userName
    })
    onMounted(async () => {
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
    return {
      userName
    }
  }
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
}
.main-container {
  height: calc(100% - 60px);
}
</style>
