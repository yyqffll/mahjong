import express from 'express'
import bodyParser from 'body-parser'
import userApi from '../mongodb/Schema/users/userApi'

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', userApi)

app.listen(port, () => {
  console.log('server is ready on port 3000')
})
