const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' }
  },
  description: {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' }
  },
  location: {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' }
  },
  time: {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' }
  },
  date: {
    type: String, // Storing as string to match existing format like "02.04.2026"
    required: true
  },
  images: [{
    type: String
  }],
  coverImage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);
