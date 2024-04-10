const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  // Optional fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  queryLimit: {
    type: Number,
    default: 1000,
    per: {
      type: String,
      enum: ['minute', 'hour', 'day'],
      default: 'day'
    }
  },
  expiresAt: Date
});


module.exports = mongoose.model('ApiKey', apiKeySchema, 'apikeys');
