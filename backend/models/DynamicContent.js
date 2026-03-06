const mongoose = require('mongoose');

const dynamicContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g., 'homepage_banners'
    description: { type: String }, // e.g., 'Array of image URLs for the hero banner'
    value: { type: mongoose.Schema.Types.Mixed, required: true } // Can be [], {}, String, Boolean
}, { timestamps: true });

module.exports = mongoose.model('DynamicContent', dynamicContentSchema);
