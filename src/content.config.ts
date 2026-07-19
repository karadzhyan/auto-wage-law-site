import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['pay-plans', 'issues']),
    reviewed: z.string(),
    confidence: z.literal('reviewed'),
    order: z.number(),
    feature: z.enum(['workday-timeline']).optional(),
    related: z.array(z.string()).default([]),
    sources: z.array(
      z.object({
        label: z.string(),
        url: z.url(),
      }),
    ),
  }),
});

export const collections = { articles };
