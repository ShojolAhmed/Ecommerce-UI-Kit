import { isValidElement } from 'react'
import { isMarker } from '../registry/markers.js'

const isPlain = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !isValidElement(value) &&
  (Array.isArray(value) || Object.getPrototypeOf(value) === Object.prototype)

/** Walks plain objects and arrays (not React elements), calling `visit(marker, path)` for every marker. */
function walk(value, path, visit) {
  if (isMarker(value)) return visit(value, path)
  if (Array.isArray(value)) return value.map((item, index) => walk(item, `${path}[${index}]`, visit))
  if (isPlain(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, walk(item, path ? `${path}.${key}` : key, visit)]),
    )
  }
  return value
}

/** Initial values of every `state()` marker, keyed by state name. */
export function collectInitialState(props) {
  const initial = {}
  walk(props, '', (marker) => {
    if (marker.kind === 'state') initial[marker.name] = marker.value
    return undefined
  })
  return initial
}

/** Short human text for the Events panel. Never serialises DOM events or React nodes. */
export function describeArgs(args) {
  const parts = []
  for (const arg of args) {
    if (arg == null) continue
    if (typeof arg === 'object' && ('nativeEvent' in arg || arg instanceof Event)) continue
    if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') parts.push(String(arg))
    else if (typeof arg === 'object' && !Array.isArray(arg) && (arg.name ?? arg.label ?? arg.title ?? arg.author ?? arg.id) != null) {
      parts.push(String(arg.name ?? arg.label ?? arg.title ?? arg.author ?? arg.id))
    } else {
      try {
        const text = JSON.stringify(arg)
        parts.push(text.length > 90 ? `${text.slice(0, 87)}…` : text)
      } catch {
        parts.push('[unserialisable]')
      }
    }
  }
  return parts.join(', ')
}

/**
 * Turns a props description (with markers) into real props.
 * `store` is `{ values, set(name, value), update(name, compute) }`; `log(label, detail)` records callbacks.
 */
export function resolveProps(props, store, log) {
  return walk(props, '', (marker, path) => {
    const label = path.replace(/\[\d+\]/g, '')
    switch (marker.kind) {
      case 'ref':
      case 'node':
        return marker.value
      case 'state':
        return store.values[marker.name]
      case 'fn':
        return (...args) => {
          log(label, describeArgs(args))
          return marker.value?.(...args)
        }
      case 'setter':
        return (...args) => {
          const fixed = 'to' in marker.extra
          store.set(marker.name, fixed ? marker.extra.to : args[0])
          log(label, fixed ? '' : describeArgs(args))
        }
      case 'update':
        return (...args) => {
          store.update(marker.name, (current) => marker.value(current, ...args))
          log(label, describeArgs(args))
        }
      default:
        return undefined
    }
  })
}
