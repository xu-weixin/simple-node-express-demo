const mongoose = require('mongoose');
const { Schema } = mongoose;

const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  }
});

mongoose.model('idea', IdeaSchema);
