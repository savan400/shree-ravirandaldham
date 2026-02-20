const mongoose = require('mongoose');

const SeoMetaSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
    index: true
  },
  locale: {
    type: String,
    required: true,
    enum: ['en', 'hi', 'gu'],
    default: 'en'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  keywords: {
    type: String
  },
  ogImage: {
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

// Composite index for route and locale
SeoMetaSchema.index({ route: 1, locale: 1 }, { unique: true });

module.exports = mongoose.model('SeoMeta', SeoMetaSchema);
