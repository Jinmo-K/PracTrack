const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const LogSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  activityId: {
    type: Schema.ObjectId,
    ref: 'Activity',
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
  }
});

module.exports = Log = mongoose.model('Log', LogSchema);