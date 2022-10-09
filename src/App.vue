<template>
  <router-view></router-view>
</template>

<script>
import { getCurrentInstance } from 'vue'
import axios from 'axios'
export default {
  name: 'App',
  setup () {
    const { proxy } = getCurrentInstance()
    return {}
  }
}
</script>

<style lang="less" scoped>
#app {
  height: 100vh;
  .eye {
    display: flex;
    height: 100vh;
    & > div {
      position: relative;
      width: 50vw;
      height: 100vh;
    }
  }
}
</style>
