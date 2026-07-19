import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://autowagelaw.com',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  trailingSlash: 'always',
  redirects: {
    '/pay-plan-auditor': '/tools/pay-plan-check/',
    '/tools/pay-plan-auditor': '/tools/pay-plan-check/',
    '/exposure-model': '/tools/exposure-snapshot/',
    '/tools/exposure-model': '/tools/exposure-snapshot/',
    '/coverage-matrix': '/pay-plans/',
    '/resources': '/law-library/',
    '/briefs': '/law-library/',
    '/for-dealers': '/dealers/',
    '/for-workers': '/workers/',
  },
});
