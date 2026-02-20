const express = require('express');
const router = express.Router();
const SeoMeta = require('../models/SeoMeta');
const Translation = require('../models/Translation');

/**
 * @swagger
 * components:
 *   schemas:
 *     SeoMeta:
 *       type: object
 *       required:
 *         - route
 *         - locale
 *         - title
 *       properties:
 *         route:
 *           type: string
 *           description: The page route (e.g., /, /ravirandaldham/itihas)
 *         locale:
 *           type: string
 *           description: Language code (en, hi, gu)
 *         title:
 *           type: string
 *           description: Page meta title
 *         description:
 *           type: string
 *           description: Page meta description
 *         keywords:
 *           type: string
 *           description: Meta keywords
 *         ogImage:
 *           type: string
 *           description: OpenGraph image URL
 *     Translation:
 *       type: object
 *       required:
 *         - section
 *         - key
 *       properties:
 *         section:
 *           type: string
 *           description: Grouping section (e.g., HomePage, Common)
 *         key:
 *           type: string
 *           description: Unique key within the section
 *         en:
 *           type: string
 *           description: English translation
 *         hi:
 *           type: string
 *           description: Hindi translation
 *         gu:
 *           type: string
 *           description: Gujarati translation
 */

// ─────────────────────────────────────────────
// SEO Routes
// ─────────────────────────────────────────────

/**
 * @swagger
 * /api/seo:
 *   get:
 *     summary: Get SEO data for a route and locale
 *     tags: [SEO]
 *     parameters:
 *       - in: query
 *         name: route
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: locale
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SEO metadata object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeoMeta'
 *       404:
 *         description: SEO data not found
 */
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

/**
 * @swagger
 * /api/admin/seo:
 *   post:
 *     summary: Create or update SEO metadata
 *     tags: [SEO Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeoMeta'
 *     responses:
 *       200:
 *         description: The updated SEO metadata
 */
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
 * @swagger
 * /api/translations:
 *   get:
 *     summary: Get all translations in a nested structure
 *     tags: [Translations]
 *     responses:
 *       200:
 *         description: Nested translations object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/translations', async (req, res) => {
  try {
    const docs = await Translation.find({}).lean();

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
 * @swagger
 * /api/translations/flat:
 *   get:
 *     summary: Get all translations as a flat array
 *     tags: [Translations Admin]
 *     responses:
 *       200:
 *         description: Array of translation documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Translation'
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
 * @swagger
 * /api/admin/translations:
 *   post:
 *     summary: Create or update a translation
 *     tags: [Translations Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Translation'
 *     responses:
 *       200:
 *         description: The updated translation
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
 * @swagger
 * /api/admin/translations/{id}:
 *   delete:
 *     summary: Delete a translation by ID
 *     tags: [Translations Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deletion success status
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
