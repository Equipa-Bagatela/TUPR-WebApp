/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // BASE: subpasta de alojamento (ex.: GitHub Pages usa /TUPR-WebApp/). Em domínio próprio fica '/'.
  base: process.env.BASE ?? '/',
  test: { environment: 'node', include: ['src/**/*.test.{ts,tsx}'], setupFiles: ['src/test-setup.ts'] },
})
