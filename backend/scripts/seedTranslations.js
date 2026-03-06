require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Translation = require('../models/Translation');

const importPath = path.join(__dirname, 'translations.json');

async function seedTranslations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shree-ravirandaldham');
    console.log('MongoDB connected for seeding.');

    if (!fs.existsSync(importPath)) {
      console.log(`No translations.json found at ${importPath}. Skipping seed.`);
      return;
    }

    const rawData = fs.readFileSync(importPath, 'utf8');
    const importData = JSON.parse(rawData);

    let count = 0;
    for (const item of importData) {
      if (!item.section || !item.key) continue;

      await Translation.findOneAndUpdate(
        { section: item.section, key: item.key },
        {
          $set: {
            en: item.en || '',
            hi: item.hi || '',
            gu: item.gu || ''
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      count++;
    }

    console.log(`Successfully seeded/updated ${count} translations.`);
  } catch (err) {
    console.error('Error seeding translations:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}

seedTranslations();
