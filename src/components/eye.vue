<template>
  <van-cell v-if="!target && !canChangeStatus" class="notice" center>请选择左边的交流对象</van-cell>
  <template v-else>
    <div class="fun-group" v-show="canChangeStatus">
      <van-button type="primary" @click="toWeakup(true, 'week', userData)">唤醒</van-button>
      <van-button type="primary" @click="toSleep(true, 'sleep', userData)">休眠</van-button>
      <van-button type="danger" @click="toAngly(true, 'angry', userData)">生气</van-button>
    </div>
    <div :class="{'eyeSocket': true, 'eyeSocketAngry': isAngly}" :id="`bigEye-${id}`">
      <div class="eyeball" :id="id"></div>
    </div>
  </template>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, nextTick, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import BigNumber from 'bignumber.js'
import { Notify } from 'vant'
export default {
  name: 'eye',
  props: {
    id: {
      default: ''
    },
    target: {
      default: null,
      type: Object
    },
    canChangeStatus: {
      default: true,
      type: Boolean
    }
  },
  setup (props, ctx) {
    const { proxy } = getCurrentInstance()
    const store = useStore()
    const userData = computed(() => {
      return store.state.userData
    })
    const controlModel = reactive({
      toChangeMood: (userMood, userData) => {
        return new Promise((resolve, reject) => {
          proxy.$axios({
            url: '/ecapi/user/update',
            data: Object.assign({}, userData, { userMood })
          }).then(res => {
            proxy.$socket.emit('sendMood', res.data)
            store.commit('setUserMood', res.data.userMood)
            store.commit('setUserData', res.data)
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      // 常态模式
      setNormal: () => {
        eyeModel.isAngly = false
        eyeModel.ballColor = 'rgb(0,238,255)'
      },
      // 生气模式
      setAngry: () => {
        eyeModel.isAngly = true
        eyeModel.ballColor = 'rgb(208,14,74)'
      },
      // 唤醒
      toWeakup: async (update = true, userMood, userData) => {
        if (eyeModel.isWeep && !(eyeModel.isWeep && eyeModel.isAngly)) return
        let flag = { success: true }
        try {
          if (update) {
            flag = await controlModel.toChangeMood(userMood, userData)
          }
          if (!flag.success) return
          proxy.$socket.emit('message', 1)
          controlModel.setNormal()
          const st = window.getComputedStyle(eyeModel.bigEye, null)
          const tr = st.getPropertyValue('transform')
          const values = tr?.split('(')[1]?.split(')')[0]?.split(',')
          if (values) {
            const a = values[0]
            const b = values[1]
            const c = values[2]
            const d = values[3]
            let scale = Math.sqrt(a * a + b * b)
            const scaleTimer = setInterval(() => {
              if (scale > 1) {
                const scaleFlag = Number(eyeModel.bFun(scale).minus(0.0005).toString())
                scale = scaleFlag < 1 ? 1 : scaleFlag
              } else {
                clearInterval(scaleTimer)
              }
              eyeModel.bigEye.style.transform = `scale(${scale})`
            }, 0)
          }
          eyeModel.isSleep = false
          eyeModel.isWeep = true
          eyeModel.bigEye.className = 'eyeSocket' // 清除休眠状态
          clearInterval(eyeModel.rotTimer) // 清除定时器
          eyeModel.rotTimer = setInterval(() => {
            eyeModel.getEyeballChart()
            eyeModel.ballSize <= 12 && (eyeModel.ballSize += 0.1)
            eyeModel.leftRotSize === 360 ? (eyeModel.leftRotSize = 0) : (eyeModel.leftRotSize += 0.1)
            if (eyeModel.radius > -20) {
              eyeModel.radius -= 0.1
            }
          }, 10)
        } catch (err) {
          Notify({ type: 'danger', message: err.msg })
        }
      },
      // 休眠
      toSleep: async (update = true, userMood, userData) => {
        if (eyeModel.isSleep) return
        let flag = { success: true }
        try {
          if (update) {
            flag = await controlModel.toChangeMood(userMood, userData)
          }
          if (!flag.success) return
          controlModel.setNormal()
          eyeModel.isSleep = true
          eyeModel.isWeep = false
          clearInterval(eyeModel.rotTimer) // 清除定时器
          eyeModel.rotTimer = setInterval(() => {
            eyeModel.getEyeballChart()
            if (eyeModel.ballSize > 0) {
              eyeModel.ballSize -= 0.1 // 当眼球存在时慢慢减小
            } else {
              eyeModel.bigEye.className = 'eyeSocket eyeSocketSleeping' // 眼球消失后添加呼吸
            }
            eyeModel.leftRotSize === 360 ? (eyeModel.leftRotSize = 0) : (eyeModel.leftRotSize += 0.1) // 旋转，
            if (eyeModel.radius < 0) {
              eyeModel.radius += 0.1
            }
          }, 10)
        } catch (err) {
          Notify({ type: 'danger', message: err.msg })
        }
      },
      // 生气
      toAngly: async (update = true, userMood, userData) => {
        if (eyeModel.isAngly) return
        let flag = { success: true }
        try {
          if (update) {
            flag = await controlModel.toChangeMood(userMood, userData)
          }
          if (!flag.success) return
          controlModel.toWeakup(false, 'week')
          controlModel.setAngry()
        } catch (err) {
          Notify({ type: 'danger', message: err.msg })
        }
      }
    })
    const toControlModel = toRefs(controlModel)
    const eyeModel = reactive({
      isWeep: false, // 是否处于唤醒状态
      isSleep: false, // 是否处于休眠状态
      isAngly: false, // 是否处于生气状态
      // 生气的时候 isWeep: true; isAngry: true
      bigEye: null,
      eyeball: null,
      eyeballChart: null,
      ballSize: 12, // 眼睛尺寸
      leftRotSize: 0, // 旋转角度
      radius: -20,
      ballColor: 'rgb(0, 238, 255)',
      rotTimer: null, // 定时器
      bFun: val => {
        return new BigNumber(val)
      },
      getEyeballChart: () => {
        eyeModel.eyeballChart.setOption({
          series: [
            {
              type: 'gauge', // 使用仪表盘类型
              radius: `${eyeModel.radius}%`, // 采用负数是为了让分割线从内向外延伸
              clockwise: false,
              startAngle: `${0 + eyeModel.leftRotSize * 5}`, // 加为逆时针旋转，乘5表示速度为leftRotSize的倍
              endAngle: `${270 + eyeModel.leftRotSize * 5}`, // 即变为每10微秒移动0.5度，1234678同理
              splitNumber: 3, // 分割数量，会将270度分割为3份，所以有四根线
              detail: false,
              axisLine: {
                show: false
              },
              axisTick: false,
              splitLine: {
                show: true,
                length: eyeModel.ballSize, // 分割线高度设置为眼球尺寸变量
                lineStyle: {
                  shadowBlur: 20, // 阴影渐变
                  shadowColor: eyeModel.ballColor, // 阴影颜色
                  shadowOffsetY: '0',
                  color: eyeModel.ballColor, // 分割线颜色
                  width: 4 // 分割线宽度
                }
              },
              axisLabel: false
            },
            {
              type: 'gauge',
              radius: `${eyeModel.radius}%`,
              clockwise: false,
              startAngle: `${45 + eyeModel.leftRotSize * 5}`,
              endAngle: `${315 + eyeModel.leftRotSize * 5}`,
              splitNumber: 3,
              detail: false,
              axisLine: {
                show: false
              },
              axisTick: false,
              splitLine: {
                show: true,
                length: eyeModel.ballSize, // 分割线高度设置为眼球尺寸变量
                lineStyle: {
                  shadowBlur: 20,
                  shadowColor: eyeModel.ballColor,
                  shadowOffsetY: '0',
                  color: eyeModel.ballColor,
                  width: 4
                }
              },
              axisLabel: false
            }
          ]
        })
      },
      init: () => {
        eyeModel.bigEye = document.getElementById(`bigEye-${props.id}`)
        eyeModel.eyeball = document.getElementById(props.id)
        eyeModel.eyeballChart = proxy.$echarts.init(eyeModel.eyeball)
        eyeModel.getEyeballChart()
        window.onresize = () => {
          eyeModel.eyeballChart.resize()
        }
      }
    })
    const toEyeModel = toRefs(eyeModel)
    watch(
      () => props.target,
      val => {
        if (val) {
          nextTick(() => {
            if (!eyeModel.eyeballChart) {
              eyeModel.init()
            }
            if (props.canChangeStatus) return
            switch (val.userMood) {
              case ('week'):
                controlModel.toWeakup(false, 'week', val)
                break
              case ('sleep'):
                controlModel.toSleep(false, 'sleep', val)
                break
              case ('angry'):
                controlModel.toAngly(false, 'angry', val)
                break
            }
          })
        }
      },
      { deep: true }
    )
    onMounted(() => {
      if (props.canChangeStatus) {
        eyeModel.init()
        switch (userData.value.userMood) {
          case ('week'):
            controlModel.toWeakup(false, 'week', userData.value)
            break
          case ('sleep'):
            controlModel.toSleep(false, 'sleep', userData.value)
            break
          case ('angry'):
            controlModel.toAngly(false, 'angry', userData.value)
            break
        }
      }
      // 监听其他用户更改mood
      proxy.$socket.on('updateMood', linkPerson => {
        if (linkPerson.userName === props.target.userName) {
          ctx.emit('update:target', linkPerson)
        }
        Notify({ type: 'success', message: `${linkPerson.userName}改了状态,${props.target.userMood}` })
      })
    })
    return {
      userData,
      ...toControlModel,
      ...toEyeModel
    }
  }
}
</script>

<style lang="less" scoped>
.notice {
  height: 100%;
  background: black;
  /deep/.van-cell__value {
    color: #fff;
    text-align: center;
    font-size: 18px;
  }
}
.fun-group {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}

.eyeSocket {
  position: absolute;
  left: calc(50% - 75px);
  top: calc(50% - 75px);
  width: 150px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 4px solid rgb(41, 104, 217);
  z-index: 1;
  border: 4px solid var(--c-eyeSocket);
  box-shadow: 0px 0px 50px var(--c-eyeSocket-outer-shadow);
  /* 当生气时添加红色外发光，常态则保持透明 */
  transition: border 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
  /* 添加过渡效果 */

  --c-eyeSocket: rgb(41, 104, 217);
  --c-eyeSocket-outer: #02ffff;
  --c-eyeSocket-outer-shadow: transparent;
  --c-eyeSocket-inner: rgb(35, 22, 140);
}

.eyeSocketAngry {
  --c-eyeSocket: rgb(255, 187, 255);
  --c-eyeSocket-outer: rgb(238, 85, 135);
  --c-eyeSocket-outer-shadow: rgb(255, 60, 86);
  --c-eyeSocket-inner: rgb(208, 14, 74);
}

.eyeSocket::before,
.eyeSocket::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  box-sizing: border-box;
  transition: all 0.5s ease-in-out;
  /* 添加过渡效果 */
}

.eyeSocket::before {
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  border: 6px solid #02ffff;
  border: 6px solid var(--c-eyeSocket-outer);
}

.eyeSocket::after {
  width: 100%;
  height: 100%;
  border: 4px solid rgb(35, 22, 140);
  box-shadow: inset 0px 0px 30px rgb(35, 22, 140);
  border: 4px solid var(--c-eyeSocket-inner);
  box-shadow: inset 0px 0px 30px var(--c-eyeSocket-inner);
}

.eyeball {
  width: 100%;
  height: 100%;
}

.eyeSocketWeeking {
  animation: weeking 6s linear;
}

.eyeSocketSleeping {
  animation: sleeping 6s infinite;
}

@keyframes weeking {
  from {
  }

  to {
    transform: scale(1);
  }
}

@keyframes sleeping {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
