<template>
  <div class="login">
    <p>请扫描二维码登录</p>
    <div id="qrcode"></div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'home',
  setup () {
    let qrcode = null
    let qrTimer = ref(null)
    onMounted(() => {
      qrcode = new QRCode(document.getElementById('qrcode'), 'http://124.223.7.93/eyechat/#/login')
      setInterval(() => {
        qrTimer = qrcode.makeCode('http://124.223.7.93/eyechat/#/login')
      }, 3000)
    })
    onUnmounted(() => {
      clearInterval(qrTimer)
    })
    return {
      qrcode,
      qrTimer
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 280px;
  height: 320px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border: 2px solid #fff;
  border-radius: 2px;
  box-shadow: 0px 0px 8px #5a5a5a;
  box-sizing: border-box;
  padding: 16px 0;
  p {
    text-align: center;
  }
  #qrcode {
    padding: 16px;
    /deep/img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
