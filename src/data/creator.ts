// ----------------------------------------------------------------
// Flagship demo data — a mocked-up creator persona and their "takes"
// (clips), used to show what a real Reelcase portfolio looks like on
// the homepage. No real media yet: each take gets a placeholder duotone
// gradient standing in for a vertical video thumbnail (swap `gradient`
// for a real poster-frame image/video src once footage exists).
//
// Brand names below are entirely fictional — invented for the demo,
// not real companies.
// ----------------------------------------------------------------

export type Take = {
  id: string;
  brand: string;
  hook: string;
  category: string;
  timecode: string; // mm:ss, the clip's runtime
  gradient: [string, string]; // duotone stand-in for a vertical thumbnail
};

export const CREATOR = {
  name: 'Priya Chandran',
  handle: '@priya.creates',
  niche: 'Beauty, home & lifestyle UGC',
  location: 'Toronto, ON',
  bio: "I make native-feeling ads that don't feel like ads — three years, thirty-eight brands, one iPhone.",
  stats: [
    { label: 'Takes wrapped', value: '38' },
    { label: 'Organic views driven', value: '4.2M' },
    { label: 'Repeat-client rate', value: '92%' },
  ],
};

export const TAKES: Take[] = [
  {
    id: 'lumen-glow',
    brand: 'Lumen Skincare',
    hook: '3-step glow routine',
    category: 'GRWM',
    timecode: '00:14',
    gradient: ['#F2A93B', '#7A3B1E'],
  },
  {
    id: 'driftwood-sip',
    brand: 'Driftwood Coffee Co.',
    hook: 'First sip, unscripted',
    category: 'Unboxing',
    timecode: '00:09',
    gradient: ['#8C8377', '#241F1B'],
  },
  {
    id: 'pulse-30day',
    brand: 'Pulse Fit App',
    hook: 'I actually stuck to it for 30 days',
    category: 'Testimonial',
    timecode: '00:22',
    gradient: ['#E8462F', '#2A2521'],
  },
  {
    id: 'basil-blind',
    brand: 'Basil & Rye',
    hook: 'Blind taste test, ranked',
    category: 'Taste-test',
    timecode: '00:17',
    gradient: ['#F6C169', '#1C1815'],
  },
  {
    id: 'northfield-tour',
    brand: 'Northfield Home',
    hook: 'Small apartment, big upgrade',
    category: 'Room tour',
    timecode: '00:19',
    gradient: ['#8C8377', '#F2A93B'],
  },
  {
    id: 'wander-stress',
    brand: 'Wander Luggage',
    hook: 'Airport stress test',
    category: 'Product demo',
    timecode: '00:25',
    gradient: ['#2A2521', '#E8462F'],
  },
];
