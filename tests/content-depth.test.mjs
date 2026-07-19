import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { authorities } from '../src/data/authorities.ts';
import { evidenceDomains } from '../src/data/evidence.ts';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const contentRoot = join(projectRoot, 'src/content/articles');
const requiredHeadings = [
  'Question presented',
  'Rule architecture',
  'Decision sequence',
  'Evidence map',
  'Worked example',
  'Strategic implications',
  'Analysis limits',
  'Primary authority',
];
const authorityIds = new Set(authorities.map((authority) => authority.id));
const evidenceIds = new Set(evidenceDomains.map((domain) => domain.id));

async function articleFiles() {
  const sections = ['pay-plans', 'issues'];
  const files = [];
  for (const section of sections) {
    for (const name of await readdir(join(contentRoot, section))) {
      if (name.endsWith('.md')) files.push(join(contentRoot, section, name));
    }
  }
  return files;
}

function splitMarkdown(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, 'article must contain YAML frontmatter');
  return { frontmatter: match[1], body: match[2] };
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
  assert.ok(match, `missing ${key}`);
  return match[1].replace(/["']$/, '');
}

function array(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(\\[[^\\n]*\\])\\s*$`, 'm'));
  assert.ok(match, `missing inline ${key} array`);
  return JSON.parse(match[1].replaceAll("'", '"'));
}

function wordCount(body) {
  return body
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[`*_#|>\[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

test('every core guide meets the analytical content contract', async () => {
  const files = await articleFiles();
  assert.equal(files.length, 13);

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const { frontmatter, body } = splitMarkdown(source);
    const label = file.replace(`${projectRoot}/`, '');

    assert.equal(scalar(frontmatter, 'sourceChecked'), '2026-07-18', `${label} source-check date`);
    assert.equal(scalar(frontmatter, 'nextCheck'), '2026-10-15', `${label} next-check date`);
    assert.match(scalar(frontmatter, 'question'), /\?$/, `${label} question must be bounded and interrogative`);
    assert.ok(scalar(frontmatter, 'checkScope').length >= 35, `${label} needs a meaningful check scope`);
    assert.ok(['facts', 'classify', 'measure', 'test', 'verify', 'act'].includes(scalar(frontmatter, 'analysisStep')));

    const articleAuthorities = array(frontmatter, 'authorityIds');
    assert.ok(articleAuthorities.length >= 4, `${label} needs at least four mapped authorities`);
    for (const id of articleAuthorities) assert.ok(authorityIds.has(id), `${label} references unknown authority ${id}`);

    const articleEvidence = array(frontmatter, 'evidenceDomains');
    assert.ok(articleEvidence.length >= 3, `${label} needs at least three evidence domains`);
    for (const id of articleEvidence) assert.ok(evidenceIds.has(id), `${label} references unknown evidence domain ${id}`);

    const jurisdictions = array(frontmatter, 'jurisdictions');
    assert.ok(jurisdictions.length >= 1);
    assert.ok(jurisdictions.every((value) => ['california', 'federal'].includes(value)));

    for (const heading of requiredHeadings) {
      assert.match(body, new RegExp(`^## ${heading}$`, 'm'), `${label} missing “${heading}”`);
    }

    assert.ok(wordCount(body) >= 700, `${label} has only ${wordCount(body)} substantive words`);
    assert.doesNotMatch(source, /^confidence:|^reviewed:|^sources:/m, `${label} uses superseded review metadata`);
    assert.doesNotMatch(
      source,
      /high confidence|almost never are|section 7\(i\) is available|automatically (?:unpaid|owed)|always exempt/i,
      `${label} contains a categorical or superseded formulation`,
    );
  }
});

test('guide descriptions state a question or distinction without categorical outcomes', async () => {
  for (const file of await articleFiles()) {
    const { frontmatter } = splitMarkdown(await readFile(file, 'utf8'));
    const description = scalar(frontmatter, 'description');
    assert.ok(description.length >= 55 && description.length <= 190);
    assert.doesNotMatch(description, /\b(exempt|illegal|compliant|violation|owed)\b/i);
  }
});

test('the regular-rate guide separates federal workweeks from California payment-specific allocation', async () => {
  const source = await readFile(join(contentRoot, 'issues/regular-rate.md'), 'utf8');

  assert.match(source, /federal calculation is workweek-specific/i);
  assert.match(source, /relevant pay period/i);
  assert.match(source, /did not decide whether California regular rate generally/i);
  assert.match(source, /alvarado-modification/);
  assert.doesNotMatch(source, /A regular rate is a computed workweek rate\./);
});

test('the break-premium guide carries the same payment-specific allocation boundary', async () => {
  const source = await readFile(join(contentRoot, 'issues/meal-rest-breaks.md'), 'utf8');

  assert.match(source, /governing inclusion, allocation, and period rule/i);
  assert.match(source, /Alvarado.*modification expressly leaves the general California pay-period-versus-workweek basis unresolved/is);
  assert.match(source, /"alvarado-modification"/);
  assert.doesNotMatch(source, /Ferra[^\n]*regular rate for that workweek/i);
  assert.doesNotMatch(source, /full workweek['’]s includable compensation/i);
});
