require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Translation = require('../models/Translation');

const MENU_ITEMS_TRANSLATIONS = [
  { key: "ravirandal_dham", en: "Ravirandal Dham", hi: "रविरांदल धाम", gu: "રવિરાંદલ ધામ" },
  { key: "parichay", en: "Introduction", hi: "परिचय", gu: "પરિચય" },
  { key: "itihas", en: "History", hi: "इतिहास", gu: "ઇતિહાસ" },
  { key: "mahima", en: "Glory", hi: "महिमा", gu: "મહિમા" },
  { key: "shree_dineshpuri_bapu", en: "Shree Dineshpuri Bapu", hi: "श्री दिनेशपुरी बापू", gu: "શ્રી દિનેશપુરી બાપુ" },
  { key: "shree_1008_akshaypari_bapu", en: "Shree 1008 Akshaypari Bapu", hi: "श्री 1008 अक्षयपरी बापू", gu: "શ્રી ૧૦૦૮ અક્ષયપરી બાપુ" },
  { key: "shree_ajaypari_bapu", en: "Shree Ajaypari Bapu", hi: "श्री अजयपरी बापू", gu: "શ્રી અજયપરી બાપુ" },
  { key: "seva_karya", en: "Service Work", hi: "सेवा कार्य", gu: "સેવા કાર્ય" },
  { key: "upasna_vidhi", en: "Worship Method", hi: "उपासना विधि", gu: "ઉપાસના વિધિ" },
  { key: "darshan_timing", en: "Darshan Timing", hi: "दर्शन समय", gu: "દર્શન સમય" },
  { key: "seva_punjan", en: "Seva Pujan", hi: "सेवा पूजन", gu: "સેવા પૂજન" },
  { key: "bhakti", en: "Bhakti", hi: "भक्ति", gu: "ભક્તિ" },
  { key: "utsav", en: "Festival", hi: "उत्सव", gu: "ઉત્સવ" },
  { key: "randal_tedvanu_booking", en: "Randal Tedvanu Booking", hi: "रांदल तेडवानु बुकिंग", gu: "રાંદલ તેડવાનું બુકિંગ" },
  { key: "yagna_booking", en: "Yagna Booking", hi: "यज्ञ बुकिंग", gu: "યજ્ઞ બુકિંગ" },
  { key: "aarti", en: "Aarti", hi: "आरती", gu: "આરતી" },
  { key: "mataji_darshan", en: "Mataji Darshan", hi: "माताजी दर्शन", gu: "માતાજી દર્શન" },
  { key: "facilities", en: "Facilities", hi: "सुविधाएँ", gu: "સુવિધાઓ" },
  { key: "bhojan_shala", en: "Bhojan Shala", hi: "भोजन शाला", gu: "ભોજન શાળા" },
  { key: "108_randal", en: "108 Randal", hi: "108 रांदल", gu: "૧૦૮ રાંદલ" },
  { key: "atithi_gruh", en: "Guest House", hi: "अतिथि गृह", gu: "અતિથિ ગૃહ" },
  { key: "pavitra_sthalo", en: "Holy Places", hi: "पवित्र स्थल", gu: "પવિત્ર સ્થળો" },
  { key: "shree_ravirandal_temple", en: "Shree Ravirandal Temple", hi: "श्री रविरांदल मंदिर", gu: "શ્રી રવિરાંદલ મંદિર" },
  { key: "pavitra_vav", en: "Holy Stepwell", hi: "पवित्र वाव", gu: "પવિત્ર વાવ" },
  { key: "shree_shanidev_temple", en: "Shree Shanidev Temple", hi: "श्री शनिदेव मंदिर", gu: "શ્રી શનિદેવ મંદિર" },
  { key: "shree_dineshpuri_bapu_samadhi_sthan", en: "Shree Dineshpuri Bapu Samadhi", hi: "श्री दिनेशपुरी बापू समाधि स्थान", gu: "શ્રી દિનેશપુરી બાપુ સમાધિ સ્થાન" },
  { key: "dashama_temple", en: "Dashama Temple", hi: "दशामा मंदिर", gu: "દશામા મંદિર" },
  { key: "mahadev_temple", en: "Mahadev Temple", hi: "महादेव मंदिर", gu: "મહાદેવ મંદિર" },
  { key: "randal_maa_no_rath", en: "Randal Maa's Chariot", hi: "रांदल माँ का रथ", gu: "રાંદલ મા નો રથ" },
  { key: "108_jyot_ni_mah_aaarti", en: "108 Jyot Mah Aarti", hi: "108 ज्योत महा आरती", gu: "૧૦૮ જ્યોત ની મહા આરતી" },
  { key: "events", en: "Events", hi: "शृंखलाएँ", gu: "કાર્યક્રમો" },
  { key: "upcoming_events", en: "Upcoming Events", hi: "आगामी कार्यक्रम", gu: "આગામી કાર્યક્રમો" },
  { key: "video_gallery", en: "Video Gallery", hi: "वीडियो गैलरी", gu: "વીડિયો ગેલેરી" },
  { key: "photo_gallery", en: "Photo Gallery", hi: "फोटो गैलरी", gu: "ફોટો ગેલેરી" },
  { key: "history", en: "History", hi: "इतिहास", gu: "ઇતિહાસ" },
  { key: "history_of_randaldham", en: "History of Randaldham", hi: "रांदलधाम का इतिहास", gu: "રાંદલધામ નો ઇતિહાસ" },
  { key: "randal_prerna", en: "Randal Inspiration", hi: "रांदल प्रेरणा", gu: "રાંદલ પ્રેરણા" },
  { key: "downloads", en: "Downloads", hi: "डाउनलोड", gu: "ડાઉનલોડ્સ" },
  { key: "wallpaper", en: "Wallpaper", hi: "वॉलपेपर", gu: "વોલપેપર" },
  { key: "calendar", en: "Calendar", hi: "कैलेंडर", gu: "કેલેન્ડર" },
  { key: "books", en: "Books", hi: "पुस्तकें", gu: "પુસ્તકો" },
  { key: "audio", en: "Audio", hi: "ऑडियो", gu: "ઓડિયો" },
  { key: "thoughts_of_bapu", en: "Thoughts of Bapu", hi: "बापू के विचार", gu: "બાપુના વિચારો" },
  { key: "store", en: "Store", hi: "स्टोर", gu: "સ્ટોર" },
  { key: "donation", en: "Donation", hi: "दान", gu: "દાન" },
  { key: "contact_us", en: "Contact Us", hi: "संपर्क करें", gu: "સંપર્ક કરો" }
];

async function seed() {
  try {
    const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shree-ravirandaldham';
    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    for (const item of MENU_ITEMS_TRANSLATIONS) {
      await Translation.findOneAndUpdate(
        { section: 'menuitems', key: item.key },
        { 
          en: item.en, 
          hi: item.hi, 
          gu: item.gu, 
          updatedAt: Date.now() 
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`Successfully seeded ${MENU_ITEMS_TRANSLATIONS.length} menu item translations.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding translations:', error);
    process.exit(1);
  }
}

seed();
