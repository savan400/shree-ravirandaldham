const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'translations.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newEntries = [
    // WhatsAppSection
    { section: 'Homepage', key: 'wa_sub_label', en: 'Daily Darshan of Lord', hi: 'भगवान के दैनिक दर्शन', gu: 'ભગવાનનાં દરરોજ દર્શન' },
    { section: 'Homepage', key: 'wa_title_1', en: 'Join Our Daily', hi: 'हमारे दैनिक से जुड़ें', gu: 'અમારા દૈનિકમાં જોડાઓ' },
    { section: 'Homepage', key: 'wa_title_2', en: 'Darshan', hi: 'दर्शन', gu: 'દર્શન' },
    { section: 'Homepage', key: 'wa_title_3', en: 'WhatsApp', hi: 'WhatsApp', gu: 'WhatsApp' },
    { section: 'Homepage', key: 'wa_sub_desc', en: 'Begin your day with divine blessings — receive daily darshan of Shree Ravirandal Maa directly on WhatsApp', hi: 'अपने दिन की शुरुआत दैवीय आशीर्वाद से करें — व्हाट्सएप पर सीधे श्री रविरंदल मां के दैनिक दर्शन प्राप्त करें', gu: 'દિવ્ય આશીર્વાદથી તમારા દિવસની શરૂઆત કરો — સીધા WhatsApp પર શ્રી રવિરાંદલ માના દૈનિક દર્શન મેળવો' },
    { section: 'Homepage', key: 'wa_benefits_title', en: 'What you\'ll receive:', hi: 'आपको क्या मिलेगा:', gu: 'તમને શું પ્રાપ્ત થશે:' },
    { section: 'Homepage', key: 'wa_benefit_1', en: 'Morning Darshan every day', hi: 'प्रतिदिन सुबह के दर्शन', gu: 'રોજ સવારના દર્શન' },
    { section: 'Homepage', key: 'wa_benefit_2', en: 'Evening Aarti updates', hi: 'शाम की आरती अपडेट', gu: 'સાંજના આરતી અપડેટ્સ' },
    { section: 'Homepage', key: 'wa_benefit_3', en: 'Divine blessings & mantras', hi: 'दिव्य आशीर्वाद और मंत्र', gu: 'દિવ્ય આશીર્વાદ અને મંત્રો' },
    { section: 'Homepage', key: 'wa_benefit_4', en: 'Festival & event notifications', hi: 'त्योहार और कार्यक्रम की सूचनाएं', gu: 'ઉત્સવ અને ઇવેન્ટ સૂચનાઓ' },
    { section: 'Homepage', key: 'wa_benefit_5', en: 'Exclusive temple photos', hi: 'विशेष मंदिर तस्वीरें', gu: 'મંદિરના વિશેષ ફોટા' },
    { section: 'Homepage', key: 'wa_benefit_6', en: 'Bapu\'s spiritual messages', hi: 'बापू के आध्यात्मिक संदेश', gu: 'બાપુના આધ્યાત્મિક સંદેશાઓ' },
    { section: 'Homepage', key: 'wa_member_label', en: 'devotees already joined', hi: 'भक्त पहले ही जुड़ चुके हैं', gu: 'ભક્તો પહેલેથી જ જોડાયા છે' },
    { section: 'Homepage', key: 'wa_card_title', en: 'Daily Darshan Group', hi: 'डेली दर्शन ग्रुप', gu: 'ડેઈલી દર્શન ગ્રુપ' },
    { section: 'Homepage', key: 'wa_qr_label', en: '📷 Scan to Join', hi: '📷 जुड़ने के लिए स्कैन करें', gu: '📷 જોડાવા માટે સ્કેન કરો' },
    { section: 'Homepage', key: 'wa_qr_or', en: '— or —', hi: '— या —', gu: '— અથવા —' },
    { section: 'Homepage', key: 'wa_join_btn', en: 'Join on WhatsApp', hi: 'WhatsApp पर जुड़ें', gu: 'WhatsApp પર જોડાઓ' },
    { section: 'Homepage', key: 'wa_join_note', en: 'Free to join · No spam · Only divine updates', hi: 'जुड़ना मुफ़्त है · कोई स्पैम नहीं · केवल दैवीय अपडेट', gu: 'જોડાવા માટે મફત · કોઈ સ્પામ નહીં · માત્ર દિવ્ય અપડેટ્સ' },
    { section: 'Homepage', key: 'wa_preview_title', en: 'Daily message preview:', hi: 'दैनिक संदेश पूर्वावलोकन:', gu: 'દૈનિક સંદેશ પૂર્વાવલોકન:' },
    { section: 'Homepage', key: 'wa_chat_name', en: 'Shree Ravirandaldham', hi: 'श्री रविरंदलधाम', gu: 'શ્રી રવિરાંદલધામ' },
    { section: 'Homepage', key: 'wa_chat_status', en: '🟢 Daily Darshan Group', hi: '🟢 डेली दर्शन ग्रुप', gu: '🟢 ડેઈલી દર્શન ગ્રુપ' },
    { section: 'Homepage', key: 'wa_msg_1', en: '🌅 <strong>Mangala Aarti</strong> — Jai Randal Maa!', hi: '🌅 <strong>मंगला आरती</strong> — जय रांदल मां!', gu: '🌅 <strong>મંગળા આરતી</strong> — જય રાંદલ માં!' },
    { section: 'Homepage', key: 'wa_sub_1', en: '📸 Today\'s Morning Darshan', hi: '📸 आज के सुबह के दर्शन', gu: '📸 આજના સવારના દર્શન' },
    { section: 'Homepage', key: 'wa_msg_2', en: '🪷 <em>Shree Ravirandal Maa Ni Jai!</em>', hi: '🪷 <em>श्री रविरंदल मां नी जय!</em>', gu: '🪷 <em>શ્રી રવિરાંદલ માં ની જય!</em>' },
    { section: 'Homepage', key: 'wa_sub_2', en: '3 photos attached', hi: '3 तस्वीरें संलग्न हैं', gu: '3 ફોટા જોડાયેલા છે' },
    { section: 'Homepage', key: 'wa_msg_3', en: '🌆 <strong>Sandhya Aarti</strong> Time', hi: '🌆 <strong>संध्या आरती</strong> का समय', gu: '🌆 <strong>સંઘ્યા આરતી</strong> નો સમય' },
    { section: 'Homepage', key: 'wa_sub_3', en: '🎶 Aarti video · 2:34', hi: '🎶 आरती वीडियो · 2:34', gu: '🎶 આરતી વિડિઓ · 2:34' },
    { section: 'Homepage', key: 'wa_banner_text', en: 'Never miss a darshan — Join free and receive blessings every morning', hi: 'कभी दर्शन न चूकें — मुफ़्त जुड़ें और हर सुबह आशीर्वाद प्राप्त करें', gu: 'ક્યારેય દર્શન ચૂકશો નહીં — મફત જોડાઓ અને દરરોજ સવારે આશીર્વાદ મેળવો' },
    { section: 'Homepage', key: 'wa_banner_btn', en: 'Join Now — Free', hi: 'अभी जुड़ें — मुफ़्त', gu: 'અત્યારે જ જોડાઓ — મફત' },

    // SocialMediaSection
    { section: 'Homepage', key: 'social_desc_1', en: 'Daily photos & divine moments', hi: 'दैनिक तस्वीरें और दिव्य क्षण', gu: 'દૈનિક ફોટા અને દિવ્ય ક્ષણો' },
    { section: 'Homepage', key: 'social_desc_2', en: 'Aarti, bhajans & live events', hi: 'आरती, भजन और लाइव इवेंट', gu: 'આરતી, ભજનો અને લાઈવ ઇવેન્ટ્સ' },
    { section: 'Homepage', key: 'social_desc_3', en: 'Updates, events & community seva', hi: 'अपडेट, इवेंट और सामुदायिक सेवा', gu: 'અપડેટ્સ, ઇવેન્ટ્સ અને સામુદાયિક સેવા' },
    { section: 'Homepage', key: 'social_desc_4', en: 'Divine thoughts & blessings daily', hi: 'दैनिक दिव्य विचार और आशीर्वाद', gu: 'દૈનિક દિવ્ય વિચારો અને આશીર્વાદ' },
    { section: 'Homepage', key: 'social_followers_label', en: 'Followers', hi: 'फॉलोअर्स', gu: 'અનુયાયીઓ' },
    { section: 'Homepage', key: 'social_follow_btn', en: 'Follow Now', hi: 'अभी फॉलो करें', gu: 'અત્યારે જ અનુસરો' },
    { section: 'Homepage', key: 'social_flip_hint', en: '📲 Tap for QR', hi: '📲 क्यूआर के लिए टैप करें', gu: '📲 QR માટે ટેપ કરો' },
    { section: 'Homepage', key: 'social_qr_title', en: 'Scan to Follow', hi: 'फॉलो करने के लिए स्कैन करें', gu: 'અનુસરવા માટે સ્કેન કરો' },
    { section: 'Homepage', key: 'social_qr_link', en: 'Open Link →', hi: 'लिंक खोलें →', gu: 'લિંક ખોલો →' },
    { section: 'Homepage', key: 'social_qr_flip_hint', en: '↩ Tap to go back', hi: '↩ वापस जाने के लिए टैप करें', gu: '↩ પાછા જવા માટે ટેપ કરો' },
    { section: 'Homepage', key: 'social_sub_title', en: 'Divine presence of the Lord', hi: 'भगवान की दिव्य उपस्थिति', gu: 'ભગવાનની દિવ્ય ઉપસ્થિતિ' },
    { section: 'Homepage', key: 'social_title_1', en: 'Social', hi: 'सोशल', gu: 'સોશિયલ' },
    { section: 'Homepage', key: 'social_title_2', en: 'Media', hi: 'मीडिया', gu: 'મીડિયા' },
    { section: 'Homepage', key: 'social_desc', en: 'Follow Shree Ravirandaldham on our sacred digital yatra — receive blessings, darshan & divine updates every day', hi: 'हमारी पवित्र डिजिटल यात्रा पर श्री रविरंदलधाम का पालन करें — हर दिन आशीर्वाद, दर्शन और दिव्य अपडेट प्राप्त करें', gu: 'અમારી પવિત્ર ડિજિટલ યાત્રા પર શ્રી રવિરાંદલધામને અનુસરો — દરરોજ આશીર્વાદ, દર્શન અને દિવ્ય અપડેટ્સ મેળવો' },

    // StatsSection
    { section: 'Homepage', key: 'stats_sup_title', en: 'At Shree Ravirandaldham', hi: 'श्री रविरंदलधाम में', gu: 'શ્રી રાવીરાંદલધામ માં' },
    { section: 'Homepage', key: 'stats_sub_title', en: 'Arrangements for visiting devotees', hi: 'आने वाले भक्तों के लिए व्यवस्था', gu: 'આવનાર શ્રદ્ધાળુ ની વ્યવસ્થા' },
    { section: 'Homepage', key: 'stats_label_1', en: 'For Mataji\'s Adornment', hi: 'माताजी के श्रृंगार के लिए', gu: 'માતાજી ના શણગાર માટે' },
    { section: 'Homepage', key: 'stats_label_2', en: 'For Inviting Randal Maa', hi: 'रांदल मां को बुलाने के लिए', gu: 'રાંદલ તેડવા માટે' },
    { section: 'Homepage', key: 'stats_label_3', en: 'For Mother\'s Food Offering', hi: 'माता के थाल के लिए', gu: 'માતા ના થાળ માટે' },
    { section: 'Homepage', key: 'stats_label_4', en: 'For Gaushala', hi: 'गौशाला के लिए', gu: 'ગૌશાળા માટે' },
    { section: 'Homepage', key: 'stats_label_5', en: 'For Akhand Jyot', hi: 'अखंड ज्योत के लिए', gu: 'અખંડ જ્યોત માટે' },

    // HariVani
    { section: 'Homepage', key: 'hari_vani_tag', en: '॥ Preachings of Late Mahant Shree Dineshpuri Bapu ॥', hi: '॥ कैलाश निवासी महंत श्री दिनेशपुरी बापू के गुरुवचन ॥', gu: '॥ કૈલાશ નિવાસી મહંત શ્રી દિનેશપુરીબાપુ ના ગુરુવચન ॥' },
    { section: 'Homepage', key: 'hari_vani_quote', en: 'If desires are not fulfilled, anger increases,<br />And if desires are fulfilled, greed increases', hi: 'इच्छा पूरी न होने पर क्रोध बढ़ता है,<br />और इच्छा पूरी होने पर लोभ बढ़ता है', gu: 'ઈચ્છા પૂરી ના થાય તો ક્રોધ વધે છે,<br />ને ઈચ્છા પૂરી થાય તો લોભ વધે છે' },
    { section: 'Homepage', key: 'hari_vani_attr', en: '— H.H. Dineshpuri Bapu', hi: '— प. पू. दिनेशपुरी बापू', gu: '— પ. પૂ. દીનેશપરી બાપુ' }
];

data.push(...newEntries);
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Appended', newEntries.length, 'entries');
