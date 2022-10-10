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
</style>
