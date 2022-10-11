import express from 'express'
import bodyParser from 'body-parser'
import userApi from './mongodb/schema/users/userApi'

const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/ecapi', userApi)

app.listen(port, () => {
  console.log('server is ready on port 3001')
})
