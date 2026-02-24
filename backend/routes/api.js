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

// Get all events (supports ?page=&limit= for server-side pagination)
router.get('/events', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const [total, events] = await Promise.all([
      Event.countDocuments(),
      Event.find().sort({ date: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const resolveUrl = async (key) => {
      if (!key) return '';
      try { return await wasabi.presignGetUrl(key); } catch { return ''; }
    };

    const data = await Promise.all(events.map(async (event) => ({
      ...event,
      images:     await Promise.all((event.images || []).map(resolveUrl)),
      coverImage: await resolveUrl(event.coverImage),
    })));

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
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

    // ── Key safety helper ──────────────────────────────────────────
    // The frontend sends pre-signed URLs in `images[]` and `coverImage`
    // because that's what the GET response returns.  We MUST NEVER write
    // these full URLs back to the database — they must remain raw Wasabi keys.
    // Strategy: load the existing DB record and use its stored keys as source
    // of truth.  Determine which existing keys to keep by matching the URLs
    // the client said to keep (existingImageUrls) against the stored keys.
    // ────────────────────────────────────────────────────────────────

    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) return res.status(404).json({ error: 'Event not found' });

    const storedKeys = existingEvent.images || [];          // raw Wasabi keys in DB
    const clientImages = eventData.images || [];            // may be full URLs or keys
    const clientCover  = eventData.coverImage || '';        // may be full URL or key

    // Resolve each stored key to its URL so we can match what the client sent
    const resolveKey = async (key) => {
      if (!key) return '';
      try { return await wasabi.presignGetUrl(key); } catch { return ''; }
    };

    // Build a map: presignedUrl → storedKey  (so we can reverse-lookup)
    const urlToKey = new Map();
    await Promise.all(storedKeys.map(async (key) => {
      // A URL coming from the client will match only the path portion (before ?)
      // because signatures differ.  We compare by URL path (no query string).
      const url = await resolveKey(key);
      const urlPath = url.split('?')[0];
      urlToKey.set(urlPath, key);
      // Also store the key itself in case the client already sent raw keys
      urlToKey.set(key, key);
    }));

    // Resolve a value (URL or key) back to a stored Wasabi key
    const toKey = (urlOrKey) => {
      if (!urlOrKey) return null;
      const pathOnly = urlOrKey.split('?')[0];
      return urlToKey.get(pathOnly) || urlToKey.get(urlOrKey) || null;
    };

    // Keep only the keys the client still wants (filter out deleted ones)
    const keptKeys = clientImages
      .map(toKey)
      .filter(Boolean);

    // Keys to delete (were in DB, client removed them)
    const toDeleteKeys = storedKeys.filter(k => !keptKeys.includes(k));
    for (const key of toDeleteKeys) {
      try { await wasabi.deleteObjects([key]); } catch (err) {
        console.error(`Failed to delete ${key}:`, err.message);
      }
    }

    // Upload new files
    let allKeys = [...keptKeys];
    if (req.files && req.files.length > 0) {
      const newKeys = await syncToWasabi(req.files, eventId);
      allKeys = [...allKeys, ...newKeys];
    }

    // Resolve coverImage: prefer the key resolved from client's coverImage value
    let coverImageKey = toKey(clientCover);
    if (!coverImageKey && allKeys.length > 0) coverImageKey = allKeys[0];

    // Strip images/coverImage from eventData so we set them cleanly
    const { images: _i, coverImage: _c, ...restEventData } = eventData;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { ...restEventData, images: allKeys, coverImage: coverImageKey || '', updatedAt: Date.now() },
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

// ─────────────────────────────────────────────
// Gallery Routes
// ─────────────────────────────────────────────
const Gallery = require('../models/Gallery');

// Helper: resolve gallery keys to pre-signed URLs
const resolveGallery = async (gallery) => {
  const resolveKey = async (key) => {
    if (!key) return '';
    try { return await wasabi.presignGetUrl(key); } catch { return ''; }
  };

  const coverImage = await resolveKey(gallery.coverImage);
  const images = await Promise.all(
    (gallery.images || []).map(async (img) => ({
      _id: img._id,
      url: await resolveKey(img.key),
      description: img.description,
    }))
  );
  return { ...gallery, coverImage, images };
};

// GET /api/galleries — public list (enabled only, paginated)
router.get('/galleries', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;
    const filter = { isEnabled: true };

    const [total, galleries] = await Promise.all([
      Gallery.countDocuments(filter),
      Gallery.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const data = await Promise.all(galleries.map(resolveGallery));
    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/galleries/admin — admin list (all, paginated)
router.get('/galleries/admin', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const [total, galleries] = await Promise.all([
      Gallery.countDocuments(),
      Gallery.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const data = await Promise.all(galleries.map(resolveGallery));
    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching galleries (admin):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET /api/galleries/:id — single gallery
router.get('/galleries/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id).lean();
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });
    res.json(await resolveGallery(gallery));
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/galleries/admin — create gallery
router.post('/galleries/admin', upload.array('images'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const galleryId = new mongoose.Types.ObjectId();

    // Upload new images to Wasabi
    const uploadedImages = [];
    for (const file of (req.files || [])) {
      const key = `galleries/${galleryId}/images/${file.filename}`;
      const stream = fs.createReadStream(file.path);
      await wasabi.uploadObject(key, stream, file.mimetype);
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      uploadedImages.push({ key, description: { en: '', hi: '', gu: '' } });
    }

    // Merge any per-image descriptions passed from client
    const imageDescriptions = data.imageDescriptions || [];
    uploadedImages.forEach((img, i) => {
      if (imageDescriptions[i]) img.description = imageDescriptions[i];
    });

    const gallery = await Gallery.create({
      _id: galleryId,
      title: data.title || { en: '' },
      coverImage: uploadedImages.length > 0 ? uploadedImages[0].key : '',
      images: uploadedImages,
      isEnabled: data.isEnabled !== false,
    });

    res.status(201).json(gallery);
  } catch (error) {
    console.error('Error creating gallery:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/galleries/admin/:id — update gallery
router.put('/galleries/admin/:id', upload.array('images'), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

    const data = JSON.parse(req.body.data || '{}');

    // Upload new images
    for (const file of (req.files || [])) {
      const key = `galleries/${gallery._id}/images/${file.filename}`;
      const stream = fs.createReadStream(file.path);
      await wasabi.uploadObject(key, stream, file.mimetype);
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      gallery.images.push({ key, description: { en: '', hi: '', gu: '' } });
    }

    // Remove deleted images
    const keepIds = (data.keepImageIds || []).map(String);
    const toDelete = gallery.images.filter(img => !keepIds.includes(String(img._id)));
    for (const img of toDelete) {
      try { await wasabi.deleteObjects([img.key]); } catch {}
    }
    gallery.images = gallery.images.filter(img => keepIds.includes(String(img._id)));

    // Update per-image descriptions
    const descMap = data.imageDescriptions || {};
    gallery.images.forEach(img => {
      const desc = descMap[String(img._id)];
      if (desc) img.description = desc;
    });

    if (data.title) gallery.title = data.title;
    if (data.isEnabled !== undefined) gallery.isEnabled = data.isEnabled;

    // Resolve coverImage: client sends coverImageId (_id of the image to use as cover).
    // Never trust a URL from the client — look up the key from the saved image list.
    if (data.coverImageId) {
      const coverImg = gallery.images.find(img => String(img._id) === String(data.coverImageId));
      if (coverImg) gallery.coverImage = coverImg.key;
    } else if (gallery.images.length > 0 && !gallery.coverImage) {
      // Fallback: use first image key if coverImage is empty
      gallery.coverImage = gallery.images[0].key;
    }

    gallery.updatedAt = new Date();
    await gallery.save();
    res.json(gallery);
  } catch (error) {
    console.error('Error updating gallery:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/galleries/admin/:id — delete gallery
router.delete('/galleries/admin/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

    const keys = gallery.images.map(img => img.key).filter(Boolean);
    if (gallery.coverImage) keys.push(gallery.coverImage);
    if (keys.length) {
      try { await wasabi.deleteObjects([...new Set(keys)]); } catch (err) {
        console.error('Wasabi cleanup error:', err.message);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

