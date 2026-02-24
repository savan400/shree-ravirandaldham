// lib/events.data.ts
// Single source of truth shared between the listing page and the [id] detail page.

export interface EventData {
  id: string;
  date: string; // "DD.MM.YYYY"
  title: string;
  titleGuj?: string; // optional Gujarati subtitle
  image: string;
  location: string;
  time: string;
  description?: string;
  highlights?: string[];
  organizer?: string;
  contactPhone?: string;
  contactEmail?: string;
  tags?: string[];
}

export const EVENTS: EventData[] = [
  {
    id: "1",
    date: "02.04.2026",
    title: "Shri Hanuman Jayanti 2026",
    titleGuj: "શ્રી હનુમાન જયંતી ૨૦૨૬",
    image: "/images/events/hanuman-jayanti-2026.jpg",
    location: "Salangpur Dham",
    time: "6:00 AM onwards",
    description:
      "Celebrate the divine birth anniversary of Lord Hanuman at Salangpur Dham. The day begins with a grand abhishek followed by special aarti, bhajan sandhya, and prasad distribution for all devotees.",
    highlights: [
      "Maha Abhishek at 6:00 AM",
      "Special Hanuman Chalisa Path",
      "Bhajan Sandhya from 7:00 PM",
      "Maha Prasad for all devotees",
    ],
    organizer: "Salangpur Dham Trust",
    contactPhone: "+91 98765 43210",
    tags: ["Jayanti", "Hanuman", "Puja"],
  },
  {
    id: "2",
    date: "26.03.2026",
    title: "Ram Navami Celebration",
    titleGuj: "રામ નવમી મહોત્સવ",
    image: "/images/events/ram-navami.jpg",
    location: "Salangpur Dham",
    time: "9:00 AM",
    description:
      "Witness the glorious celebration of Lord Rama's birth. The temple will be decorated with flowers and lights, and special rituals will be performed to mark this auspicious day.",
    highlights: [
      "Janmotsav at Noon",
      "Sunderkand Path",
      "Rama Nama Japa",
      "Panjiri Prasad distribution",
    ],
    organizer: "Salangpur Dham Trust",
    tags: ["RamNavami", "Utsav", "Bhakti"],
  },
  {
    id: "3",
    date: "03.03.2026",
    title: "Maha Shivratri Utsav",
    titleGuj: "મહા શિવરાત્રિ ઉત્સવ",
    image: "/images/events/maha-shivratri-2026.jpg",
    location: "Salangpur Dham",
    time: "All Day",
    description:
      "Maha Shivratri — the great night of Lord Shiva — is celebrated with all-night vigil, Rudrabhishek, and devotional singing. Devotees fast and offer prayers through the night in four prahar sessions.",
    highlights: [
      "Rudrabhishek throughout the day",
      "Four Prahar Puja sessions",
      "All-night vigil & bhajans",
      "Bhasma Aarti at midnight",
    ],
    organizer: "Salangpur Dham Trust",
    contactPhone: "+91 98765 43210",
    tags: ["Shivratri", "Shiva", "Fast"],
  },
  {
    id: "4",
    date: "28.02.2026",
    title: "Shree Kashtabhanjan Dev Punam",
    titleGuj: "શ્રી કષ્ટભંજન દેવ પૂનમ",
    image: "/images/events/punam-feb.jpg",
    location: "Salangpur Dham",
    time: "Full Day",
    description:
      "Join the monthly Punam celebrations dedicated to Lord Kashtabhanjan Dev. Thousands of devotees gather to seek blessings and participate in the grand aarti and mahaprasad.",
    highlights: [
      "Grand Marutiyagna",
      "Special Shringar Darshan",
      "Annakut offering",
      "Satsang and Discourses",
    ],
    organizer: "Salangpur Dham Trust",
    tags: ["Punam", "Darshan", "Devotion"],
  },
  {
    id: "5",
    date: "24.02.2026",
    title: "Suryanarayan Dev Abhishek",
    titleGuj: "સૂર્યનારાયણ દેવ અભિષેક",
    image: "/images/events/abhishek.jpg",
    location: "Salangpur Dham",
    time: "Morning Rituals",
    description:
      "A sacred abhishek ceremony for Suryanarayan Dev to welcome the divine rays and seek health and prosperity. The ritual is performed with Vedic chants and traditional offerings.",
    highlights: [
      "Surya Namaskar sessions",
      "Vedic Chantings",
      "Maha Abhishek at sunrise",
      "Health & Wellness seminar",
    ],
    organizer: "Salangpur Dham Trust",
    tags: ["Abhishek", "Surya", "Ritual"],
  },
  {
    id: "6",
    date: "15.02.2026",
    title: "Divyang Vrundavana Samgath",
    titleGuj: "દિવ્યાંગ વૃંદાવન સંગઠ",
    image: "/images/events/divyang-samgath.jpg",
    location: "Salangpur Dham",
    time: "9:00 AM",
    description:
      "A special gathering organised to honour and celebrate differently-abled devotees. The event includes cultural programmes, blessings from the mahant, and a grand bhojan prasad.",
    highlights: [
      "Welcome of 500+ Divyang devotees",
      "Cultural programme by children",
      "Blessings & Samman Samaroh",
      "Grand Bhojan Prasad",
    ],
    organizer: "Salangpur Dham Trust",
    contactPhone: "+91 98765 43210",
    tags: ["Samaj", "Divyang", "Special"],
  },
  {
    id: "7",
    date: "15.02.2026",
    title: "Patotsav 2026",
    titleGuj: "પાટોત્સવ ૨૦૨૬",
    image: "/images/events/patotsav-2026.jpg",
    location: "Salangpur Dham",
    time: "Morning Session",
    description:
      "Patotsav marks the annual foundation anniversary of the Salangpur temple. Grand celebrations include flag hoisting, special puja, procession of the deity, and cultural events.",
    highlights: [
      "Flag Hoisting Ceremony",
      "Palki Procession of Kastbhanjan Dev",
      "Special Annakut offering",
      "Cultural programmes in the evening",
    ],
    organizer: "Salangpur Dham Trust",
    contactPhone: "+91 98765 43210",
    tags: ["Patotsav", "Anniversary", "Procession"],
  },
  {
    id: "8",
    date: "01.02.2026",
    title: "Murti Pratishtha Mahotsav",
    titleGuj: "મૂર્તિ પ્રતિષ્ઠા મહોત્સવ",
    image: "/images/events/murti-pratishtha.jpg",
    location: "Salangpur Dham",
    time: "10:00 AM",
    description:
      "The sacred consecration ceremony of newly installed murtis. Vedic rituals conducted by learned pandits, followed by grand aarti and prasad.",
    highlights: [
      "Vedic Pratishtha Vidhi",
      "Shodashopchar Puja",
      "Grand Aarti & Darshan",
      "Prasad distribution",
    ],
    organizer: "Salangpur Dham Trust",
    contactPhone: "+91 98765 43210",
    tags: ["Pratishtha", "Murti", "Consecration"],
  },
  {
    id: "9",
    date: "28.01.2026",
    title: "Punam List 2026",
    titleGuj: "પૂનમ લિસ્ટ ૨૦૨૬",
    image: "/images/events/punam-list-2026.jpg",
    location: "Salangpur Dham",
    time: "Monthly Schedule",
    description:
      "The complete schedule of Punam (full moon) celebrations at Salangpur Dham for the year 2026. Each Punam is marked with special darshan timings, extended aarti, and prasad for all visiting devotees.",
    highlights: [
      "Extended Darshan timings on every Punam",
      "Special midnight aarti",
      "Free prasad distribution",
      "Monthly schedule available at the temple office",
    ],
    organizer: "Salangpur Dham Trust",
    contactPhone: "+91 98765 43210",
    tags: ["Punam", "Schedule", "Monthly"],
  },
];

export function getEventById(id: string): EventData | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function getAllEventIds(): string[] {
  return EVENTS.map((e) => e.id);
}
