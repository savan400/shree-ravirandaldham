const mongoose = require('mongoose');

const TranslationSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    trim: true,
  },
  key: {
    type: String,
    required: true,
    trim: true,
  },
  en: {
    type: String,
    default: ''
  },
  hi: {
    type: String,
    default: ''
  },
  gu: {
    type: String,
    default: ''
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

// Composite unique index on section + key
TranslationSchema.index({ section: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Translation', TranslationSchema);
