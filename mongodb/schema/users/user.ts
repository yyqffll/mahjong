import mongoose from '../../index'
const Schema = mongoose.Schema
const UserSchema = new Schema({
  userId: { type: String },
  userName: { type: String },
  userPwd: { type: String }
})
const UserModel = mongoose.model('users', UserSchema)
export default UserModel
