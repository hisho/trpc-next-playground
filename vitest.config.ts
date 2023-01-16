import path from 'path'
import { configDefaults, defineConfig } from 'vitest/config'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import tsConfig from './tsconfig.json'

const schema = z.object({
  compilerOptions: z.object({
    paths: z.record(z.string(), z.string().array()),
  }),
})

const config = () => {
  const parsedTSConfig = schema.safeParse(tsConfig)
  /**
   * @example
   * {
   *  "@src/*": ["./src/*"], -> "@src": "__dirname + ./src"
   *  "@backend/*": ["./backend/*"], -> "@backend": __dirname + "./backend"
   *  "@shared/*": ["./shared/*"], -> "@shared": __dirname + "./shared"
   *  "@/*": ["./*"] -> "@": __dirname + "."
   * }
   */
  const alias = parsedTSConfig.success
    ? Object.fromEntries(
        Object.entries(parsedTSConfig.data.compilerOptions.paths).map(
          ([k, v]) => [
            k.replace(/\/\*$/, ''),
            path.resolve(__dirname, v[0]?.replace(/\/\*$/, '') ?? ''),
          ]
        )
      )
    : {}

  return defineConfig({
    resolve: {
      alias,
    },
    test: {
      exclude: [
        ...configDefaults.exclude,
        '**/playwright/**',
        path.resolve(process.cwd(), './src/pages/**/index.page.e2e.test.ts'),
      ],
      globals: true,
    },
  })
}

export default config()
