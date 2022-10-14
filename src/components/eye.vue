<template>
  <van-cell v-if="!target && !canChangeStatus" class="notice" center>请选择左边的交流对象</van-cell>
  <template v-else>
    <div class="fun-group" v-show="canChangeStatus">
      <van-button type="primary" @click="toWeakup(true, 'week', this.userData)">唤醒</van-button>
      <van-button type="primary" @click="toSleep(true, 'sleep', this.userData)">休眠</van-button>
      <van-button type="danger" @click="toAngly(true, 'angry', this.userData)">生气</van-button>
    </div>
    <div :class="{'eyeSocket': true, 'eyeSocketAngry': isAngly}" :id="`bigEye-${id}`">
      <div class="eyeball" :id="id"></div>
    </div>
  </template>
</template>

<script>
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
  data () {
    return {
      rotTimer: null, // 定时器
      bigEye: null,
      eyeball: null,
      eyeballChart: null,
      leftRotSize: 0, // 旋转角度
      ballSize: 12, // 眼睛尺寸
      radius: -20,
      isSleep: false, // 是否处于休眠状态
      isWeep: false, // 是否处于唤醒状态
      isAngly: false, // 是否处于生气状态
      // 生气的时候 isWeep: true; isAngry: true;
      ballColor: 'rgb(0, 238, 255)' // 默认透明，其实默认是啥都无所谓，反正看不见
    }
  },
  computed: {
    userData () {
      return this.$store.state.userData
    }
  },
  watch: {
    target: {
      handler (val) {
        if (val) {
          this.$nextTick(() => {
            if (!this.eyeballChart) {
              this.init()
            }
            if (this.canChangeStatus) return
            switch (val.userMood) {
              case ('week'):
                this.toWeakup(false, 'week', val)
                break
              case ('sleep'):
                this.toSleep(false, 'sleep', val)
                break
              case ('angry'):
                this.toAngly(false, 'angry', val)
                break
            }
          })
        }
      },
      deep: true
    }
  },
  mounted () {
    if (this.canChangeStatus) {
      this.init()
      switch (this.userData.userMood) {
        case ('week'):
          this.toWeakup(false, 'week', this.userData)
          break
        case ('sleep'):
          this.toSleep(false, 'sleep', this.userData)
          break
        case ('angry'):
          this.toAngly(false, 'angry', this.userData)
          break
      }
    }
  },
  methods: {
    init () {
      this.bigEye = document.getElementById(`bigEye-${this.id}`)
      this.eyeball = document.getElementById(this.id)
      this.eyeballChart = this.$echarts.init(this.eyeball)
      this.getEyeballChart()
      window.onresize = () => {
        this.eyeballChart.resize()
      }
    },
    getEyeballChart () {
      this.eyeballChart.setOption({
        series: [
          {
            type: 'gauge', // 使用仪表盘类型
            radius: `${this.radius}%`, // 采用负数是为了让分割线从内向外延伸
            clockwise: false,
            startAngle: `${0 + this.leftRotSize * 5}`, // 加为逆时针旋转，乘5表示速度为leftRotSize的倍
            endAngle: `${270 + this.leftRotSize * 5}`, // 即变为每10微秒移动0.5度，1234678同理
            splitNumber: 3, // 分割数量，会将270度分割为3份，所以有四根线
            detail: false,
            axisLine: {
              show: false
            },
            axisTick: false,
            splitLine: {
              show: true,
              length: this.ballSize, // 分割线高度设置为眼球尺寸变量
              lineStyle: {
                shadowBlur: 20, // 阴影渐变
                shadowColor: this.ballColor, // 阴影颜色
                shadowOffsetY: '0',
                color: this.ballColor, // 分割线颜色
                width: 4 // 分割线宽度
              }
            },
            axisLabel: false
          },
          {
            type: 'gauge',
            radius: `${this.radius}%`,
            clockwise: false,
            startAngle: `${45 + this.leftRotSize * 5}`,
            endAngle: `${315 + this.leftRotSize * 5}`,
            splitNumber: 3,
            detail: false,
            axisLine: {
              show: false
            },
            axisTick: false,
            splitLine: {
              show: true,
              length: this.ballSize, // 分割线高度设置为眼球尺寸变量
              lineStyle: {
                shadowBlur: 20,
                shadowColor: this.ballColor,
                shadowOffsetY: '0',
                color: this.ballColor,
                width: 4
              }
            },
            axisLabel: false
          }
        ]
      })
    },

    // 生气模式
    setAngry () {
      this.isAngly = true
      this.ballColor = 'rgb(208,14,74)'
    },
    // 常态模式
    setNormal () {
      this.isAngly = false
      this.ballColor = 'rgb(0,238,255)'
    },

    toChangeMood (userMood, userData) {
      return new Promise((resolve, reject) => {
        this.$axios({
          url: '/ecapi/user/update',
          data: Object.assign({}, userData, { userMood })
        }).then(res => {
          this.$store.commit('setUserMood', res.data.userMood)
          this.$store.commit('setUserData', res.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 唤醒
    async toWeakup (update = true, userMood, userData) {
      if (this.isWeep && !(this.isWeep && this.isAngly)) return
      let flag = { success: true }
      try {
        if (update) {
          flag = await this.toChangeMood(userMood, userData)
        }
        if (!flag.success) return
        this.$socket.emit('message', 1)
        this.setNormal()
        const st = window.getComputedStyle(this.bigEye, null)
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
              const scaleFlag = Number(this.bFun(scale).minus(0.0005).toString())
              scale = scaleFlag < 1 ? 1 : scaleFlag
            } else {
              clearInterval(scaleTimer)
            }
            this.bigEye.style.transform = `scale(${scale})`
          }, 0)
        }
        this.isSleep = false
        this.isWeep = true
        this.bigEye.className = 'eyeSocket' // 清除休眠状态
        clearInterval(this.rotTimer) // 清除定时器
        this.rotTimer = setInterval(() => {
          this.getEyeballChart()
          this.ballSize <= 12 && (this.ballSize += 0.1)
          this.leftRotSize === 360 ? (this.leftRotSize = 0) : (this.leftRotSize += 0.1)
          if (this.radius > -20) {
            this.radius -= 0.1
          }
        }, 10)
      } catch (err) {
        Notify({ type: 'danger', message: err.msg })
      }
    },

    // 休眠
    async toSleep (update = true, userMood, userData) {
      if (this.isSleep) return
      let flag = { success: true }
      try {
        if (update) {
          flag = await this.toChangeMood(userMood, userData)
        }
        if (!flag.success) return
        this.setNormal()
        this.isSleep = true
        this.isWeep = false
        clearInterval(this.rotTimer) // 清除定时器
        this.rotTimer = setInterval(() => {
          this.getEyeballChart()
          if (this.ballSize > 0) {
            this.ballSize -= 0.1 // 当眼球存在时慢慢减小
          } else {
            this.bigEye.className = 'eyeSocket eyeSocketSleeping' // 眼球消失后添加呼吸
          }
          this.leftRotSize === 360 ? (this.leftRotSize = 0) : (this.leftRotSize += 0.1) // 旋转，
          if (this.radius < 0) {
            this.radius += 0.1
          }
        }, 10)
      } catch (err) {
        Notify({ type: 'danger', message: err.msg })
      }
    },

    // 生气
    async toAngly (update = true, userMood, userData) {
      if (this.isAngly) return
      let flag = { success: true }
      try {
        if (update) {
          flag = await this.toChangeMood(userMood, userData)
        }
        if (!flag.success) return
        this.toWeakup(false, 'week')
        this.setAngry()
      } catch (err) {
        Notify({ type: 'danger', message: err.msg })
      }
    },

    bFun (val) {
      return new BigNumber(val)
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
