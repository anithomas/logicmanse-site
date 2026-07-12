/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — institutional / "trust-first" per brand brief.
        // navy: primary backgrounds and headers (stability, security)
        // forest: call-to-action + savings/profit accents (never used as a full-page background)
        // slate: body text, uses Tailwind's built-in slate scale for readability
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
        // NEW — print/collateral-only additions from the brand exploration.
        // Never use these as digital UI/CTA colors; forest stays the only
        // digital accent. Reserved for business cards, letterhead, seals.
        parchment: '#F4EFE4',
        brass: '#8A6D3B',
      },
      fontFamily: {
        // Serif headers = "banking/legal firm" gravitas. Sans body = easy everyday reading.
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
