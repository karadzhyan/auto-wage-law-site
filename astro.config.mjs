import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const redirectOnlyPaths = new Set([
  '/pay-plan-auditor/',
  '/tools/pay-plan-auditor/',
  '/exposure-model/',
  '/tools/exposure-model/',
  '/coverage-matrix/',
  '/resources/',
  '/briefs/',
  '/for-dealers/',
  '/for-workers/',
  '/tools/exposure-snapshot/',
  '/tools/pay-plan-check/',
]);

export default defineConfig({
  site: 'https://www.autowagelaw.com',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [sitemap({
    filter: (page) => !redirectOnlyPaths.has(new URL(page).pathname),
  })],
  trailingSlash: 'always',
  redirects: {
    '/pay-plan-auditor': '/tools/pay-system-analyzer/',
    '/tools/pay-plan-auditor': '/tools/pay-system-analyzer/',
    '/exposure-model': '/tools/wage-scenario-lab/',
    '/tools/exposure-model': '/tools/wage-scenario-lab/',
    '/coverage-matrix': '/pay-plans/',
    '/resources': '/law-library/',
    '/briefs': '/law-library/',
    '/for-dealers': '/dealers/',
    '/for-workers': '/workers/',
  },
});
