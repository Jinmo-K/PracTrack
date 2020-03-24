const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
    default: 1,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  activities: [{
    type: Schema.ObjectId,
    ref: 'Activity',
  }],
  config: {
    sortActivitiesBy: {
      column: {
        type: String,
        required: true,
        default: 'name',
      },
      order: {
        type: Number,
        required: true,
        default: 1,
      }
    },
  }
});

module.exports = User = mongoose.model("User", UserSchema);
