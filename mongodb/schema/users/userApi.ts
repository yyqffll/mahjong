import express from 'express'
import User from './user'
import { checkParam, create } from '../../utils'
import { v4 } from 'uuid'

const router = express.Router()
router.post('/user/login', (req, res) => {
  if (!req.body.userName) {
    res.json({
      success: false,
      msg: '请输入用户名!'
    })
    return
  }
  User.findOne({ userName: req.body.userName }).then((data: any) => {
    const flag = checkParam(data)
    if (checkParam(data)) {
      create(Object.assign(req.body, {
        userId: v4()
      }), User).then(data => {
        res.json({
          success: true,
          msg: '登录成功!',
          data: flag
        })
      }).catch(err => {
        res.json({
          success: false,
          msg: '登录失败!',
          data: {
            err
          }
        })
      })
    } else {
      if (data.userPwd === req.body.userPwd) {
        res.json({
          success: true,
          msg: '登录成功!',
          data
        })
      } else {
        res.json({
          success: false,
          msg: '用户名或密码错误!'
        })
      }
    }
  })
})

export default router
