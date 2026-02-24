const mongoose = require('mongoose');

const ImageItemSchema = new mongoose.Schema({
  key: { type: String, required: true },  // Wasabi object key
  description: {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' },
  },
}, { _id: true, timestamps: true });

const GallerySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' },
  },
  coverImage: { type: String, default: '' }, // Wasabi key
  images: [ImageItemSchema],
  isEnabled: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
