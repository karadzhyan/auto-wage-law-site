import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['pay-plans', 'issues']),
    question: z.string(),
    analysisStep: z.enum(['facts', 'classify', 'measure', 'test', 'verify', 'act']),
    jurisdictions: z.array(z.enum(['california', 'federal'])).min(1),
    sourceChecked: z.string(),
    checkScope: z.string(),
    nextCheck: z.string(),
    authorityIds: z.array(z.string()).min(1),
    evidenceDomains: z.array(
      z.enum(['time', 'system', 'output', 'pay', 'plan', 'establishment', 'expense']),
    ).min(1),
    order: z.number(),
    feature: z.enum(['workday-timeline']).optional(),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { articles };
