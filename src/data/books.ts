// ----------------------------------------------------------------
// One record per title, and the single source of truth for every page
// that talks about a book: the /books/ listing, the homepage featured
// cards, and each title's own product page.
//
// TWO PAGES PER BOOK, and they are not interchangeable:
//
//   productHref — /books/<slug>/ — for a visitor who has NOT bought.
//                 It sells: cover, what's inside, and the two buy
//                 buttons. Reached from the site's own navigation.
//
//   qrHref      — the short URL PRINTED INSIDE THE BOOK, next to a QR
//                 code — for a reader who HAS bought and is holding it.
//                 It gives away the free companion and never sells
//                 anything. These URLs are fixed in printed covers and
//                 must never change or be repointed.
//
// Copy below is taken from each title's blueprint and printed cover
// (Book Blueprint No. 01 = rental log, No. 02 = heart health) rather
// than written fresh, so the site and the books can't drift apart.
// ----------------------------------------------------------------

export interface Book {
  key: 'leia' | 'rentalLog' | 'heartHealth';
  slug: string;
  productHref: string;
  qrHref: string;
  category: string;
  title: string;
  /** One line, for cards and the product hero. */
  tagline: string;
  /** Longer, for the /books/ listing. */
  description: string;
  specs: string;
  cover: string;
  coverAlt: string;
  interior?: string;
  interiorAlt?: string;
  /** The listing video — the same silent square slideshow Etsy shows. */
  video?: string;
  /** Its first frame, and square like the video. Using a non-square
      still here makes the player box adopt the still's shape before the
      video's metadata loads, which letterboxes the whole slideshow. */
  videoPoster?: string;
  /** What is actually in the printed book. */
  inside: string[];
  /** The free bonus every copy comes with, delivered via qrHref. */
  companion: { name: string; blurb: string };
  /** Optional pull-quote for the product page. */
  story?: { quote: string; body: string };
}

