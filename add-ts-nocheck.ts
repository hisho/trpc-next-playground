import fs from 'fs'
import { glob } from 'glob'
import path from 'path'

/**
 * glob patterns
 */
const patterns = ['node_modules/@trpc/**/!(*.d).ts']

/**
 * ['path/to/file.ts', 'path/to/file2.ts']
 */
const FILES = patterns.flatMap((pattern) =>
  glob.sync(path.resolve(__dirname, pattern))
)

const ADDED_STR = '// @ts-nocheck\n\n'

const addTsNoCheck = async (file: string) => {
  const resolvedFilePath = path.resolve(__dirname, file)

  const content = fs.readFileSync(resolvedFilePath).toString()

  if (content.includes(ADDED_STR)) {
    console.log(JSON.stringify(ADDED_STR), 'is already in', resolvedFilePath)
  } else {
    fs.writeFileSync(resolvedFilePath, ADDED_STR + content)
    console.log(JSON.stringify(ADDED_STR), 'added into', resolvedFilePath)
  }
}

Promise.allSettled(FILES.map(addTsNoCheck)).then((results) => {
  let hasErrors = false

  results.forEach((result) => {
    if (result.status === 'rejected') {
      hasErrors = true
      console.error(result.reason)
    }
  })

  if (hasErrors) {
    process.exit(1)
  }
})
