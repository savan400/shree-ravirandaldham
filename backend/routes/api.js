const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const SeoMeta = require('../models/SeoMeta');
const Translation = require('../models/Translation');
const Event = require('../models/Event');
const wasabi = require('../utils/wasabiClient');

// ─────────────────────────────────────────────
// Multer Configuration (for Events)
// ─────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/temp';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const syncToWasabi = async (files, eventId) => {
  const uploadedKeys = [];
  for (const file of files) {
    const wasabiKey = `events/${eventId}/images/${file.filename}`;
    const fileStream = fs.createReadStream(file.path);
    await wasabi.uploadObject(wasabiKey, fileStream, file.mimetype);
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    uploadedKeys.push(wasabiKey);
  }
  return uploadedKeys;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     SeoMeta:
 *       type: object
 *       required: [route, locale, title]
 *       properties:
 *         route: { type: string }
 *         locale: { type: string }
 *         title: { type: string }
 *         description: { type: string }
 *         keywords: { type: string }
 *         ogImage: { type: string }
 *     Translation:
 *       type: object
 *       required: [section, key]
 *       properties:
 *         section: { type: string }
 *         key: { type: string }
 *         en: { type: string }
 *         hi: { type: string }
 *         gu: { type: string }
 */

// ─────────────────────────────────────────────
// SEO Routes
// ─────────────────────────────────────────────

router.get('/seo', async (req, res) => {
  try {
    const { route, locale } = req.query;
    if (!route || !locale) return res.status(400).json({ error: 'Missing route or locale' });
    const seoData = await SeoMeta.findOne({ route, locale });
    if (seoData) res.json(seoData);
    else res.status(404).json({ error: 'SEO data not found' });
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/admin/seo', async (req, res) => {
  try {
    const { route, locale, title, description, keywords, ogImage } = req.body;
    if (!route || !locale || !title) return res.status(400).json({ error: 'Missing required fields' });
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

router.get('/translations', async (req, res) => {
  try {
    const locale = req.query.locale || 'en';
    const docs = await Translation.find({}).lean();
    const result = {};
    for (const doc of docs) {
      if (!result[doc.section]) result[doc.section] = {};
      result[doc.section][doc.key] = doc[locale] || '';
    }
    res.json(result);
  } catch (error) {
    console.error('Fetch translations error:', error);
    res.status(500).json({ message: 'Error fetching translations' });
  }
});

router.get('/translations/flat', async (req, res) => {
  try {
    const docs = await Translation.find({}).sort({ section: 1, key: 1 }).lean();
    res.json(docs);
  } catch (error) {
    console.error('Error fetching translations flat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/admin/translations', async (req, res) => {
  try {
    const { section, key, en, hi, gu } = req.body;
    if (!section || !key) return res.status(400).json({ error: 'Missing required fields' });
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

router.delete('/admin/translations/:id', async (req, res) => {
  try {
    await Translation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting translation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// Event Routes
// ─────────────────────────────────────────────

// Get pre-signed URL proxy
router.get('/events/image/*', async (req, res) => {
  try {
    const key = req.params[0];
    if (!key) return res.status(400).send('Missing key');
    const url = await wasabi.presignGetUrl(key);
    res.redirect(url);
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).send('Error generating pre-signed URL');
  }
});

// Get all events (resolves pre-signed URLs for images)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 }).lean();

    // Resolve pre-signed URLs for all event images in parallel
    const eventsWithUrls = await Promise.all(events.map(async (event) => {
      const resolveUrl = async (key) => {
        if (!key) return '';
        try {
          return await wasabi.presignGetUrl(key);
        } catch {
          return '';
        }
      };

      const images = await Promise.all((event.images || []).map(resolveUrl));
      const coverImage = await resolveUrl(event.coverImage);

      return { ...event, images, coverImage };
    }));

    res.json(eventsWithUrls);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create new event
router.post('/events/admin', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.body.data) {
       return res.status(400).json({ error: 'Missing event data' });
    }
    const eventData = JSON.parse(req.body.data);
    const eventId = new mongoose.Types.ObjectId();
    
    const wasabiKeys = await syncToWasabi(req.files || [], eventId.toString());
    
    const newEvent = new Event({
      ...eventData,
      _id: eventId,
      images: wasabiKeys,
      coverImage: eventData.coverImage || (wasabiKeys.length > 0 ? wasabiKeys[0] : '')
    });

    await newEvent.save();
    res.json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Update event
router.put('/events/admin/:id', upload.array('images', 10), async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!req.body.data) {
       return res.status(400).json({ error: 'Missing event data' });
    }
    const eventData = JSON.parse(req.body.data);
    let images = eventData.images || [];
    
    if (req.files && req.files.length > 0) {
      const newWasabiKeys = await syncToWasabi(req.files, eventId);
      images = [...images, ...newWasabiKeys];
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { ...eventData, images, updatedAt: Date.now() },
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete event
router.delete('/events/admin/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    for (const imgKey of event.images) {
      try {
        await wasabi.deleteObjects([imgKey]);
      } catch (err) {
        console.error(`Failed to delete ${imgKey} from Wasabi:`, err.message);
      }
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
