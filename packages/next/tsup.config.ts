import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  bundle: false,
})
