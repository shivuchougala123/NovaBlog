const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  commentText: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Comment', commentSchema)
