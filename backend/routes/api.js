const express = require('express');
const router = express.Router();
const SeoMeta = require('../models/SeoMeta');
const Translation = require('../models/Translation');

// ─────────────────────────────────────────────
// SEO Routes
// ─────────────────────────────────────────────

// GET /api/seo?route=...&locale=...
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
      return res.status(404).json({ error: 'SEO data not found for this route/locale' });
    }
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/seo
router.post('/admin/seo', async (req, res) => {
  try {
    const { route, locale, title, description, keywords, ogImage } = req.body;
    if (!route || !locale || !title) {
      return res.status(400).json({ error: 'Missing required fields: route, locale, title' });
    }
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

// ─────────────────────────────────────────────
// Translation Routes
// ─────────────────────────────────────────────

/**
 * GET /api/translations
 * Returns all translations as a nested object:
 * { "HomePage": { "title": { "en": "...", "hi": "...", "gu": "..." } } }
 */
router.get('/translations', async (req, res) => {
  try {
    const docs = await Translation.find({}).lean();

    // Build nested structure: { section: { key: { en, hi, gu, _id } } }
    const result = {};
    for (const doc of docs) {
      if (!result[doc.section]) result[doc.section] = {};
      result[doc.section][doc.key] = {
        _id: doc._id,
        en: doc.en,
        hi: doc.hi,
        gu: doc.gu,
      };
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/translations/flat
 * Returns all as a flat array for admin table display
 */
router.get('/translations/flat', async (req, res) => {
  try {
    const docs = await Translation.find({}).sort({ section: 1, key: 1 }).lean();
    res.json(docs);
  } catch (error) {
    console.error('Error fetching translations flat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /api/admin/translations
 * Body: { section, key, en, hi, gu }
 * Upserts by section + key
 */
router.post('/admin/translations', async (req, res) => {
  try {
    const { section, key, en, hi, gu } = req.body;
    if (!section || !key) {
      return res.status(400).json({ error: 'Missing required fields: section, key' });
    }
    const updated = await Translation.findOneAndUpdate(
      { section, key },
      { en: en || '', hi: hi || '', gu: gu || '', updatedAt: Date.now() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(updated);
  } catch (error) {
    console.error('Error saving translation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * DELETE /api/admin/translations/:id
 */
router.delete('/admin/translations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Translation.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting translation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
