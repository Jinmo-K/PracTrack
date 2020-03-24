const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  totalDuration: {
    type: Number,
    default: 0,
    required: true,
  },
  logs: [{
    type: Schema.ObjectId,
    ref: 'Log',
    required: true,
  }],
  created: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updated: {
    type: Date,
    default: Date.now,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
    required: true,
  },
  start: {
    type: Date,
    default: Date.now,
    required: true,
  },
  goal: {
    type: Number,
  },
});

ActivitySchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = Activity = mongoose.model('Activity', ActivitySchema);