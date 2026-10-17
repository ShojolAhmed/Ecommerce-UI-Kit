import { parseComponentProps, parseTypedefs } from './parseDocs.js'

// Lazy: a file's source is only fetched when its family's Props tab opens.
const sources = import.meta.glob('../../library/**/*.{js,jsx}', { query: '?raw', import: 'default' })

const cache = new Map()

/** `import('../shared/types.js').Action` reads better as `Action`. */
const tidyType = (type) => type.replace(/import\([^)]*\)\./g, '')
const tidy = (props) => props?.map((prop) => ({ ...prop, type: tidyType(prop.type) }))

async function readSource(file) {
  const key = `../../library/${file}`
  const loader = sources[key]
  if (!loader) throw new Error(`No library file at src/library/${file}`)
  if (!cache.has(key)) cache.set(key, loader())
  return cache.get(key)
}

/**
 * Loads a family's documentation from the library's JSDoc.
 * `docs` is `{ sections: [{ title, file, typedef?, note? }], shapes?: string[] }`.
 * A section with `typedef` reads that `@typedef`; without it, the component's own `@param` block.
 * `shapes` lists `types.js` files whose other typedefs are shown as data shapes.
 */
export async function loadDocs(docs) {
  const used = new Set()
  const sections = []
  for (const section of docs.sections) {
    const source = await readSource(section.file)
    let props = null
    let description = ''
    if (section.typedef) {
      const typedef = parseTypedefs(source).get(section.typedef)
      if (typedef) {
        props = typedef.props
        description = typedef.description
        used.add(`${section.file}#${section.typedef}`)
      }
    } else {
      props = parseComponentProps(source)
    }
    sections.push({ title: section.title, note: section.note ?? description, props: tidy(props), source: section.file, missing: !props })
  }

  const shapes = []
  for (const file of docs.shapes ?? []) {
    const source = await readSource(file)
    for (const typedef of parseTypedefs(source).values()) {
      if (used.has(`${file}#${typedef.name}`)) continue
      if (typedef.extras || /Props$/.test(typedef.name)) continue
      shapes.push({ ...typedef, props: tidy(typedef.props), alias: typedef.alias && tidyType(typedef.alias), source: file })
    }
  }
  return { sections, shapes }
}
