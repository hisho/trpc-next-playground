// eslint-disable-next-line import/no-extraneous-dependencies
import { devices, PlaywrightTestConfig } from '@playwright/test'
import path from 'path'

const baseUrl =
  process.env['PLAYWRIGHT_TEST_BASE_URL'] || 'http://localhost:3000'
console.log(`ℹ️ Using base URL "${baseUrl}"`)

const opts = {
  // launch headless on CI, in browser locally
  headless: !!process.env['CI'] || !!process.env['PLAYWRIGHT_HEADLESS'],
  // collectCoverage: !!process.env.PLAYWRIGHT_HEADLESS
}
const config: PlaywrightTestConfig = {
  outputDir: './playwright/test-results',
  // 'github' for GitHub Actions CI to generate annotations, plus a concise 'dot'
  // default 'list' when running locally
  reporter: process.env['CI'] ? 'github' : 'list',
  testMatch: path.resolve(
    process.cwd(),
    './src/pages/**/index.page.e2e.test.ts'
  ),
  timeout: 35e3,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: baseUrl,
    headless: opts.headless,
    video: 'on',
  },
  webServer: {
    command: 'yarn dev',
    reuseExistingServer: true,
    url: baseUrl,
  },
}

export default config
