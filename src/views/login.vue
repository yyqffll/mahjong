<template>
  <van-form @submit="onSubmit" class="login-form">
    <van-cell-group inset>
      <van-field
        v-model="userName"
        name="userName"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="userPwd"
        type="password"
        name="userPwd"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">提交</van-button>
    </div>
  </van-form>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Notify } from 'vant'

export default {
  setup () {
    const store = useStore()
    const router = useRouter()
    const userName = ref('')
    const userPwd = ref('')
    const onSubmit = (values) => {
      store.dispatch('login', values).then(res => {
        if (res.success) {
          Notify({ type: 'success', message: res.msg })
          router.replace('/chat')
        }
      }).catch(err => {
        console.log(err)
        Notify(err.msg)
      })
    }

    return {
      userName,
      userPwd,
      onSubmit
    }
  }
}
</script>

<style lang="less" scoped>
.login-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
