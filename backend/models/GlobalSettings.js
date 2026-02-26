const mongoose = require('mongoose');

const GlobalSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'global_seo'
  },
  siteName: {
    en: { type: String, default: 'Shree Ravirandaldham' },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' }
  },
  baseUrl: {
    type: String,
    required: true
  },
  defaultOgImage: {
    type: String
  },
  twitterHandle: {
    type: String
  },
  organizationName: {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    gu: { type: String, default: '' }
  },
  organizationUrl: {
    type: String
  },
  organizationLogo: {
    type: String
  },
  socialLinks: [{
    platform: String,
    url: String
  }],
  contactEmail: String,
  contactPhone: String,
  address: String,
  googleSearchConsoleId: String,
  googleAnalyticsId: String,
}, { timestamps: true });

module.exports = mongoose.model('GlobalSettings', GlobalSettingsSchema);
