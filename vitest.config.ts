import path from 'path'
import { fileURLToPath } from 'url'
// eslint-disable-next-line import/no-extraneous-dependencies
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@/': fileURLToPath(new URL('./', import.meta.url)),
      '@shared/': fileURLToPath(new URL('./shared/', import.meta.url)),
      '@src/': fileURLToPath(new URL('./src/', import.meta.url)),
    },
    exclude: [
      ...configDefaults.exclude,
      '**/playwright/**',
      path.resolve(process.cwd(), './src/pages/**/index.page.e2e.test.ts'),
    ],
    globals: true,
  },
})
