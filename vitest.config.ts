import { fileURLToPath } from 'url'
// eslint-disable-next-line import/no-extraneous-dependencies
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@/': fileURLToPath(new URL('./', import.meta.url)),
      '@src/': fileURLToPath(new URL('./src/', import.meta.url)),
    },
    exclude: [...configDefaults.exclude, '**/playwright/**'],
    globals: true,
  },
})
