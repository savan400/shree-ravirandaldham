const express = require('express');
const router = express.Router();
const DynamicContent = require('../models/DynamicContent');
const wasabi = require('../utils/wasabiClient');
const fs = require('fs');
const path = require('path');

// Helper to extract nested image URLs from flexible dynamic content arrays or strings
function extractUrlsFromValue(value) {
    if (!value) return [];
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) {
        return value.map(item => {
            if (typeof item === 'object' && item !== null) return item.image || item.url || null;
            return item;
        }).filter(Boolean);
    }
    return [];
}

// Helper to identify storage type and key
function getStorageKeys(urls) {
    const keys = [];
    for (const url of urls) {
        if (typeof url !== 'string') continue;
        const wasabiMatch = url.match(/(seo\/og-images\/[^?]+|dynamic-content\/[^?]+)/);
        if (wasabiMatch) {
            keys.push({ type: 'wasabi', key: wasabiMatch[1] });
            continue;
        }
        const localMatch = url.match(/\/uploads\/([^?]+)/);
        if (localMatch) {
            keys.push({ type: 'local', key: localMatch[1] });
        }
    }
    return keys;
}

// @route   GET /api/dynamic-content/:key
// @desc    Get dynamic content by key
router.get('/:key', async (req, res) => {
    try {
        const content = await DynamicContent.findOne({ key: req.params.key });
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.json(content);
    } catch (error) {
        console.error('Error fetching dynamic content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/dynamic-content/:key
// @desc    Update or create dynamic content by key
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value, description } = req.body;

        // Fetch old content first to know what to delete
        const existingContent = await DynamicContent.findOne({ key });
        const oldUrls = extractUrlsFromValue(existingContent ? existingContent.value : null);
        const newUrls = extractUrlsFromValue(value);

        // Find URLs that exist in old but not in new
        const urlsToDelete = oldUrls.filter(oldUrl => !newUrls.includes(oldUrl));

        const content = await DynamicContent.findOneAndUpdate(
            { key },
            { value, description },
            { new: true, upsert: true } // Create if doesn't exist
        );

        // Process deletion AFTER successful DB update
        if (urlsToDelete.length > 0) {
            const keysToDelete = getStorageKeys(urlsToDelete);

            const wasabiKeys = keysToDelete.filter(k => k.type === 'wasabi').map(k => k.key);
            if (wasabiKeys.length > 0 && process.env.WASABI_BUCKET) {
                wasabi.deleteObjects(wasabiKeys).catch(e => console.error("Wasabi cleanup error:", e));
            }

            const localKeys = keysToDelete.filter(k => k.type === 'local').map(k => k.key);
            if (localKeys.length > 0) {
                localKeys.forEach(filename => {
                    const localPath = path.join(__dirname, '..', 'uploads', filename);
                    if (fs.existsSync(localPath)) {
                        fs.unlink(localPath, (err) => {
                            if (err) console.error("Local file cleanup error:", err);
                        });
                    }
                });
            }
        }

        res.json(content);
    } catch (error) {
        console.error('Error updating dynamic content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/dynamic-content
// @desc    Get all dynamic content keys (for admin panel)
router.get('/', async (req, res) => {
    try {
        const contents = await DynamicContent.find({}, 'key description value updatedAt').sort({ updatedAt: -1 });
        res.json(contents);
    } catch (error) {
        console.error('Error fetching all dynamic content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
