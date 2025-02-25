const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl:{
    type: String,
    default: "NaN"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});
const Message = mongoose.model('Message', messageSchema);