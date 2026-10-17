// Generates TypeScript declarations from the library's JSDoc into dist-lib/types (no source rewrite).
//
//  1. `tsc` emits .d.ts files for src/library (allowJs + declaration).
//  2. Post-process: many components document only their main props in JSDoc, while also accepting
//     pass-through props (className, id, children, DOM attributes, ...). Typed as emitted, TypeScript
//     users would get false errors on those. For such components the props type becomes
//     `(documented props) & { [key: string]: unknown }`: documented props keep their exact types,
//     undocumented ones are accepted untyped. Families whose types.js is the complete contract stay strict.
//
// Run by `npm run build:lib`.
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '..')
const out = join(root, 'dist-lib', 'types')

/** Families whose `types.js` lists every prop they accept: keep these strict. */
const STRICT = new Set(['Navbar', 'ProductCard', 'ProductGrid', 'Sidebar', 'Footer'])

rmSync(out, { recursive: true, force: true })
execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(root, 'tsconfig.types.json')], { stdio: 'inherit', cwd: root })

const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (path.endsWith('.d.ts')) files.push(path)
  }
}
walk(out)

const program = ts.createProgram(files, { skipLibCheck: true, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler })
const checker = program.getTypeChecker()
let loosened = 0
const strict = []

for (const file of files) {
  const source = program.getSourceFile(file)
  const edits = []
  ts.forEachChild(source, (node) => {
    if (!ts.isFunctionDeclaration(node) || !node.name) return
    if (!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export)) return
    const param = node.parameters[0]
    if (!param?.type || !ts.isObjectBindingPattern(param.name)) return

    if (STRICT.has(node.name.text)) return void strict.push(node.name.text)

    const type = checker.getTypeAtLocation(param)
    if (type.getStringIndexType()) return
    const known = new Set(type.getProperties().map((symbol) => symbol.name))
    const hasRest = param.name.elements.some((element) => element.dotDotDotToken)
    const missing = param.name.elements.filter((element) => !element.dotDotDotToken && !known.has((element.propertyName ?? element.name).getText()))
    if (!missing.length && !hasRest) return

    edits.push({ start: param.type.getStart(source), end: param.type.getEnd(), text: `(${param.type.getText(source)}) & { [key: string]: unknown }` })
    loosened += 1
  })
  if (!edits.length) continue
  let text = readFileSync(file, 'utf8')
  for (const edit of edits.sort((a, b) => b.start - a.start)) text = text.slice(0, edit.start) + edit.text + text.slice(edit.end)
  writeFileSync(file, text)
}

// Data types (Product, NavbarLink, CartItem, ...) live in each family's types.js. Re-export them from the entry
// so consumers can `import type { Product } from 'ecom-ui-kit'`. Two files declaring the same name would clash.
const typeFiles = files.filter((file) => /(^|\/)types\.d\.ts$/.test(file) || file.endsWith('/utils/cart.d.ts')).sort()
const owners = new Map()
for (const file of typeFiles) {
  const source = program.getSourceFile(file)
  ts.forEachChild(source, (node) => {
    if ((ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) && ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) {
      if (owners.has(node.name.text)) throw new Error(`Type "${node.name.text}" is exported by both ${owners.get(node.name.text)} and ${file}`)
      owners.set(node.name.text, file)
    }
  })
}
const entry = join(out, 'index.d.ts')
const reexports = typeFiles.map((file) => `export type * from "./${file.slice(out.length + 1).replace(/\.d\.ts$/, '.js')}";`)
writeFileSync(entry, `${readFileSync(entry, 'utf8').trimEnd()}\n${reexports.join('\n')}\n`)

if (!existsSync(join(out, 'index.d.ts'))) throw new Error('dist-lib/types/index.d.ts was not generated')
console.log(`Types: ${files.length} declaration files, ${owners.size} data types re-exported; ${loosened} components accept undocumented pass-through props; strict: ${[...new Set(strict)].join(', ')}`)
