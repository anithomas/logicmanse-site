/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Legacy palette — kept so un-migrated inner pages (about/services/
        // portfolio/trust-security) still render; not used by the Reelcase
        // brand pages. Retire once those pages get their content rewrite.
        navy: {
          DEFAULT: '#0B1F3A',
          light: '#14294B',
          dark: '#071427',
        },
        forest: {
          DEFAULT: '#1F6F4A',
          light: '#2C8A5D',
          dark: '#154A32',
        },
        parchment: '#F4EFE4',
        brass: '#8A6D3B',

        // Reelcase brand palette — warm film-grain cinematic, not near-black.
        // reel: the stage (warm near-black, brown undertone, never pure #000)
        // negative: card/panel surface, one step up from reel
        // tungsten: primary accent — warm practical-light glow
        // safety: sparing use only — rec dot, live indicators, primary CTA
        // print: primary text on dark (warm off-white, never pure #fff)
        // ash: secondary text, timecodes, captions
        reel: {
          DEFAULT: '#1C1815',
          light: '#241F1B',
        },
        negative: '#2A2521',
        tungsten: {
          DEFAULT: '#F2A93B',
          light: '#F6C169',
        },
        safety: '#E8462F',
        print: '#F4EFE6',
        ash: '#8C8377',
      },
      fontFamily: {
        // Legacy — inner pages not yet migrated.
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],

        // Reelcase type system.
        display: ['"Big Shoulders Display"', 'sans-serif'],
        body: ['"Work Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
