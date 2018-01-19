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
  }
});

mongoose.model('idea', IdeaSchema);
