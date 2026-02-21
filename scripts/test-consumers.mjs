import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, cpSync } from 'node:fs'
import path from 'node:path'

const rootDir = path.resolve(new URL('..', import.meta.url).pathname)
const fixturesDir = path.join(rootDir, 'consumer-tests', 'fixtures')
const tmpDir = path.join(rootDir, '.tmp', 'consumer-tests')

const workspacePackages = [
  '@auditauth/core',
  '@auditauth/web',
  '@auditauth/react',
  '@auditauth/node',
  '@auditauth/next',
]

const fixtures = [
  {
    name: 'consumer-ts-cjs',
    tarballs: ['@auditauth/core', '@auditauth/node'],
  },
  {
    name: 'consumer-ts-nodenext',
    tarballs: ['@auditauth/core', '@auditauth/node'],
  },
  {
    name: 'consumer-ts-bundler',
    tarballs: workspacePackages,
  },
]

const run = (command, args, cwd) => {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
  })
}

const runCapture = (command, args, cwd) => {
  return execFileSync(command, args, {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
    encoding: 'utf8',
  })
}

const parsePackJson = (output) => {
  const firstBracket = output.indexOf('[')
  const lastBracket = output.lastIndexOf(']')

  if (firstBracket === -1 || lastBracket === -1) {
    throw new Error(`Unable to parse npm pack output:\n${output}`)
  }

  return JSON.parse(output.slice(firstBracket, lastBracket + 1))
}

const packWorkspace = (workspaceName) => {
  const output = runCapture('npm', ['pack', '--workspace', workspaceName, '--json'], rootDir)
  const parsed = parsePackJson(output)

  if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].filename) {
    throw new Error(`npm pack did not return a filename for ${workspaceName}`)
  }

  const tarballPath = path.join(rootDir, parsed[0].filename)

  if (!existsSync(tarballPath)) {
    throw new Error(`Packed tarball not found: ${tarballPath}`)
  }

  return tarballPath
}

rmSync(tmpDir, { recursive: true, force: true })
mkdirSync(tmpDir, { recursive: true })

const packedTarballs = new Map()

try {
  for (const workspaceName of workspacePackages) {
    const tarball = packWorkspace(workspaceName)
    packedTarballs.set(workspaceName, tarball)
  }

  for (const fixture of fixtures) {
    const fixtureTemplate = path.join(fixturesDir, fixture.name)
    const fixtureWorkDir = path.join(tmpDir, fixture.name)

    cpSync(fixtureTemplate, fixtureWorkDir, { recursive: true })

    run('npm', ['install'], fixtureWorkDir)

    const localTarballs = fixture.tarballs.map((packageName) => {
      const tarballPath = packedTarballs.get(packageName)
      if (!tarballPath) {
        throw new Error(`Missing tarball mapping for ${packageName}`)
      }
      return tarballPath
    })

    run('npm', ['install', '--no-save', ...localTarballs], fixtureWorkDir)

    const fixturePackageJson = JSON.parse(
      readFileSync(path.join(fixtureWorkDir, 'package.json'), 'utf8'),
    )

    if (fixturePackageJson.scripts?.typecheck) {
      run('npm', ['run', 'typecheck'], fixtureWorkDir)
    }

    if (fixturePackageJson.scripts?.build) {
      run('npm', ['run', 'build'], fixtureWorkDir)
    }

    if (fixturePackageJson.scripts?.start) {
      run('npm', ['run', 'start'], fixtureWorkDir)
    }
  }

  console.log('\nConsumer fixtures passed successfully.')
} finally {
  for (const tarballPath of packedTarballs.values()) {
    rmSync(tarballPath, { force: true })
  }

  rmSync(tmpDir, { recursive: true, force: true })
}
