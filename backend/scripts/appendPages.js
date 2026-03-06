const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'translations.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newEntries = [
    // ContactUs
    { section: 'ContactUs', key: 'cu_title', en: 'Contact Us', hi: 'हमसे संपर्क करें', gu: 'અમારો સંપર્ક કરો' },
    { section: 'ContactUs', key: 'cu_address_label', en: 'Address', hi: 'पता', gu: 'સરનામું' },
    { section: 'ContactUs', key: 'cu_address_value', en: 'Ravi, near Dadva Road, near vasavad, Ravi Randal Na, Randal Na Dadava, Dadva, Gujarat 365460', hi: 'रवि, दाडवा रोड के पास, वासवाड़ के पास, रवि रांदल ना, रांदल ना दाडवा, दाडवा, गुजरात 365460', gu: 'રવિ, દડવા રોડ પાસે, વાસાવડ પાસે, રવિ રાંદલ ના, રાંદલ ના દડવા, દડવા, ગુજરાત 365460' },
    { section: 'ContactUs', key: 'cu_phone_label', en: 'Phone', hi: 'फ़ोन', gu: 'ફોન' },
    { section: 'ContactUs', key: 'cu_email_label', en: 'Email', hi: 'ईमेल', gu: 'ઈમેલ' },
    { section: 'ContactUs', key: 'cu_timings_label', en: 'Darshan Timings', hi: 'दर्शन का समय', gu: 'દર્શન સમય' },
    { section: 'ContactUs', key: 'cu_timings_morning', en: 'Morning: 6:00 AM – 12:00 PM', hi: 'सुबह: 6:00 AM – 12:00 PM', gu: 'સવારે: 6:00 AM – 12:00 PM' },
    { section: 'ContactUs', key: 'cu_timings_evening', en: 'Evening: 4:00 PM – 9:00 PM', hi: 'शाम: 4:00 PM – 9:00 PM', gu: 'સાંજે: 4:00 PM – 9:00 PM' },
    { section: 'ContactUs', key: 'cu_find_us_heading', en: 'Find Us', hi: 'हमें खोजें', gu: 'અમને શોધો' },
    { section: 'ContactUs', key: 'cu_find_us_sub', en: 'Salangpur Dham — Kashtabhanjan Dev Mandir', hi: 'साळंगपुर धाम — कष्टभंजन देव मंदिर', gu: 'સાળંગપુર ધામ — કષ્ટભંજન દેવ મંદિર' },

    // Donation
    { section: 'Donation', key: 'don_title', en: 'Donation', hi: 'दान', gu: 'દાન' },
    { section: 'Donation', key: 'don_donor_name', en: "Donor's Name", hi: 'दाता का नाम', gu: 'દાતાનું નામ' },
    { section: 'Donation', key: 'don_email', en: 'Email', hi: 'ईमेल', gu: 'ઈમેલ' },
    { section: 'Donation', key: 'don_contact', en: 'Contact', hi: 'संपर्क', gu: 'સંપર્ક' },
    { section: 'Donation', key: 'don_cat_gaudaan', en: 'Gaudaan', hi: 'गौदान', gu: 'ગૌદાન' },
    { section: 'Donation', key: 'don_cat_gaudaan_sub', en: 'Gayo na ghaaschaara mate', hi: 'गायों के चारे के लिए', gu: 'ગાયોના ઘાસચારા માટે' },
    { section: 'Donation', key: 'don_cat_bhavan', en: 'Nutan Yatrik Bhavan', hi: 'नूतन यात्री भवन', gu: 'નૂતન યાત્રિક ભવન' },
    { section: 'Donation', key: 'don_cat_bhavan_sub', en: 'Construction Help', hi: 'निर्माण में सहायता', gu: 'બાંધકામ માટે સહાય' },
    { section: 'Donation', key: 'don_cat_maanta', en: 'Maanta (Mannat)', hi: 'मानता (मन्नत)', gu: 'માનતા (મન્નત)' },
    { section: 'Donation', key: 'don_choose_listed', en: 'Choose From The Amount Listed:', hi: 'सूचीबद्ध राशि में से चुनें:', gu: 'સૂચિબદ્ધ રકમમાંથી પસંદ કરો:' },
    { section: 'Donation', key: 'don_cat_thaal', en: 'Thaal (Dada no Bhog)', hi: 'थाल (दादा का भोग)', gu: 'થાળ (દાદા નો ભોગ)' },
    { section: 'Donation', key: 'don_cat_yagna', en: 'Navchandi Yagna', hi: 'नवचंडी यज्ञ', gu: 'નવચંડી યજ્ઞ' },
    { section: 'Donation', key: 'don_yagna_1', en: '₹ 25000 (One Day)', hi: '₹ 25000 (एक दिन)', gu: '₹ 25000 (એક દિવસ)' },
    { section: 'Donation', key: 'don_yagna_2', en: '₹ 51000 (Two Days)', hi: '₹ 51000 (दो दिन)', gu: '₹ 51000 (બે દિવસ)' },
    { section: 'Donation', key: 'don_cat_bhet', en: 'Bhet (Swaichhik Donation)', hi: 'भेंट (स्वैच्छिक दान)', gu: 'ભેટ (સ્વૈચ્છિક દાન)' },
    { section: 'Donation', key: 'don_custom_amt', en: 'Custom Amount', hi: 'कस्टम राशि', gu: 'અન્ય રકમ' },
    { section: 'Donation', key: 'don_min_amt_prefix', en: 'Minimum amt.', hi: 'न्यूनतम राशि', gu: 'ન્યૂનતમ રકમ' },
    { section: 'Donation', key: 'don_min_amt_suffix', en: 'or higher', hi: 'या अधिक', gu: 'અથવા વધુ' },
    { section: 'Donation', key: 'don_pay_now', en: 'Pay Now', hi: 'अब भुगतान करें', gu: 'હવે ચૂકવણી કરો' }
];

data.push(...newEntries);
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Appended', newEntries.length, 'entries');
