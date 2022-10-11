import mongoose from 'mongoose'
const dbUrl = 'mongodb://root:Yyq133136.@124.223.7.93:27017/eyeChat?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
mongoose.connect(dbUrl)
mongoose.connection.on('connected', () => {
  console.log('mongodb eyeChat is connected')
})
export default mongoose
