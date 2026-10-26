import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tochilkina-os.github.io',
  base: '/site',
  build: {
    inlineStylesheets: 'auto',
  },
});
