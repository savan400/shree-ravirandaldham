require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Translation = require('../models/Translation');

const exportPath = path.join(__dirname, 'translations.json');

async function exportTranslations() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shree-ravirandaldham');
        console.log('MongoDB connected for export.');

        const translations = await Translation.find({}).sort({ section: 1, key: 1 }).lean();

        // strip mongoose specific fields
        const exportData = translations.map(t => {
            return {
                section: t.section,
                key: t.key,
                en: t.en,
                hi: t.hi,
                gu: t.gu
            };
        });

        fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
        console.log(`Exported ${exportData.length} translations to ${exportPath}`);
    } catch (err) {
        console.error('Error exporting translations:', err);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
}

exportTranslations();
