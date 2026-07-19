import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve('dist');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return nested.flat();
}

function targetCandidates(pathname) {
  if (pathname === '/') return [join(root, 'index.html')];
  const local = join(root, pathname.replace(/^\//, ''));
  if (/\.[a-z0-9]+$/i.test(pathname)) return [local];
  return [local, `${local}.html`, join(local, 'index.html')];
}

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

const htmlFiles = (await walk(root)).filter((path) => path.endsWith('.html'));
const missing = [];
const attributePattern = /\b(?:href|src)=["']([^"']+)["']/g;

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  for (const match of html.matchAll(attributePattern)) {
    const value = match[1];
    if (!value || value.startsWith('#') || value.startsWith('http:') || value.startsWith('https:') || value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('data:')) continue;
    const pathname = decodeURIComponent(value.split('#')[0].split('?')[0]);
    if (!pathname.startsWith('/')) continue;
    const candidates = targetCandidates(pathname);
    if (!(await Promise.any(candidates.map(async (candidate) => {
      if (await exists(candidate)) return true;
      throw new Error('missing');
    })).catch(() => false))) {
      missing.push(`${htmlFile.replace(root, 'dist')}: ${value}`);
    }
  }
}

if (missing.length > 0) {
  console.error(`Broken first-party links/assets:\n${missing.join('\n')}`);
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} generated HTML files: all first-party links and assets resolve.`);
