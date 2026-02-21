import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const targetDir = path.resolve(process.cwd(), process.argv[2] ?? 'dist')

const walk = (dirPath) => {
  const entries = readdirSync(dirPath)
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      files.push(...walk(fullPath))
      continue
    }

    files.push(fullPath)
  }

  return files
}

const cjsFiles = walk(targetDir).filter((filePath) => filePath.endsWith('.cjs'))
let updatedFiles = 0

for (const filePath of cjsFiles) {
  const source = readFileSync(filePath, 'utf8')
  const updated = source.replace(/(require\(\s*['"])(\.{1,2}\/[^'"]+)\.js(['"]\s*\))/g, '$1$2.cjs$3')

  if (updated === source) {
    continue
  }

  writeFileSync(filePath, updated, 'utf8')
  updatedFiles += 1
}

if (updatedFiles > 0) {
  console.log(`Updated ${updatedFiles} CJS file(s) in ${targetDir}`)
}
