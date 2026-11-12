import { defineConfig } from 'astro/config';
import { rm } from 'node:fs/promises';

export default defineConfig({
  site: 'https://tochilkina-os.github.io',
  base: '/site',
  integrations: [{
    name: 'exclude-pupil-originals',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await rm(new URL('achievements%20of%20pupils/', dir), { recursive: true, force: true });
      },
    },
  }],
  build: {
    inlineStylesheets: 'auto',
  },
});
