const mongoose = require('mongoose');

const LocalizedStringSchema = {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' }
};

const SeoMetaSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  keywords: LocalizedStringSchema,
  canonicalUrl: LocalizedStringSchema,
  ogImage: {
    type: String
  },
  noIndex: {
    type: Boolean,
    default: false
  },
  noFollow: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('SeoMeta', SeoMetaSchema);
