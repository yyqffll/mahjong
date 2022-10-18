import express from 'express'
import User from './user'
import { checkParam, create, findOne } from '../../utils'
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
    if (checkParam(data)) {
      create(Object.assign(req.body, {
        userId: v4(),
        userStatus: 'loginOut',
        userMood: 'awake'
      }), User).then((data: any) => {
        User.findByIdAndUpdate({
          _id: data._id
        }, {
          userStatus: 'loginIn'
        }, {
          new: true
        }).then(data => {
          res.json({
            success: true,
            msg: '登录成功!',
            data
          })
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
        User.findByIdAndUpdate({
          _id: data._id
        }, {
          userStatus: 'loginIn'
        }, {
          new: true
        }).then(data => {
          res.json({
            success: true,
            msg: '登录成功!',
            data
          })
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

router.post('/user/findOne', (req, res) => {
  findOne(req.body, User).then(data => {
    res.json({
      success: true,
      msg: '用户获取成功!',
      data
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '用户获取失败!',
      data: {
        err
      }
    })
  })
})

router.post('/user/find', (req, res) => {
  const page = req.body.page
  const rows = req.body.rows
  const userName = req.body.userName
  const totalPromise = new Promise((resolve, reject) => {
    User.find({ userName: { $ne: userName } }).count().then(total => {
      resolve(total)
    }).catch(err => {
      reject(err)
    })
  })
  const listPromise = new Promise((resolve, reject) => {
    User.find({ userName: { $ne: userName } }).limit(rows).skip((page - 1) * rows).sort({ _id: 1 }).then(data => {
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
  Promise.all([totalPromise, listPromise]).then(data => {
    res.json({
      success: true,
      msg: '用户列表获取成功!',
      data: {
        total: data[0],
        data: data[1]
      }
    })
  }).catch(err => {
    res.json({
      success: false,
      msg: '用户列表获取失败!',
      data: {
        err
      }
    })
  })
})

router.post('/user/update', (req, res) => {
  User.findOne({ userName: req.body.userName }).then((data: any) => {
    if (!checkParam(data)) {
      User.findByIdAndUpdate({
        _id: data._id
      }, {
        userStatus: req.body?.userStatus,
        userMood: req.body?.userMood
      }, {
        new: true
      }).then(data => {
        res.json({
          success: true,
          msg: '修改状态成功!',
          data
        })
      }).catch(err => {
        res.json({
          success: false,
          msg: '修改状态失败!',
          data: {
            err
          }
        })
      })
    } else {
      res.json({
        success: false,
        msg: '异常错误,请联系管理员'
      })
    }
  })
})

export default router
