import express from 'express'
import User from './user'
import { checkExist, create } from '../../utils'

const router = express.Router()
router.post('/user/sign', (req, res) => {
  if (!req.body.userName) {
    res.json({
      success: false,
      msg: '请输入用户名!'
    })
    return
  }
  checkExist({ userName: req.body.userName }, User).then(() => {
    create(req.body, User).then(data => {
      res.json({
        success: true,
        msg: '注册成功!',
        data
      })
    }).catch(err => {
      res.json({
        success: false,
        msg: '注册失败!',
        data: {
          err
        }
      })
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '用户名已存在!',
      data: {
        err
      }
    })
  })
})

export default router
