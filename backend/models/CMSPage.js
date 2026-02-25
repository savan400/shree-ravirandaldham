const mongoose = require('mongoose');

const cmsPageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    gu: { type: String, required: true }
  },
  badgeText: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    gu: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    gu: { type: String, required: true }
  }, // Rich text HTML
  quote: {
    en: { type: String },
    hi: { type: String },
    gu: { type: String }
  },
  images: [{ url: { type: String, required: true }, caption: { en: { type: String }, hi: { type: String }, gu: { type: String } } }], // Wasabi keys
  analytics: [{
    key: { type: String },
    value: { type: String },
    image: { type: String }, // Wasabi key
    title: {
      en: { type: String },
      hi: { type: String },
      gu: { type: String }
    },
    description: {
      en: { type: String },
      hi: { type: String },
      gu: { type: String }
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('CMSPage', cmsPageSchema);
