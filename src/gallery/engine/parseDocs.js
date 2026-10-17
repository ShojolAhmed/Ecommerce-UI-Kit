/**
 * Reads prop documentation straight from the library's JSDoc, so the gallery's
 * tables cannot drift from the code. Two shapes are supported:
 *   - `@typedef {object} Name` + `@property` lines (the `types.js` contracts)
 *   - `@param {type} [props.name=default] description` on a component's doc block
 */

const stripStars = (line) => line.replace(/^\s*\*\s?/, '')

/** Returns the text inside the first balanced `open`..`close` pair starting at `start`, and the index after it. */
function balanced(text, start, open, close) {
  if (text[start] !== open) return null
  let depth = 0
  let quote = null
  for (let index = start; index < text.length; index += 1) {
    const char = text[index]
    if (quote) {
      if (char === quote) quote = null
      continue
    }
    if (char === "'" || char === '"' || char === '`') quote = char
    else if (char === open) depth += 1
    else if (char === close) {
      depth -= 1
      if (depth === 0) return { inner: text.slice(start + 1, index), end: index + 1 }
    }
  }
  return null
}

/** Splits on commas that are not nested inside (), [], {} or <>. */
function splitTopLevel(text) {
  const parts = []
  let depth = 0
  let quote = null
  let current = ''
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (quote) {
      current += char
      if (char === quote) quote = null
      continue
    }
    if (char === "'" || char === '"' || char === '`') quote = char
    if ('([{<'.includes(char) && !(char === '<' && text[index - 1] === '=')) depth += 1
    if (')]}>'.includes(char) && !(char === '>' && text[index - 1] === '=')) depth -= 1
    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
    } else current += char
  }
  if (current.trim()) parts.push(current)
  return parts.map((part) => part.trim()).filter(Boolean)
}

const collapse = (text) => text.replace(/\s+/g, ' ').trim()

/** Splits one doc block into tags: [{ tag, text }], joining continuation lines. */
function readTags(blockBody) {
  const tags = []
  for (const raw of blockBody.split('\n')) {
    const line = stripStars(raw)
    const trimmed = line.trim()
    if (trimmed.startsWith('@')) {
      const match = trimmed.match(/^@(\w+)\s*(.*)$/)
      tags.push({ tag: match[1], text: match[2] })
    } else if (tags.length && trimmed) {
      tags[tags.length - 1].text += `\n${trimmed}`
    }
  }
  return tags
}

/** Splits `{type} rest` into `{ type, rest }`. */
function takeType(text) {
  const trimmed = text.trimStart()
  const found = balanced(trimmed, 0, '{', '}')
  if (!found) return { type: '', rest: trimmed }
  return { type: collapse(found.inner), rest: trimmed.slice(found.end).trim() }
}

/** Parses `[props.name='x']`, `[name]`, `props.name` or `name`, then the description. */
function takeName(text) {
  const trimmed = text.trimStart()
  let nameText
  let rest
  let optional = false
  if (trimmed.startsWith('[')) {
    const found = balanced(trimmed, 0, '[', ']')
    if (!found) return { name: trimmed.split(/\s+/)[0], optional, defaultValue: undefined, description: '' }
    nameText = found.inner
    rest = trimmed.slice(found.end)
    optional = true
  } else {
    const match = trimmed.match(/^(\S+)\s*([\s\S]*)$/)
    nameText = match?.[1] ?? ''
    rest = match?.[2] ?? ''
  }
  const equals = nameText.indexOf('=')
  const rawName = equals === -1 ? nameText : nameText.slice(0, equals)
  const defaultValue = equals === -1 ? undefined : nameText.slice(equals + 1)
  const name = rawName.replace(/^props\./, '').replace(/^props$/, '')
  return { name, optional, defaultValue, description: collapse(rest.replace(/^[-–]\s*/, '')) }
}

/** `name?: type` members of an object type literal. */
function parseMembers(objectBody) {
  return splitTopLevel(objectBody).map((member) => {
    const match = member.match(/^([\w$]+)(\?)?\s*:\s*([\s\S]*)$/)
    if (!match) return { name: collapse(member), type: '', optional: true, description: '' }
    return { name: match[1], optional: Boolean(match[2]), type: collapse(match[3]), description: '' }
  })
}

/** For `A & { ... }` types returns the members of the trailing object literal; otherwise null. */
function trailingObjectMembers(type) {
  const index = type.indexOf('& {')
  if (index === -1) return null
  const found = balanced(type, index + 2, '{', '}')
  return found ? parseMembers(found.inner) : null
}

function propFromTag({ text }) {
  const { type, rest } = takeType(text)
  const { name, optional, defaultValue, description } = takeName(rest)
  return { name, type, optional, default: defaultValue, description }
}

const blockRegex = /\/\*\*([\s\S]*?)\*\//g

function* blocks(source) {
  for (const match of source.matchAll(blockRegex)) {
    yield { body: match[1], end: match.index + match[0].length }
  }
}

/** All `@typedef`s in a file: Map name -> { description, props, alias, extras }. */
export function parseTypedefs(source) {
  const result = new Map()
  for (const block of blocks(source)) {
    let current = null
    for (const tag of readTags(block.body)) {
      if (tag.tag === 'typedef') {
        const { type, rest } = takeType(tag.text)
        const [name, ...words] = rest.split(/\s+/)
        const description = collapse(words.join(' '))
        const objectLike = type === 'object' || type === 'Object'
        const extras = objectLike ? null : trailingObjectMembers(type)
        current = { name, description, props: extras ?? [], alias: objectLike || extras ? null : type, extras: Boolean(extras) }
        result.set(name, current)
      } else if (tag.tag === 'property' && current) {
        current.props.push(propFromTag(tag))
      }
    }
  }
  return result
}

/** Props documented with `@param` on the doc block right before `export default function`. */
export function parseComponentProps(source) {
  for (const block of blocks(source)) {
    const after = source.slice(block.end, block.end + 80)
    if (!/^\s*export\s+default\s+function/.test(after)) continue
    const props = []
    for (const tag of readTags(block.body)) {
      if (tag.tag !== 'param') continue
      const { type, rest } = takeType(tag.text)
      const named = rest.trimStart().startsWith('props.') || rest.trimStart().startsWith('[props.')
      if (!named) {
        const members = trailingObjectMembers(type)
        if (members) props.push(...members)
        continue
      }
      props.push(propFromTag(tag))
    }
    return props
  }
  return null
}
