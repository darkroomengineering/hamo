import { defineConfig } from 'tsup'

// This file exsist as the core has to be built first as all other packages depend on it
export default defineConfig(() => {
  console.log(`\x1b[31mLNS\x1b[0m\x1b[1m Building core package\x1b[0m\n`)
  return { clean: true }
})