export const BOOKS: Book[] = [
  {
    key: 'leia',
    slug: 'leia-coloring-book',
    productHref: '/books/leia-coloring-book/',
    qrHref: '/LeiaColoringBook/',
    category: 'Coloring & Activity Book',
    title: 'Super Leia to the Rescue!',
    tagline:
      'A coloring and activity book inspired by a real dog — 30 coloring pages, mazes, word searches and drawing prompts.',
    description:
      'A coloring & activity book inspired by a real dog named Leia — mazes, word searches, and 30 coloring pages, with a free bonus color pack and real photos for kids and parents.',
    specs: '8.5" × 11" · 106 pages · ages 4–8',
    cover: '/leia-coloring-book/cover-front.jpg',
    coverAlt: 'Super Leia to the Rescue! book cover',
    interior: '/leia-coloring-book/backyard-illustration.jpg',
    interiorAlt: "Leia's backyard, illustrated",
    video: '/leia-coloring-book/promo-video.mp4',
    videoPoster: '/leia-coloring-book/video-poster.jpg',
    inside: [
      '30 coloring pages — portraits, seasons, walks, naps and holiday scenes',
      'Mazes, word searches, crosswords, dot-to-dots and word scrambles, alternated so the book never feels repetitive',
      'Drawing prompts with a bordered blank box: her dream dog house, her birthday cake, you playing fetch with her',
      'Counting, letter tracing, sequencing and simple sums, worked into the activities rather than bolted on',
      'A full answer key at the back, so a parent is never the one stuck',
    ],
    companion: {
      name: "Leia's bonus color pack",
      blurb:
        'Full-colour reference images for all 30 pages, real photos of the actual dog, and every puzzle answer.',
    },
    story: {
      quote: 'Leia is a real dog.',
      body:
        'Every page in this book started from a photograph of her — the same fluffy tail, the same triangle ears, the same spot in the backyard. Kids who finish the book get to meet her properly in the bonus pack.',
    },
  },
  {
    key: 'rentalLog',
    slug: 'rental-property-record-book',
    productHref: '/books/rental-property-record-book/',
    qrHref: '/RentalManagementLog/',
    category: 'Log Book',
    title: 'Rental Property Record Book',
    tagline:
      'Built for a landlord managing 1–6 properties, not a property-management firm — 109 undated pages for a full year of real use.',
    description:
      'A record book for a landlord with 1–6 properties, not a property-management firm — rent tracking, tenant & lease logs, maintenance, a mileage log, a vendor directory, and a portfolio-wide annual summary built for tax time.',
    // 109 is the interior; the Etsy print-at-home PDF is 111 because it
    // adds the two cover pages, and its listing title says so. Spell out
    // both here so a buyer clicking through doesn't meet a new number.
    specs: '8.5" × 11" · 109-page interior (111-page printable) · undated',
    cover: '/rental-management-log/cover-front.jpg',
    coverAlt: 'Rental Property Record Book cover',
    interior: '/rental-management-log/interior-page.jpg',
    interiorAlt: 'A sample interior page: the monthly income & expense tracker',
    video: '/rental-management-log/promo-video.mp4',
    videoPoster: '/rental-management-log/video-poster.jpg',
    inside: [
      'A 12-month rent payment tracker, with two units per property across up to 6 properties',
      'Tenant & lease logs, and a key-dates page that puts every renewal and expiry in one place',
      'Maintenance & repair logs, move-in / move-out condition checklists, and a security deposit record',
      'A mileage & travel log for tax-deductible property visits — the thing reviewers of other books kept asking for',
      'A vendor & contractor directory organised by trade, so you are not searching your texts at 9pm',
      'Monthly income & expense trackers and a portfolio-wide annual summary built for tax time',
    ],
    companion: {
      name: 'the digital rental tracker',
      blurb:
        'A 17-tab spreadsheet mirroring every section of the book, with a year-end ROI dashboard that totals itself.',
    },
    story: {
      quote: 'Generic expense categories, on purpose.',
      body:
        'No IRS Schedule E line numbers anywhere in it. One competing title got called out in a UK review for being "too American" — this one stays usable for a landlord in any country.',
    },
  },
  {
    key: 'heartHealth',
    slug: 'heart-health-log-book',
    productHref: '/books/heart-health-log-book/',
    qrHref: '/HeartHealthLog/',
    category: 'Log Book',
    title: 'The Complete Heart Health Log Book',
    tagline:
      'One book instead of four, for someone living with a heart condition that is managed rather than cured.',
    description:
      'One book instead of four, for someone living with a heart condition that is managed rather than cured — blood pressure, medicines from morning to bedtime, a blood thinner schedule that changes with the day of the week, test results, and the surgical history every new clinic asks for.',
    specs: '8.5" × 11" · 118 pages · undated · large print',
    cover: '/heart-health-log/cover-front.jpg',
    coverAlt: 'The Complete Heart Health Log Book cover',
    interior: '/heart-health-log/interior-page.jpg',
    interiorAlt: 'A sample interior page: the blood thinner prescribed-schedule log',
    video: '/heart-health-log/promo-video.mp4',
    videoPoster: '/heart-health-log/video-poster.jpg',
    // Verbatim from the printed back cover, under "INSIDE".
    inside: [
      '52 weekly pages — a whole week visible at a glance, in large, easy-to-read print',
      '12 monthly reviews, with a daily weight chart and room for the questions you forget',
      'Blood pressure, heart rate, weight, and morning-noon-evening-bedtime medicines',
      'A blood thinner schedule built for a dose that changes with the day of the week',
      'Surgery history, valve and device records, procedures, dental visits, blood work',
      'A plain-English glossary of 78 terms, and conversion tables for kg, litres and salt',
      'Space for the results nobody ever hands you a copy of',
      'A page for whoever is helping you, so they can pick it up on a bad day',
    ],
    companion: {
      name: 'the companion spreadsheet',
      blurb: 'The same logs as the printed book, for the weeks you would rather type than write.',
    },
    story: {
      quote: 'Not one number in here is ours.',
      body:
        'There is no target range, no dosage and no warning sign printed anywhere in this book. Every one of them is a blank line — because they are set for you personally, by the people looking after you. This is simply where yours go.',
    },
  },
];

export const bookBySlug = (slug: string) => BOOKS.find((b) => b.slug === slug)!;
