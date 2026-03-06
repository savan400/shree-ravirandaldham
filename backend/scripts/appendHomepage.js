const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'translations.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newEntries = [
    // Daily Darshan
    { section: 'Homepage', key: 'daily_tag', en: 'Daily Darshan of Lord', hi: 'भगवान के दैनिक दर्शन', gu: 'ભગવાનનાં દરરોજ દર્શન' },
    { section: 'Homepage', key: 'daily_title', en: 'Daily Darshan', hi: 'डेली दर्शन', gu: 'ડેઈલી દર્શન' },
    { section: 'Homepage', key: 'daily_morning', en: 'Morning Darshan', hi: 'सुबह के दर्शन', gu: 'સવારના દર્શન' },
    { section: 'Homepage', key: 'daily_evening', en: 'Evening Darshan', hi: 'शाम के दर्शन', gu: 'સાંજના દર્શન' },
    { section: 'Homepage', key: 'daily_mangala', en: 'Mangala Aarti', hi: 'मंगला आरती', gu: 'મંગળા આરતી' },
    { section: 'Homepage', key: 'daily_view_all', en: 'VIEW ALL DARSHAN', hi: 'सभी दर्शन देखें', gu: 'બધા દર્શન જુઓ' },

    // KingOfSalangpur
    { section: 'Homepage', key: 'king_tag', en: 'Pride of Gujarat', hi: 'गुजरात का गौरव', gu: 'ગુજરાતની ગૌરવ' },
    { section: 'Homepage', key: 'king_title', en: 'Mataji\'s Trishul', hi: 'माताजी का त्रिशूल', gu: 'માતાજી નું ત્રિશૂલ' },
    { section: 'Homepage', key: 'king_desc', en: 'The tallest statue of Shree Hanumanji Maharaj built in Panchadhatu in Gujarat, \'King of Salangpur\', is a confluence of devotion, service, and art.', hi: 'गुजरात में पंचधातु से निर्मित श्री हनुमानजी महाराज की सबसे ऊंची प्रतिमा \'किंग ऑफ सालंगपुर\' भक्ति, सेवा और कला का संगम है।', gu: 'ગુજરાતમાં પંચધાતુમાં નિર્મિત શ્રી હનુમાનજી મહારાજની સૌથી ઉંચી પ્રતિમા \'કિંગ ઓફ સાળંગપુર\' ભક્તિ, સેવા અને કળાનાં દિવ્યતા અને ભવ્યતાનાં સંગમ સમાન છે. માત્ર સ્વામિનારાયણ સંપ્રદાય જ નહીં પરંતુ ગુજરાત અને સનાતન ધર્મનાં ગૌરવ સમાન આ પ્રતિમા સાળંગપુરધામમાં સૌને દર્શન આપે છે.' },
    { section: 'Homepage', key: 'king_stat_1', en: 'Total Height', hi: 'कुल ऊंचाई', gu: 'કુલ ઊંચાઈ' },
    { section: 'Homepage', key: 'king_stat_2', en: 'Year Built', hi: 'निर्माण वर्ष', gu: 'નિર્માણ વર્ષ' },
    { section: 'Homepage', key: 'king_stat_3', en: 'Devotees\' Love', hi: 'भक्तों का स्नेह', gu: 'ભક્તોનો સ્નેહ' },

    // KashtabhanjanDev
    { section: 'Homepage', key: 'kashta_badge', en: '॥ Randal\'s Dadva ॥', hi: '॥ रांदल के दडवा ॥', gu: '॥ રાંદલના દડવા ॥' },
    { section: 'Homepage', key: 'kashta_title', en: 'Shree Ravirandal Maa', hi: 'श्री रविरंदल मां', gu: 'શ્રી રવિરાંદલ માં' },
    { section: 'Homepage', key: 'kashta_desc', en: 'A soul that comes to the refuge of Shree Kashtabhanjandev has never gone back empty-handed.', hi: 'श्री कष्टभंजनदेव की शरण में आया कोई भी जीव कभी खाली हाथ नहीं लौटा है।', gu: 'શ્રી કષ્ટભંજનદેવની શરણમાં આવેલો જીવ ક્યારેય ખાલી હાથે પાછો ગયો નથી. તેમની મનોકામના સદૈવ પૂર્ણ થઈ છે. દાદાનાં દર્શન, સાધના અને સેવાથી એવા એક નહીં પણ અસંખ્ય માનવીઓ અને પરિવારોએ શાંતિ, સુરક્ષા અને સુખ મેળવ્યાં છે. દેશ-વિદેશની અગણિત પેઢીઓ હનુમાનજીનાં આશીર્વાદ થકી સમૃદ્ધ થઈ છે.' },

    // FacilitiesCards
    { section: 'Homepage', key: 'facilities_badge', en: '॥ Service for Devotees ॥', hi: '॥ भक्तों के लिए सेवा ॥', gu: '॥ ભક્તો માટે સેવા ॥' },
    { section: 'Homepage', key: 'facilities_title', en: 'Facilities', hi: 'सुविधाएं', gu: 'સુવિધાઓ' },
    { section: 'Homepage', key: 'facility_1_title', en: 'Gaushala', hi: 'गौशाला', gu: 'ગૌશાળા' },
    { section: 'Homepage', key: 'facility_1_desc', en: 'Shree Kashtabhanjandev Bhojanalay located in Salangpurdham is the largest dining hall in Gujarat with a construction of 3,25,000 square feet on a huge land of 7 bighas.', hi: 'सालंगपुर धाम में स्थित श्री कष्टभंजनदेव भोजनालय गुजरात का सबसे बड़ा भोजनालय है जो 7 बीघा की विशाल भूमि पर 3,25,000 वर्ग फुट के निर्माण के साथ है।', gu: '7 વીઘા જેટલી વિશાળ જમીન પર 3,25,00 સ્ક્વેર ફીટ બાંધકામ ધરાવતું ગુજરાતનું સૌથી મોટું ભોજનાલય સાળંગપુરધામમાં આવેલું શ્રી કષ્ટભંજનદેવ ભોજનાલય છે.' },
    { section: 'Homepage', key: 'facility_1_tag', en: 'Food Service', hi: 'भोजन सेवा', gu: 'ભોજન સેવા' },
    { section: 'Homepage', key: 'facility_2_title', en: 'Dining Hall', hi: 'डाइनिंग हॉल', gu: 'જમવાનો હોલ' },
    { section: 'Homepage', key: 'facility_2_desc', en: 'Shree Gopalanand Swami Yatrik Bhavan, under construction on a vast area of 20 bighas in the temple premises itself, will be the largest Yatrik Bhavan in India.', hi: 'मंदिर परिसर में ही 20 बीघा के विशाल क्षेत्र पर निर्माणाधीन श्री गोपालनंद स्वामी यात्री भवन भारत का सबसे बड़ा यात्री भवन होगा।', gu: 'મંદિર પરિસરમાં જ 20 વીઘાની વિશાળતમ જગ્યા પર 8,85,000 સ્ક્વેર ફૂટમાં નિર્માણાધીન શ્રી ગોપાળાનંદ સ્વામી યાત્રિક ભવન ભારતનું સૌથી મોટું યાત્રિક ભવન બની રહેશે.' },
    { section: 'Homepage', key: 'facility_2_tag', en: 'Accommodation Service', hi: 'आवास सेवा', gu: 'આવાસ સેવા' },
    { section: 'Homepage', key: 'facility_3_title', en: 'Accommodation Facility', hi: 'आवास सुविधा', gu: 'ઉતારા વ્યવસ્થા' }
];

data.push(...newEntries);
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Appended', newEntries.length, 'entries');
