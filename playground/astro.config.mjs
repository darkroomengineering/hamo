import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [react()],
  devToolbar: {
    enabled: false,
  },
  srcDir: './www',
})
