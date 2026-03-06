const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'translations.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newEntries = [
  { section: 'common', key: 'site_title', en: 'Shree Ravirandaldham', hi: 'श्री रविरंदल धाम', gu: 'શ્રી રવિરાંદલ ધામ' },
  { section: 'common', key: 'site_subtitle', en: 'Randaldhma Mandir, Dadva', hi: 'रांदल धाम मंदिर, दडवा', gu: 'રાંદલ ધામ મંદિર, દડવા' },
  { section: 'common', key: 'footer_address_hindi', en: 'Shree Swaminarayan Mandir Vadtaldham tabanu Shree Kashtabhanjandev Hanumanji Mandir-Salangpur', hi: 'श्री स्वामीनारायण मंदिर वडतालधाम ताबा का श्री कष्टभंजनदेव हनुमानजी मंदिर-सालंगपुर', gu: 'શ્રી સ્વામિનારાયણ મંદિર વડતાલધામ તાબાનું શ્રી કષ્ટભંજનદેવ હનુમાનજી મંદિર-સાળંગપુર' },
  { section: 'common', key: 'quick_links', en: 'Quick Links', hi: 'त्वरित लिंक', gu: 'ઝડપી લિંક્સ' },
  { section: 'common', key: 'contact', en: 'Contact', hi: 'संपर्क', gu: 'સંપર્ક' },
  { section: 'common', key: 'all_rights_reserved', en: 'Shree Ravirandaldham Mandir, Dadva. All Rights Reserved.', hi: 'श्री रविरंदल धाम मंदिर, दडवा. सर्वाधिकार सुरक्षित.', gu: 'શ્રી રવિરાંદલ ધામ મંદિર, દડવા. સર્વાધિકાર સુરક્ષિત.' },
  { section: 'Homepage', key: 'hero_title', en: 'Shree Ravirandaldham', hi: 'श्री रविरंदल धाम', gu: 'શ્રી રવિરાંદલ ધામ' },
  { section: 'Homepage', key: 'hero_subtitle_1', en: 'Randaldhma Mandir, Dadva', hi: 'रांदल धाम मंदिर, दडवा', gu: 'રાંદલ ધામ મંદિર, દડવા' },
  { section: 'Homepage', key: 'hero_title_2', en: 'Pavitra Dham', hi: 'पवित्र धाम', gu: 'પવિત્ર ધામ' },
  { section: 'Homepage', key: 'hero_subtitle_2', en: 'A Sacred Abode of Peace & Devotion', hi: 'शांति और भक्ति का एक पवित्र निवास', gu: 'શાંતિ અને ભક્તિનું પવિત્ર નિવાસસ્થાન' },
  { section: 'Homepage', key: 'hero_title_3', en: 'Upasna & Aradhana', hi: 'उपासना और आराधना', gu: 'ઉપાસના અને આરાધના' },
  { section: 'Homepage', key: 'hero_subtitle_3', en: 'Embrace the Divine Light Within', hi: 'भीतर के दिव्य प्रकाश को अपनाएं', gu: 'તમારી અંદરના દિવ્ય પ્રકાશને અપનાવો' },
  { section: 'Homepage', key: 'hero_title_4', en: 'Darshan & Seva', hi: 'दर्शन और सेवा', gu: 'દર્શન અને સેવા' },
  { section: 'Homepage', key: 'hero_subtitle_4', en: 'Come, Seek Blessings & Tranquility', hi: 'आइए, आशीर्वाद और शांति प्राप्त करें', gu: 'આવો, આશીર્વાદ અને શાંતિ મેળવો' },
  { section: 'Homepage', key: 'hero_verse', en: '॥ Dadva Gaam Ej Shree Ravirandaldham ॥', hi: '॥ दडवा गाम एज श्री रविरंदलधाम ॥', gu: '॥ દડવા ગામ એજ શ્રી રવિરાંદલધામ ॥' },
  { section: 'Homepage', key: 'darshan_timings', en: 'Darshan Timings', hi: 'दर्शन का समय', gu: 'દર્શનનો સમય' },
  { section: 'Homepage', key: 'explore_dham', en: 'Explore Dham', hi: 'धाम का अन्वेषण करें', gu: 'ધામનું અન્વેષણ કરો' }
];

data.push(...newEntries);
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Appended', newEntries.length, 'entries');
