const express = require('express');
const router = express.Router();
const SeoMeta = require('../models/SeoMeta');

// GET /api/seo
// Query Params: route (e.g., /), locale (e.g., en)
router.get('/seo', async (req, res) => {
  try {
    const { route, locale } = req.query;
    if (!route || !locale) {
      return res.status(400).json({ error: 'Missing route or locale query parameter' });
    }

    const seoData = await SeoMeta.findOne({ route, locale });
    
    if (seoData) {
      return res.json(seoData);
    } else {
      // Return default/fallback or 404
      return res.status(404).json({ error: 'SEO data not found for this route/locale' });
    }
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/seo
// Body: { route, locale, title, description, keywords, ogImage }
router.post('/admin/seo', async (req, res) => {
  try {
    const { route, locale, title, description, keywords, ogImage } = req.body;

    if (!route || !locale || !title) {
        return res.status(400).json({ error: 'Missing required fields: route, locale, title' });
    }

    // Upsert (Update if exists, Insert if new)
    const updatedSeo = await SeoMeta.findOneAndUpdate(
      { route, locale },
      { title, description, keywords, ogImage, updatedAt: Date.now() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(updatedSeo);
  } catch (error) {
    console.error('Error saving SEO data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
