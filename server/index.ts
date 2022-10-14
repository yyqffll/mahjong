import express from 'express'
import bodyParser from 'body-parser'
import UserModel from './mongodb/schema/users/user'
import userApi from './mongodb/schema/users/userApi'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/ecapi', userApi)

const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: true })

io.on('connection', (socket: {
  emit(arg0: string, linkPerson: any): unknown
  on: (arg0: string, arg1: (message: any) => void) => void,
  broadcast: any,
  linkPerson: any,
}) => {
  socket.on('linkPersonIn', linkPerson => {
    console.log(linkPerson.userName, '已登录')
    socket.linkPerson = linkPerson
    // 通知所有客户端（除了自己）更新在线聊天成员
    socket.broadcast.emit('updateLinkPersonIn', linkPerson)
    UserModel.findOne({ userName: linkPerson.userName }).then((data: any) => {
      UserModel.findByIdAndUpdate({ _id: data._id }, { userStatus: 'loginIn' }, { new: true })
    })
  })
  socket.on('sendMood', linkPerson => {
    console.log(linkPerson.userMood, `${linkPerson.userName}更改了状态`)
    // 通知所有客户端（除了自己）更新心情
    socket.broadcast.emit('updateMood', linkPerson)
  })
  socket.on('disconnect', () => {
    if (!socket.linkPerson?.userName) return
    console.log(socket.linkPerson.userName, '已退出')
    // 通知所有客户端（除了自己）更新在线聊天成员
    socket.broadcast.emit('updateLinkPersonOut', socket.linkPerson)
    UserModel.findOne({ userName: socket.linkPerson.userName }).then((data: any) => {
      UserModel.findByIdAndUpdate({ _id: data._id }, { userStatus: 'loginOut' }, { new: true })
    })
  })
})

server.listen(3001, () => {
  console.log('server is ready on port 3001')
})
