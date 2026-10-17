import { isValidElement } from 'react'

const quote = (text) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
const key = (name) => (/^[A-Za-z_$][\w$]*$/.test(name) ? name : quote(name))

/**
 * Prints a plain value as JavaScript source, abbreviated: long strings are cut,
 * only the first `maxItems` entries of a list are shown (the rest become a comment)
 * and deep nesting collapses. Used for the sample data in usage examples.
 */
export function formatValue(value, { maxItems = 2, maxDepth = 3, indent = 0, depth = 0 } = {}) {
  const pad = '  '.repeat(indent)
  const inner = '  '.repeat(indent + 1)
  const next = { maxItems, maxDepth, indent: indent + 1, depth: depth + 1 }

  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return quote(value.length > 72 ? `${value.slice(0, 71)}…` : value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'function') return '() => {}'
  if (isValidElement(value)) return '<… />'

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    if (depth >= maxDepth) return '[…]'
    const shown = value.slice(0, maxItems).map((item) => formatValue(item, next))
    const hidden = value.length - shown.length
    const flat = `[${shown.join(', ')}]`
    if (hidden === 0 && flat.length <= 64 && !flat.includes('\n')) return flat
    const lines = shown.map((item) => `${inner}${item},`)
    if (hidden > 0) lines.push(`${inner}// …${hidden} more`)
    return `[\n${lines.join('\n')}\n${pad}]`
  }

  const entries = Object.entries(value).filter(([, item]) => item !== undefined)
  if (entries.length === 0) return '{}'
  if (depth >= maxDepth) return '{ … }'
  const parts = entries.map(([name, item]) => `${key(name)}: ${formatValue(item, next)}`)
  const flat = `{ ${parts.join(', ')} }`
  if (flat.length <= 64 && !flat.includes('\n')) return flat
  return `{\n${parts.map((part) => `${inner}${part},`).join('\n')}\n${pad}}`
}
