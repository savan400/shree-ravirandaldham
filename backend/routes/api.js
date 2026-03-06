const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream');
const mongoose = require('mongoose');
const Busboy = require('busboy');
const SeoMeta = require('../models/SeoMeta');
const Translation = require('../models/Translation');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const VideoGallery = require('../models/VideoGallery');
const CMSPage = require('../models/CMSPage');
const GlobalSettings = require('../models/GlobalSettings');
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

const validateLocalized = (obj, fieldName) => {
  if (!obj || typeof obj !== 'object') return `${fieldName} is required`;
  if (!obj.en || !obj.en.trim()) return `${fieldName} (English) is required`;
  if (!obj.hi || !obj.hi.trim()) return `${fieldName} (Hindi) is required`;
  if (!obj.gu || !obj.gu.trim()) return `${fieldName} (Gujarati) is required`;
  return null;
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
// SEO Routes (Consolidated & Localized)
// ─────────────────────────────────────────────

// PUBLIC: GET /api/seo - Fetch localized SEO metadata for a route
router.get('/seo', async (req, res) => {
  try {
    const { route, locale } = req.query;
    if (!route || !locale) return res.status(400).json({ error: 'Missing route or locale' });

    const seoData = await SeoMeta.findOne({ route });
    if (!seoData) return res.status(404).json({ error: 'SEO data not found' });

    // Return localized fields based on requested locale
    const result = {
      route: seoData.route,
      title: seoData.title[locale] || seoData.title.en,
      description: seoData.description[locale] || seoData.description.en,
      keywords: seoData.keywords[locale] || seoData.keywords.en,
      canonicalUrl: seoData.canonicalUrl[locale] || seoData.canonicalUrl.en,
      ogImage: seoData.ogImage,
      noIndex: seoData.noIndex,
      noFollow: seoData.noFollow
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ADMIN: GET /api/admin/seo-list - List all SEO records with search
router.get('/admin/seo-list', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { route: { $regex: search, $options: 'i' } },
          { 'title.en': { $regex: search, $options: 'i' } }
        ]
      };
    }
    const list = await SeoMeta.find(query).sort({ updatedAt: -1 });
    res.json(list);
  } catch (error) {
    console.error('Error fetching SEO list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ADMIN: POST /api/admin/seo - Save SEO record (Create/Update)
router.post('/admin/seo', async (req, res) => {
  try {
    const {
      route,
      title,
      description,
      keywords,
      canonicalUrl,
      ogImage,
      noIndex,
      noFollow
    } = req.body;

    // Strict validation for titles across all languages
    if (!title) return res.status(400).json({ error: 'Title data is missing' });

    // Auto-normalize if title is a string (fallback)
    let finalTitle = title;
    if (typeof title === 'string') {
      finalTitle = { en: title, hi: '', gu: '' };
    }

    if (!finalTitle.en?.trim()) return res.status(400).json({ error: 'English Title is required' });
    if (!finalTitle.hi?.trim()) return res.status(400).json({ error: 'Hindi Title is required' });
    if (!finalTitle.gu?.trim()) return res.status(400).json({ error: 'Gujarati Title is required' });

    // Same for description, keywords, etc (normalize if strings)
    const normalize = (val) => (typeof val === 'string' ? { en: val, hi: '', gu: '' } : val || { en: '', hi: '', gu: '' });

    const finalData = {
      title: finalTitle,
      description: normalize(description),
      keywords: normalize(keywords),
      canonicalUrl: normalize(canonicalUrl),
      ogImage,
      noIndex: !!noIndex,
      noFollow: !!noFollow,
      updatedAt: Date.now()
    };

    const updatedSeo = await SeoMeta.findOneAndUpdate(
      { route },
      finalData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(updatedSeo);
  } catch (error) {
    console.error('Error saving SEO data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ADMIN: DELETE /api/admin/seo/:id - Delete SEO record
router.delete('/admin/seo/:id', async (req, res) => {
  try {
    await SeoMeta.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting SEO data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ADMIN: POST /api/admin/seo/upload - Upload OG Image to Wasabi
router.post('/admin/seo/upload', async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  let uploadPromise;

  busboy.on('file', (fieldname, file, info) => {
    const { filename, mimeType } = info;
    const wasabiKey = `seo/og-images/${Date.now()}-${filename}`;
    uploadPromise = wasabi.uploadObject(wasabiKey, file, mimeType);
  });

  busboy.on('finish', async () => {
    try {
      if (!uploadPromise) return res.status(400).json({ error: 'No file uploaded' });
      const uploadResult = await uploadPromise;
      // Wasabi's upload.done() can return an object or string depending on S3 lib internals/fallback.
      const publicUrl = typeof uploadResult === 'object' && uploadResult.Location
        ? uploadResult.Location
        : uploadResult;
      res.json({ url: publicUrl });
    } catch (error) {
      console.error('Wasabi SEO upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  req.pipe(busboy);
});

// ADMIN: POST /api/admin/dynamic-content/upload - Upload dynamic image to Wasabi
router.post('/admin/dynamic-content/upload', async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  let uploadPromise;

  busboy.on('file', (fieldname, file, info) => {
    const { filename, mimeType } = info;
    const wasabiKey = `dynamic-content/${Date.now()}-${filename}`;
    uploadPromise = wasabi.uploadObject(wasabiKey, file, mimeType);
  });

  busboy.on('finish', async () => {
    try {
      if (!uploadPromise) return res.status(400).json({ error: 'No file uploaded' });
      const uploadResult = await uploadPromise;
      const publicUrl = typeof uploadResult === 'object' && uploadResult.Location
        ? uploadResult.Location
        : uploadResult;
      res.json({ url: publicUrl });
    } catch (error) {
      console.error('Wasabi dynamic-content upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  req.pipe(busboy);
});

// PUBLIC: POST /api/presign - Presign Wasabi URLs on demand
router.post('/presign', async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || (!Array.isArray(urls) && typeof urls !== 'string')) {
      return res.status(400).json({ error: 'Provide an array or a single url to presign' });
    }

    const processUrl = async (url) => {
      if (!url || typeof url !== 'string') return url;
      if (!process.env.WASABI_BUCKET) return url;

      const match = url.match(/(seo\/og-images\/[^\?]+|dynamic-content\/[^\?]+|events\/[^/]+\/images\/[^\?]+|gallery\/[^\?]+)/);
      if (match) {
        try {
          return await wasabi.presignGetUrl(match[1]);
        } catch (e) {
          console.error("Presign error:", e);
          return url;
        }
      }
      return url;
    };

    if (Array.isArray(urls)) {
      const presignedUrls = await Promise.all(urls.map(u => processUrl(u)));
      return res.json({ urls: presignedUrls });
    } else {
      const presignedUrl = await processUrl(urls);
      return res.json({ url: presignedUrl });
    }
  } catch (error) {
    console.error('Error generating presigned URLs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/settings - Public settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await GlobalSettings.findOne({ key: 'global_seo' });
    res.json(settings || {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/settings - Save settings
router.post('/admin/settings', async (req, res) => {
  try {
    const updated = await GlobalSettings.findOneAndUpdate(
      { key: 'global_seo' },
      { ...req.body, updatedAt: Date.now() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(updated);
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/seo-routes - Get all unique routes for sitemap
router.get('/seo-routes', async (req, res) => {
  try {
    const routes = await SeoMeta.distinct('route', { noIndex: { $ne: true } });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching SEO routes:', error);
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
    // console.log('res.json(result)', res.json(result));
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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

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
      images: await Promise.all((event.images || []).map(resolveUrl)),
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

    // Strict Validations
    const titleErr = validateLocalized(eventData.title, 'Title');
    if (titleErr) return res.status(400).json({ error: titleErr });
    if (!eventData.date) return res.status(400).json({ error: 'Event date is required' });
    if (!eventData.time?.en) return res.status(400).json({ error: 'Event time is required' });
    if (!req.files || req.files.length === 0) {
      // For new events, we need at least one image
      return res.status(400).json({ error: 'At least one event image is required' });
    }

    const eventId = new mongoose.Types.ObjectId();

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

    // Strict Validations
    const titleErr = validateLocalized(eventData.title, 'Title');
    if (titleErr) return res.status(400).json({ error: titleErr });
    if (!eventData.date) return res.status(400).json({ error: 'Event date is required' });

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
    const clientCover = eventData.coverImage || '';        // may be full URL or key

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

// Gallery Routes
// ─────────────────────────────────────────────

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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

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

    // Strict Validations
    const titleErr = validateLocalized(data.title, 'Title');
    if (titleErr) return res.status(400).json({ error: titleErr });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required for gallery' });
    }

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

    // Strict Validations
    const titleErr = validateLocalized(data.title, 'Title');
    if (titleErr) return res.status(400).json({ error: titleErr });

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
      try { await wasabi.deleteObjects([img.key]); } catch { }
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


// Video Gallery Routes
// ─────────────────────────────────────────────

// Helper: resolve thumbnail pre-signed URL
const resolveThumbnailUrl = async (key) => {
  if (!key) return '';
  try { return await wasabi.presignGetUrl(key); } catch { return ''; }
};

// GET /api/video-galleries — public paginated list (enabled only)
router.get('/video-galleries', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 8);
    const skip = (page - 1) * limit;
    const filter = { isEnabled: true };

    const [total, docs] = await Promise.all([
      VideoGallery.countDocuments(filter),
      VideoGallery.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const data = await Promise.all(docs.map(async (v) => ({
      ...v,
      thumbnailUrl: await resolveThumbnailUrl(v.thumbnailKey),
    })));

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching video galleries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/video-galleries/admin — admin paginated list (all)
router.get('/video-galleries/admin', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 8);
    const skip = (page - 1) * limit;

    const [total, docs] = await Promise.all([
      VideoGallery.countDocuments(),
      VideoGallery.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const data = await Promise.all(docs.map(async (v) => ({
      ...v,
      thumbnailUrl: await resolveThumbnailUrl(v.thumbnailKey),
    })));

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching video galleries (admin):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/video-galleries/stream/:key — range-aware streaming proxy for raw videos
const { GetObjectCommand, HeadObjectCommand: HeadCommand } = require('@aws-sdk/client-s3');
router.get('/video-galleries/stream/*', async (req, res) => {
  try {
    const key = req.params[0];
    if (!key) return res.status(400).send('Missing key');

    const BUCKET = process.env.WASABI_BUCKET;

    // HEAD: get file size and content type
    const head = await wasabi.headObject(key);
    const fileSize = head.ContentLength;
    const contentType = head.ContentType || 'video/mp4';

    const range = req.headers.range;
    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : Math.min(start + 2 * 1024 * 1024 - 1, fileSize - 1);
      const chunkSize = end - start + 1;

      const cmd = new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Range: `bytes=${start}-${end}`,
      });
      const { Body } = await wasabi.wasabiClient.send(cmd);

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });
      pipeline(Body, res, (err) => {
        if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
          console.error('Pipeline error (stream):', err);
        }
      });
    } else {
      const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
      const { Body } = await wasabi.wasabiClient.send(cmd);
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      });
      pipeline(Body, res, (err) => {
        if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
          console.error('Pipeline error (download):', err);
        }
      });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).send('Error streaming video');
  }
});


// GET /api/video-galleries/presign-upload — get PUT urls for direct upload
router.get('/video-galleries/presign-upload', async (req, res) => {
  try {
    const { videoType, videoExt, thumbExt } = req.query;
    const id = new mongoose.Types.ObjectId();
    const results = { id, video: null, thumbnail: null };

    if (videoType === 'file' && videoExt) {
      const videoKey = `video-galleries/${id}/video/${Date.now()}-${Math.round(Math.random() * 1E9)}.${videoExt}`;
      results.video = {
        key: videoKey,
        url: await wasabi.presignPutUrl(videoKey, `video/${videoExt === 'mp4' ? 'mp4' : 'octet-stream'}`),
      };
    }

    if (thumbExt) {
      const thumbKey = `video-galleries/${id}/thumbnail/${Date.now()}-${Math.round(Math.random() * 1E9)}.${thumbExt}`;
      results.thumbnail = {
        key: thumbKey,
        url: await wasabi.presignPutUrl(thumbKey, `image/${thumbExt === 'jpg' ? 'jpeg' : thumbExt}`),
      };
    }

    res.json(results);
  } catch (error) {
    console.error('Presign error:', error);
    res.status(500).json({ error: 'Failed to generate upload URLs' });
  }
});


// POST /api/video-galleries/admin — create
router.post('/video-galleries/admin', async (req, res) => {
  // Support JSON for direct metadata submission (after direct Wasabi upload)
  if (req.headers['content-type']?.includes('application/json')) {
    try {
      const data = req.body;
      const titleErr = validateLocalized(data.title, 'Title');
      if (titleErr) return res.status(400).json({ error: titleErr });

      const doc = await VideoGallery.create({
        title: data.title,
        videoType: data.videoType || 'link',
        videoUrl: data.videoType === 'link' ? (data.videoUrl || '') : '',
        videoKey: data.videoType === 'file' ? (data.videoKey || '') : '',
        thumbnailKey: data.thumbnailKey || '',
        isEnabled: data.isEnabled !== false,
      });
      return res.status(201).json(doc);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create record', message: err.message });
    }
  }

  // Fallback to Busboy for traditional uploads (backward compatibility)
  const busboy = Busboy({ headers: req.headers });
  const id = new mongoose.Types.ObjectId();
  const fields = {};
  const uploads = [];
  let videoKey = '';
  let thumbnailKey = '';
  let errorSent = false;

  busboy.on('field', (name, val) => {
    fields[name] = val;
  });

  busboy.on('file', (name, file, info) => {
    const { filename, mimeType } = info;
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(filename);

    let key = '';
    if (name === 'video') {
      key = `video-galleries/${id}/video/${uniqueName}`;
      videoKey = key;
    } else if (name === 'thumbnail') {
      key = `video-galleries/${id}/thumbnail/${uniqueName}`;
      thumbnailKey = key;
    } else {
      file.resume();
      return;
    }

    const uploadPromise = wasabi.uploadObject(key, file, mimeType);
    uploads.push(uploadPromise);
  });

  busboy.on('finish', async () => {
    try {
      if (errorSent) return;
      await Promise.all(uploads);

      const data = JSON.parse(fields.data || '{}');
      const titleErr = validateLocalized(data.title, 'Title');
      if (titleErr) return res.status(400).json({ error: titleErr });

      if (data.videoType === 'link' && !data.videoUrl) {
        return res.status(400).json({ error: 'Video URL is required for link type' });
      }
      if (data.videoType === 'file' && !videoKey) {
        return res.status(400).json({ error: 'Video file is required for file type' });
      }

      const doc = await VideoGallery.create({
        _id: id,
        title: data.title || { en: '' },
        videoType: data.videoType || 'link',
        videoUrl: data.videoType === 'link' ? (data.videoUrl || '') : '',
        videoKey: data.videoType === 'file' ? videoKey : '',
        thumbnailKey,
        isEnabled: data.isEnabled !== false,
      });

      res.status(201).json(doc);
    } catch (err) {
      console.error('Busboy finish error:', err);
      if (!errorSent) res.status(500).json({ error: 'Upload failed', message: err.message });
    }
  });

  busboy.on('error', (err) => {
    console.error('Busboy error:', err);
    errorSent = true;
    res.status(500).json({ error: 'Upload interrupted', message: err.message });
  });

  req.pipe(busboy);
});

// PUT /api/video-galleries/admin/:id — update
router.put('/video-galleries/admin/:id', async (req, res) => {
  // Support JSON for direct metadata submission (after direct Wasabi upload)
  if (req.headers['content-type']?.includes('application/json')) {
    try {
      const doc = await VideoGallery.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: 'Not found' });

      const data = req.body;
      const titleErr = validateLocalized(data.title, 'Title');
      if (titleErr) return res.status(400).json({ error: titleErr });

      if (data.title) doc.title = data.title;
      if (data.videoType) doc.videoType = data.videoType;
      if (data.videoType === 'link') {
        doc.videoUrl = data.videoUrl || '';
        if (doc.videoKey) {
          try { await wasabi.deleteObjects([doc.videoKey]); } catch { }
          doc.videoKey = '';
        }
      }
      if (data.isEnabled !== undefined) doc.isEnabled = data.isEnabled;

      if (data.videoKey) {
        if (doc.videoKey && doc.videoKey !== data.videoKey) {
          try { await wasabi.deleteObjects([doc.videoKey]); } catch { }
        }
        doc.videoKey = data.videoKey;
      }

      if (data.thumbnailKey) {
        if (doc.thumbnailKey && doc.thumbnailKey !== data.thumbnailKey) {
          try { await wasabi.deleteObjects([doc.thumbnailKey]); } catch { }
        }
        doc.thumbnailKey = data.thumbnailKey;
      }

      await doc.save();
      return res.json(doc);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update record', message: err.message });
    }
  }

  try {
    const doc = await VideoGallery.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    const busboy = Busboy({ headers: req.headers });
    const fields = {};
    const uploads = [];
    let newVideoKey = '';
    let newThumbnailKey = '';
    let errorSent = false;

    busboy.on('field', (name, val) => {
      fields[name] = val;
    });

    busboy.on('file', (name, file, info) => {
      const { filename, mimeType } = info;
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(filename);

      let key = '';
      if (name === 'video') {
        key = `video-galleries/${doc._id}/video/${uniqueName}`;
        newVideoKey = key;
      } else if (name === 'thumbnail') {
        key = `video-galleries/${doc._id}/thumbnail/${uniqueName}`;
        newThumbnailKey = key;
      } else {
        file.resume();
        return;
      }

      const uploadPromise = wasabi.uploadObject(key, file, mimeType);
      uploads.push(uploadPromise);
    });

    busboy.on('finish', async () => {
      try {
        if (errorSent) return;
        await Promise.all(uploads);

        const data = JSON.parse(fields.data || '{}');
        const titleErr = validateLocalized(data.title, 'Title');
        if (titleErr) return res.status(400).json({ error: titleErr });

        if (data.title) doc.title = data.title;
        if (data.videoType) doc.videoType = data.videoType;
        if (data.videoType === 'link') {
          doc.videoUrl = data.videoUrl || '';
          if (doc.videoKey) {
            try { await wasabi.deleteObjects([doc.videoKey]); } catch { }
            doc.videoKey = '';
          }
        }
        if (data.isEnabled !== undefined) doc.isEnabled = data.isEnabled;

        if (newVideoKey) {
          if (doc.videoKey) {
            try { await wasabi.deleteObjects([doc.videoKey]); } catch { }
          }
          doc.videoKey = newVideoKey;
        }

        if (newThumbnailKey) {
          if (doc.thumbnailKey) {
            try { await wasabi.deleteObjects([doc.thumbnailKey]); } catch { }
          }
          doc.thumbnailKey = newThumbnailKey;
        }

        await doc.save();
        res.json(doc);
      } catch (err) {
        console.error('Busboy finish error:', err);
        if (!errorSent) res.status(500).json({ error: 'Update failed', message: err.message });
      }
    });

    busboy.on('error', (err) => {
      errorSent = true;
      res.status(500).json({ error: 'Update interrupted', message: err.message });
    });

    req.pipe(busboy);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Photo Gallery Routes ───────────────────────────────────────────────────

// GET /api/galleries — public list
router.get('/galleries', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const query = { isEnabled: true };
    const [data, total] = await Promise.all([
      Gallery.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Gallery.countDocuments(query)
    ]);

    // Convert keys to URLs
    const processed = data.map(g => ({
      ...g,
      coverImage: g.coverImage ? wasabi.getFileUrl(g.coverImage) : '',
      images: g.images.map(img => ({
        ...img,
        url: wasabi.getFileUrl(img.key)
      }))
    }));

    res.json({ data: processed, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/galleries/:id — public single
router.get('/galleries/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id).lean();
    if (!gallery || !gallery.isEnabled) return res.status(404).json({ error: 'Not found' });

    gallery.coverImage = gallery.coverImage ? wasabi.getFileUrl(gallery.coverImage) : '';
    gallery.images = gallery.images.map(img => ({
      ...img,
      url: wasabi.getFileUrl(img.key)
    }));

    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/galleries/admin — admin list
router.get('/galleries/admin', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Gallery.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Gallery.countDocuments()
    ]);

    const processed = data.map(g => ({
      ...g,
      coverImage: g.coverImage ? wasabi.getFileUrl(g.coverImage) : '',
      images: g.images.map(img => ({
        ...img,
        url: wasabi.getFileUrl(img.key)
      }))
    }));

    res.json({ data: processed, total });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/galleries — create
router.post('/galleries', upload.array('images'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const titleErr = validateLocalized(data.title, 'Title');
    if (titleErr) return res.status(400).json({ error: titleErr });

    const totalImgErr = validateLocalized(data.title, 'Title'); // Reusing title check just for mandatory GU/HI

    const galleryId = new mongoose.Types.ObjectId();
    const imageItems = [];

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const key = `galleries/${galleryId}/${Date.now()}-${i}${path.extname(file.originalname)}`;
        const stream = fs.createReadStream(file.path);
        await wasabi.uploadObject(key, stream, file.mimetype);
        fs.unlinkSync(file.path);

        const desc = data.imageDescriptions_new?.[i] || { en: '', hi: '', gu: '' };
        imageItems.push({ key, description: desc });
      }
    }

    // Identify coverImage key
    let coverKey = '';
    if (data.coverImageId && data.coverImageId.startsWith('new-')) {
      // Backend would need to know which index this "new-" maps to. 
      // For simplicity, if not provided, use first image.
      coverKey = imageItems[0]?.key || '';
    } else {
      coverKey = imageItems[0]?.key || '';
    }

    const gallery = await Gallery.create({
      _id: galleryId,
      title: data.title,
      isEnabled: data.isEnabled !== false,
      images: imageItems,
      coverImage: coverKey
    });

    res.status(201).json(gallery);
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/galleries/:id — update
router.put('/galleries/:id', upload.array('images'), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Not found' });

    const data = JSON.parse(req.body.data || '{}');
    if (data.title) gallery.title = data.title;
    if (data.isEnabled !== undefined) gallery.isEnabled = data.isEnabled;

    // 1. Remove images not in keepImageIds
    const keepIds = data.keepImageIds || [];
    const imagesToRemove = gallery.images.filter(img => !keepIds.includes(img._id.toString()));
    if (imagesToRemove.length > 0) {
      const keys = imagesToRemove.map(img => img.key);
      try { await wasabi.deleteObjects(keys); } catch { }
    }
    gallery.images = gallery.images.filter(img => keepIds.includes(img._id.toString()));

    // 2. Update existing descriptions
    if (data.imageDescriptions) {
      gallery.images.forEach(img => {
        if (data.imageDescriptions[img._id.toString()]) {
          img.description = data.imageDescriptions[img._id.toString()];
        }
      });
    }

    // 3. Add new images
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const key = `galleries/${gallery._id}/${Date.now()}-${i}${path.extname(file.originalname)}`;
        const stream = fs.createReadStream(file.path);
        await wasabi.uploadObject(key, stream, file.mimetype);
        fs.unlinkSync(file.path);

        const desc = data.imageDescriptions_new?.[i] || { en: '', hi: '', gu: '' };
        gallery.images.push({ key, description: desc });
      }
    }

    // 4. Update coverImage
    if (data.coverImageId) {
      const coverImg = gallery.images.find(img => img._id.toString() === data.coverImageId);
      if (coverImg) gallery.coverImage = coverImg.key;
    } else if (gallery.images.length > 0 && !gallery.images.some(img => img.key === gallery.coverImage)) {
      gallery.coverImage = gallery.images[0].key;
    }

    await gallery.save();
    res.json(gallery);
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/galleries/:id — delete
router.delete('/galleries/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Not found' });

    const keys = gallery.images.map(img => img.key);
    if (keys.length > 0) {
      try { await wasabi.deleteObjects(keys); } catch { }
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// ─────────────────────────────────────────────
// CMS Page Routes
// ─────────────────────────────────────────────

// Helper: resolve CMS Page image keys to pre-signed URLs
const resolveCMSPage = async (page) => {
  const resolveKey = async (key) => {
    if (!key) return '';
    try { return await wasabi.presignGetUrl(key); } catch { return ''; }
  };

  const images = await Promise.all((page.images || []).map(async (img) => {
    // Structural compatibility: handle both old string keys and new object structure
    const key = typeof img === 'string' ? img : img.url;
    return {
      ...(typeof img === 'object' ? img : {}),
      url: await resolveKey(key),
      key: key // Preserve the raw key for admin updates
    };
  }));

  const analytics = await Promise.all((page.analytics || []).map(async (item) => ({
    ...item,
    image: await resolveKey(item.image)
  })));

  return { ...page, images, analytics };
};

// GET /api/cms-pages/:key — public fetching by key
router.get('/cms-pages/:key', async (req, res) => {
  try {
    const page = await CMSPage.findOne({ key: req.params.key }).lean();
    if (!page) return res.status(404).json({ error: 'CMS Page not found' });
    res.json(await resolveCMSPage(page));
  } catch (error) {
    console.error('Error fetching CMS page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/cms-pages/admin — admin list (paginated)
router.get('/admin/cms-pages', async (req, res) => {
  try {
    const pageNum = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (pageNum - 1) * limit;

    const [total, pages] = await Promise.all([
      CMSPage.countDocuments(),
      CMSPage.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const data = await Promise.all(pages.map(resolveCMSPage));
    res.json({ data, total, page: pageNum, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching CMS pages (admin):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/cms-pages — create CMS page
router.post('/admin/cms-pages', upload.array('images'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');

    // Strict Validations
    if (!data.key) return res.status(400).json({ error: 'Page key is required' });
    if (['profile', 'temple'].includes(data.type) && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: `Images are mandatory for ${data.type} pages` });
    }
    if (!/^[a-z0-9-]+$/.test(data.key)) {
      return res.status(400).json({ error: 'Page key must be lowercase alphanumeric and hyphens only' });
    }

    const existing = await CMSPage.findOne({ key: data.key });
    if (existing) return res.status(400).json({ error: 'A page with this key already exists' });

    const titleErr = validateLocalized(data.title, 'Title');
    if (titleErr) return res.status(400).json({ error: titleErr });

    const badgeErr = validateLocalized(data.badgeText, 'Badge Text');
    if (badgeErr) return res.status(400).json({ error: badgeErr });

    const descErr = validateLocalized(data.description, 'Description');
    if (descErr) return res.status(400).json({ error: descErr });

    const pageId = new mongoose.Types.ObjectId();
    const uploadedImages = [];

    // Handle main images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const key = `cms-pages/${pageId}/images/${file.filename}`;
        const stream = fs.createReadStream(file.path);
        await wasabi.uploadObject(key, stream, file.mimetype);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        uploadedImages.push(key);
      }
    }

    const newPage = await CMSPage.create({
      ...data,
      _id: pageId,
      images: uploadedImages.map(key => ({ url: key })),
    });

    res.status(201).json(newPage);
  } catch (error) {
    console.error('Error creating CMS page:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /api/admin/cms-pages/:id — update CMS page
router.put('/admin/cms-pages/:id', upload.array('images'), async (req, res) => {
  try {
    const pageId = req.params.id;
    const existingPage = await CMSPage.findById(pageId);
    if (!existingPage) return res.status(404).json({ error: 'CMS Page not found' });

    const data = JSON.parse(req.body.data || '{}');

    // Strict Validations
    const activeType = data.type || existingPage.type;
    const totalImagesCount = (req.files ? req.files.length : 0) + (data.images ? data.images.length : 0);
    if (['profile', 'temple'].includes(activeType) && totalImagesCount === 0) {
      return res.status(400).json({ error: `Images are mandatory for ${activeType} pages` });
    }

    if (data.key && data.key !== existingPage.key) {
      if (!/^[a-z0-9-]+$/.test(data.key)) {
        return res.status(400).json({ error: 'Page key must be lowercase alphanumeric and hyphens only' });
      }
      const duplicate = await CMSPage.findOne({ key: data.key });
      if (duplicate) return res.status(400).json({ error: 'A page with this key already exists' });
    }

    const titleErr = validateLocalized(data.title, 'Title');
    if (titleErr) return res.status(400).json({ error: titleErr });

    const badgeErr = validateLocalized(data.badgeText, 'Badge Text');
    if (badgeErr) return res.status(400).json({ error: badgeErr });

    const descErr = validateLocalized(data.description, 'Description');
    if (descErr) return res.status(400).json({ error: descErr });

    const uploadedImages = [];

    // Handle new main images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const key = `cms-pages/${pageId}/images/${file.filename}`;
        const stream = fs.createReadStream(file.path);
        await wasabi.uploadObject(key, stream, file.mimetype);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        uploadedImages.push(key);
      }
    }

    // Determine which old images to keep and update their captions
    let keepImages = [];
    if (data.images && Array.isArray(data.images)) {
      keepImages = data.images.map(img => ({
        url: img.key || img.url, // use raw key if provided, else hope url is the key
        caption: img.caption
      }));
    } else if (data.keepImages && Array.isArray(data.keepImages)) {
      keepImages = data.keepImages.map(k => ({ url: k }));
    }

    const finalImages = [...keepImages, ...uploadedImages.map(key => ({ url: key }))];

    // Clean up deleted images from Wasabi
    const finalKeys = finalImages.map(img => img.url);
    const toDelete = (existingPage.images || []).map(img => typeof img === 'string' ? img : img.url)
      .filter(k => !finalKeys.includes(k));

    if (toDelete.length > 0) {
      try { await wasabi.deleteObjects(toDelete); } catch (err) { console.error('Wasabi cleanup error:', err); }
    }

    const updatedPage = await CMSPage.findByIdAndUpdate(
      pageId,
      { ...data, images: finalImages, updatedAt: Date.now() },
      { new: true }
    );

    res.json(updatedPage);
  } catch (error) {
    console.error('Error updating CMS page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/admin/cms-pages/:id — delete CMS page
router.delete('/admin/cms-pages/:id', async (req, res) => {
  try {
    const page = await CMSPage.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'CMS Page not found' });

    const keys = [...(page.images || [])];
    (page.analytics || []).forEach(item => { if (item.image) keys.push(item.image); });

    if (keys.length > 0) {
      try { await wasabi.deleteObjects([...new Set(keys)]); } catch (err) { console.error('Wasabi cleanup error:', err); }
    }

    await CMSPage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting CMS page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const dynamicContentRoutes = require('./dynamicContent');
router.use('/dynamic-content', dynamicContentRoutes);

module.exports = router;

