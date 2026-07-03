import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Full production site config.
// "site" is used by Astro to generate correct absolute URLs (sitemaps, canonical tags).
// Update this if the domain ever changes.
export default defineConfig({
  site: 'https://www.logicmanse.ca',
  integrations: [tailwind({ applyBaseStyles: false })],
});
