import { isValidElement } from 'react'
import { isMarker } from '../registry/markers.js'
import { formatValue } from './formatValue.js'

const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1)
const setterName = (name) => `set${capitalise(name)}`

/** Collects what the snippet must declare: sample data, state and handler names. */
function scan(value, found) {
  if (isMarker(value)) {
    if (value.kind === 'ref' && !found.refs.has(value.name)) found.refs.set(value.name, value.value)
    if (value.kind === 'state' && !found.state.has(value.name)) found.state.set(value.name, value.value)
    if (value.kind === 'update') found.handlers.add(value.extra.identifier)
    if (value.kind === 'fn') found.handlers.add(value.name)
    return
  }
  if (Array.isArray(value)) value.forEach((item) => scan(item, found))
  else if (value && typeof value === 'object' && !isValidElement(value)) Object.values(value).forEach((item) => scan(item, found))
}

/** Prints a prop value that may contain markers as an expression. */
function expression(value) {
  if (isMarker(value)) {
    switch (value.kind) {
      case 'setter':
        return 'to' in value.extra ? `() => ${setterName(value.name)}(${formatValue(value.extra.to)})` : setterName(value.name)
      case 'update':
        return value.extra.identifier
      default:
        return value.name // ref, node, state and fn print their name or literal code
    }
  }
  if (Array.isArray(value)) return `[${value.map(expression).join(', ')}]`
  if (value && typeof value === 'object' && !isValidElement(value)) {
    return `{ ${Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .map(([name, item]) => `${name}: ${expression(item)}`)
      .join(', ')} }`
  }
  return formatValue(value)
}

function attribute(name, value) {
  if (value === undefined) return null
  if (value === true) return name
  if (typeof value === 'string' && !value.includes('"') && !value.includes('\n')) return `${name}="${value}"`
  return `${name}={${expression(value)}}`
}

/**
 * Builds the usage example for one variant from the same props description the preview renders.
 * Returns `{ setup, jsx, code }`.
 */
export function buildUsage({ family, variant, props }) {
  const all = { ...(family.variantProp ? { [family.variantProp]: variant.id } : {}), ...props }
  const found = { refs: new Map(), state: new Map(), handlers: new Set() }
  scan(props, found)

  const { children, ...rest } = all
  const attrs = Object.entries(rest).map(([name, value]) => attribute(name, value)).filter(Boolean)
  const tag = family.importName
  const opening = attrs.length ? `<${tag}\n${attrs.map((line) => `  ${line}`).join('\n')}\n` : `<${tag}`
  let jsx
  if (children !== undefined) {
    const inner = isMarker(children) ? children.name : typeof children === 'string' ? children : '…'
    jsx = `${opening}>\n  ${inner}\n</${tag}>`
  } else {
    jsx = attrs.length ? `${opening}/>` : `<${tag} />`
  }

  const imports = [`import { ${[tag, ...(family.extraImports ?? [])].join(', ')} } from './library'`]
  const reactNames = [...(family.reactImports ?? []), ...(found.state.size ? ['useState'] : [])].sort()
  if (reactNames.length) imports.unshift(`import { ${reactNames.join(', ')} } from 'react'`)

  const parts = []
  if (found.refs.size) {
    parts.push(
      `// Sample data (abbreviated; the props tables list every field)\n${[...found.refs]
        .map(([name, value]) => `const ${name} = ${formatValue(value)}`)
        .join('\n')}`,
    )
  }
  if (found.state.size) {
    parts.push(
      `// Your page owns this state; the component only reports changes\n${[...found.state]
        .map(([name, initial]) => `const [${name}, ${setterName(name)}] = useState(${formatValue(initial)})`)
        .join('\n')}`,
    )
  }
  if (variant.setup) parts.push(variant.setup)
  if (found.handlers.size) parts.push(`// You implement: ${[...found.handlers].join(', ')}`)

  const setup = parts.join('\n\n')
  return { setup, jsx, code: [imports.join('\n'), setup, jsx].filter(Boolean).join('\n\n') }
}
