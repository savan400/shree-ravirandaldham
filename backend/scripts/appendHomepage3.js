const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'translations.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newEntries = [
    // TypingText
    { section: 'Homepage', key: 'typing_text', en: 'Another name for faith is Shree Ravirandaldham', hi: 'श्रद्धा का दूसरा नाम श्री रवीरांदल धाम', gu: 'શ્રદ્ધાનું બીજું નામ શ્રી રવિરાંદલ ધામ' },

    // DarshanTimingsSidebar
    { section: 'Homepage', key: 'dt_btn_text', en: 'Darshan Timings', hi: 'दर्शन का समय', gu: 'દર્શન સમય' },
    { section: 'Homepage', key: 'dt_title_main', en: 'Darshan', hi: 'दर्शन', gu: 'દર્શન' },
    { section: 'Homepage', key: 'dt_title_sub', en: 'Timings', hi: 'का समय', gu: 'સમય' },
    { section: 'Homepage', key: 'dt_title_gu', en: 'Darshan Samay', hi: 'दर्शन समय', gu: 'દર્શન સમય' },

    // DarshanTimings Sidebar labels
    { section: 'Homepage', key: 'dt_mangala_local', en: 'Mangala Aarti', hi: 'मंगला आरती', gu: 'મંગળા આરતી' },
    { section: 'Homepage', key: 'dt_mangala_en', en: 'Mangala Aarti', hi: 'Mangala Aarti', gu: 'Mangala Aarti' },
    { section: 'Homepage', key: 'dt_thal_local', en: 'Thal', hi: 'थाल', gu: 'થાળ' },
    { section: 'Homepage', key: 'dt_thal_en', en: 'Thal', hi: 'Thal', gu: 'Thal' },
    { section: 'Homepage', key: 'dt_sandhya_local', en: 'Sandhya Aarti', hi: 'संध्या आरती', gu: 'સંધ્યા આરતી' },
    { section: 'Homepage', key: 'dt_sandhya_en', en: 'Sandhya Aarti', hi: 'Sandhya Aarti', gu: 'Sandhya Aarti' },

    { section: 'Homepage', key: 'dt_morning_local', en: 'Morning', hi: 'सुबह', gu: 'સવારે' },
    { section: 'Homepage', key: 'dt_morning_en', en: 'Morning', hi: 'Morning', gu: 'Morning' },
    { section: 'Homepage', key: 'dt_afternoon_local', en: 'Afternoon', hi: 'दोपहर', gu: 'બપોરે' },
    { section: 'Homepage', key: 'dt_afternoon_en', en: 'Afternoon', hi: 'Afternoon', gu: 'Afternoon' },
    { section: 'Homepage', key: 'dt_evening_local', en: 'Evening', hi: 'शाम', gu: 'સાંજે' },
    { section: 'Homepage', key: 'dt_evening_en', en: 'Evening', hi: 'Evening', gu: 'Evening' }
];

data.push(...newEntries);
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Appended', newEntries.length, 'entries');
