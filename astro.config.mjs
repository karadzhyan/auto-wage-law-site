import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://autowagelaw.com',
  output: 'static',
  integrations: [sitemap()],
  trailingSlash: 'always',
});
