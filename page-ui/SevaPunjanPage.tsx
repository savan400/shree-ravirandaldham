"use client";

import TabContentPage, { TabData } from "./TabContentPage";

const tabs: TabData[] = [
  {
    id: "rajopchar",
    label: "રાજોપચાર\nપૂજન",
    icon: "🙏",
    title: "રાજોપચાર પૂજન",
    images: [
      { src: "/images/seva-1.jpg", alt: "Rajopchar Pujan 1" },
      { src: "/images/seva-2.jpg", alt: "Rajopchar Pujan 2" },
      { src: "/images/seva-3.jpg", alt: "Rajopchar Pujan 3" },
    ],
    bullets: [
      "શ્રી સાળંગપુરધામમાં શ્રી કષ્ટભંજન દેવ હનુમાનજી મહારાજને રાજોપચાર પૂજન ઘણી વખત કરવામાં આવે છે.",
      "ભગવાન શ્રી રામનાં સમર્પિત સેવક હનુમાનજી મહારાજ પણ એક રાજાની જેમ પોતાનાં ભક્તોને કરેને નિરંતર દૂર કરે છે, તેથી જ શ્રી સાળંગપુરધામમાં કોઈને કોઈ કારણસર રાજોપચાર પૂજન કરવામાં આવે છે.",
      "જે ઉપાસથી રાજા પ્રસન્ન થાય છે તેને રાજોપચાર પૂજન કહે છે. શ્રી હનુમાનજી મહારાજ શાસ્ત્રોમાં પ્રચંત છે.",
      "ત્યાર બાદ પ્રાક્તિક લોણામાં લખેલા શાસ્ત્રો, પુરાણો, ઉપનિષદો અને ગાનું પણ હસ્યપૂર્વક પાઠ કરવામાં આવે છે.",
    ],
    highlight:
      "કેઓ વેદના રહસ્યો જાણો છે, તેથી જ રાજોપચાર પૂજનમાં ચાર વેદના મંત્રો સૌપ્રથમ હનુમાનજી મહારાજને સમર્પિત થાય છે.",
  },
  {
    id: "pujim",
    label: "પૂજિમ\nપૂજન",
    icon: "🪔",
    title: "પૂજિમ પૂજન",
    images: [
      { src: "/images/seva-1.jpg", alt: "Pujim Pujan 1" },
      { src: "/images/seva-2.jpg", alt: "Pujim Pujan 2" },
      { src: "/images/seva-3.jpg", alt: "Pujim Pujan 3" },
    ],
    bullets: [],
  },
  {
    id: "samuh",
    label: "સમૂહ માસ્તી\nયજ્ઞ",
    icon: "🔥",
    title: "સમૂહ માસ્તી યજ્ઞ",
    images: [
      { src: "/images/seva-1.jpg", alt: "Samuh Yagna 1" },
      { src: "/images/seva-2.jpg", alt: "Samuh Yagna 2" },
      { src: "/images/seva-3.jpg", alt: "Samuh Yagna 3" },
    ],
    bullets: [],
  },
  {
    id: "hanuman",
    label: "શ્રી હનુમાન ચાલીસા\nયજ્ઞ",
    icon: "📿",
    title: "શ્રી હનુમાન ચાલીસા યજ્ઞ",
    images: [
      { src: "/images/seva-1.jpg", alt: "Hanuman Chalisa 1" },
      { src: "/images/seva-2.jpg", alt: "Hanuman Chalisa 2" },
      { src: "/images/seva-3.jpg", alt: "Hanuman Chalisa 3" },
    ],
    bullets: [],
  },
  {
    id: "maha",
    label: "શ્રી મારુતિ\nયજ્ઞ",
    icon: "🕉️",
    title: "શ્રી મારુતિ યજ્ઞ",
    images: [
      { src: "/images/seva-1.jpg", alt: "Maha Yagna 1" },
      { src: "/images/seva-2.jpg", alt: "Maha Yagna 2" },
      { src: "/images/seva-3.jpg", alt: "Maha Yagna 3" },
    ],
    bullets: [],
  },
  {
    id: "tel",
    label: "તેલ\nઅભિષેક",
    icon: "🪷",
    title: "તેલ અભિષેક",
    images: [
      { src: "/images/seva-1.jpg", alt: "Tel Abhishek 1" },
      { src: "/images/seva-2.jpg", alt: "Tel Abhishek 2" },
      { src: "/images/seva-3.jpg", alt: "Tel Abhishek 3" },
    ],
    bullets: [],
  },
  {
    id: "fal",
    label: "શ્રી\nફળ",
    icon: "🍊",
    title: "શ્રી ફળ",
    images: [
      { src: "/images/seva-1.jpg", alt: "Shri Fal 1" },
      { src: "/images/seva-2.jpg", alt: "Shri Fal 2" },
      { src: "/images/seva-3.jpg", alt: "Shri Fal 3" },
    ],
    bullets: [],
  },
  {
    id: "sukhdi",
    label: "સુખડીની\nમાનતા",
    icon: "🍬",
    title: "સુખડીની માનતા",
    images: [
      { src: "/images/seva-1.jpg", alt: "Sukhdi 1" },
      { src: "/images/seva-2.jpg", alt: "Sukhdi 2" },
      { src: "/images/seva-3.jpg", alt: "Sukhdi 3" },
    ],
    bullets: [],
  },
];

const SevaPunjanPage = () => (
  <TabContentPage pageTitle="સેવા પુંજન" tabs={tabs} defaultTab="rajopchar" />
);

export default SevaPunjanPage;
