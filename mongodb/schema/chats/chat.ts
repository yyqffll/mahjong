import mongoose from '../../index'
const Schema = mongoose.Schema
const ChatSchema = new Schema({
})
const ChatModel = mongoose.model('chats', ChatSchema)
export default ChatModel
