// End-to-end consumer check against the real tarball (`npm run test:consumer`):
//   1. npm pack, then install it into a fresh TypeScript + Vite app (single React copy, no dedupe tricks)
//   2. tsc --strict over a fixture with valid usage and `@ts-expect-error` negative cases
//   3. vite build of that app; checks the styles are emitted and the gallery/preview are not in the package
//   4. tree-shaking: an app importing only Button must bundle far less than one importing everything
// Needs network access for `npm install`.
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const run = (command, args, cwd, quiet = true) => execFileSync(command, args, { cwd, stdio: quiet ? 'pipe' : 'inherit', encoding: 'utf8' })
const step = (message) => console.log(`\n> ${message}`)

const work = mkdtempSync(join(tmpdir(), 'ecom-ui-kit-consumer-'))
try {
  step('npm pack')
  const packed = run('npm', ['pack', '--pack-destination', work, '--json'], root)
  const [{ filename, files }] = JSON.parse(packed.slice(packed.indexOf('[')))
  const names = files.map((file) => file.path)
  console.log(`  ${filename}: ${files.length} files`)
  assert.ok(names.includes('dist-lib/ecom-ui-kit.js') && names.includes('dist-lib/styles.css') && names.includes('dist-lib/types/index.d.ts'))
  const leaked = names.filter((name) => /^(src|examples|scripts|node_modules)\//.test(name) || /gallery|preview/i.test(name))
  assert.deepEqual(leaked, [], 'package contains development-only files')
  const bundle = readFileSync(join(root, 'dist-lib/ecom-ui-kit.js'), 'utf8')
  for (const marker of ['Northwind', 'gallery-frame', 'picsum.photos']) assert.ok(!bundle.includes(marker), `bundle contains "${marker}" (preview/gallery code or sample data)`)
  console.log('  no source, gallery, preview or sample data in the package')

  const app = join(work, 'app')
  mkdirSync(app)
  cpSync(join(root, 'scripts/fixtures/consumer'), app, { recursive: true })
  const tarball = join(work, filename)
  writeFileSync(join(app, 'package.json'), JSON.stringify({
    name: 'consumer-fixture', private: true, type: 'module',
    dependencies: { 'ecom-ui-kit': `file:${tarball}`, react: '^19.0.0', 'react-dom': '^19.0.0' },
    devDependencies: { '@types/react': '^19', '@types/react-dom': '^19', '@vitejs/plugin-react': '^6.1.2', typescript: '^5.9', vite: '^8.3.4' },
  }, null, 2))
  writeFileSync(join(app, 'vite.config.js'), `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()], build: { rollupOptions: { input: process.env.ENTRY ?? 'index.html' } } })
`)

  step('npm install (fresh app, tarball)')
  run('npm', ['install', '--no-audit', '--no-fund'], app)
  const reacts = run('npm', ['ls', 'react', '--all', '--parseable'], app).split('\n').filter((line) => line.endsWith('node_modules/react'))
  assert.equal(reacts.length, 1, `expected one React copy, found ${reacts.length}`)
  console.log('  one copy of react installed (peer dependency, not duplicated)')

  step('tsc --strict (valid usage + @ts-expect-error negatives)')
  run('npx', ['tsc', '-p', '.'], app)
  console.log('  type check passed')

  step('vite build')
  const built = run('npx', ['vite', 'build'], app)
  const assets = readdirSync(join(app, 'dist/assets'))
  const css = assets.find((name) => name.endsWith('.css'))
  assert.ok(css, 'no stylesheet emitted')
  const cssText = readFileSync(join(app, 'dist/assets', css), 'utf8')
  assert.ok(cssText.includes('--ui-primary:') && cssText.includes('.bg-primary{') && cssText.includes('.sticky{'), 'kit styles missing from the built CSS')
  assert.ok(/\[data-theme=["']?dark["']?\]/.test(cssText) && cssText.includes('prefers-color-scheme'), 'light/dark theme rules missing from the built CSS')
  console.log(`  ${built.split('\n').filter((line) => line.includes('dist/assets')).map((line) => line.trim().replace(/\s+/g, ' ')).join('\n  ')}`)

  step('tree-shaking')
  const measure = (name, source) => {
    writeFileSync(join(app, 'src', `${name}.tsx`), source)
    writeFileSync(join(app, `${name}.html`), `<!doctype html><div id="root"></div><script type="module" src="/src/${name}.tsx"></script>`)
    execFileSync('npx', ['vite', 'build', '--outDir', `dist-${name}`], { cwd: app, stdio: 'pipe', env: { ...process.env, ENTRY: `${name}.html` } })
    const dir = join(app, `dist-${name}/assets`)
    return readdirSync(dir).filter((file) => file.endsWith('.js')).reduce((sum, file) => sum + statSync(join(dir, file)).size, 0)
  }
  const reactOnly = measure('baseline', "import { createRoot } from 'react-dom/client'\ncreateRoot(document.body).render(<p>hi</p>)\n")
  const buttonOnly = measure('button', "import { createRoot } from 'react-dom/client'\nimport { Button } from 'ecom-ui-kit'\ncreateRoot(document.body).render(<Button>hi</Button>)\n")
  const everything = measure('everything', "import { createRoot } from 'react-dom/client'\nimport * as kit from 'ecom-ui-kit'\nconsole.log(Object.keys(kit))\ncreateRoot(document.body).render(<p>hi</p>)\n")
  const kb = (n) => `${(n / 1024).toFixed(1)} kB`
  const buttonCost = buttonOnly - reactOnly
  const allCost = everything - reactOnly
  console.log(`  React alone ${kb(reactOnly)} | + Button ${kb(buttonCost)} | + whole library (namespace import) ${kb(allCost)}`)
  assert.ok(buttonCost < allCost * 0.25, 'importing one component pulled in most of the library: tree-shaking is not working')
  console.log('\nConsumer check passed.')
} finally {
  if (!process.env.KEEP_CONSUMER_DIR) rmSync(work, { recursive: true, force: true })
  else console.log(`kept ${work}`)
}
