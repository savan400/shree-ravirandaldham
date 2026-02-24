const mongoose = require('mongoose');

const VideoGallerySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' },
  },
  // 'link' = YouTube / external URL, 'file' = uploaded to Wasabi
  videoType: {
    type: String,
    enum: ['link', 'file'],
    required: true,
    default: 'link',
  },
  // Used when videoType === 'link'
  videoUrl: {
    type: String,
    default: '',
  },
  // Wasabi key — used when videoType === 'file'
  videoKey: {
    type: String,
    default: '',
  },
  // Optional cover/thumbnail image key (Wasabi)
  thumbnailKey: {
    type: String,
    default: '',
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('VideoGallery', VideoGallerySchema);
