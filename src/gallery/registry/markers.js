/**
 * Markers describe a prop once and serve two consumers:
 *   - the preview frame resolves them into real values and working handlers, and
 *   - the usage generator prints them as the code a developer would write.
 * That keeps the snippet and the preview from drifting apart.
 */
class Marker {
  constructor(kind, name, value, extra) {
    this.kind = kind
    this.name = name
    this.value = value
    this.extra = extra
  }
}

export const isMarker = (value) => value instanceof Marker

/** Sample data. Previewed as `value`, printed as the variable `name`. */
export const ref = (name, value) => new Marker('ref', name, value)

/**
 * A callback the gallery logs. Printed as `{name}`; you implement it.
 * `impl`, when given, runs too and its return value is passed back (e.g. a promise for a signup form).
 */
export const fn = (name, impl) => new Marker('fn', name, impl)

/** Page-owned state. Previewed with a live value, printed as `const [name, setName] = useState(initial)`. */
export const state = (name, initial) => new Marker('state', name, initial)

/** Callback that stores its first argument in state `name` (or `options.to` when given). */
export const setter = (name, options = {}) => new Marker('setter', name, undefined, options)

/** Callback that updates state `name` with `reducer(current, ...args)`. Printed as `{identifier}`. */
export const update = (name, reducer, identifier) => new Marker('update', name, reducer, { identifier })

/** A React node or value the stage supplies. Previewed as `value`, printed as the literal `code`. */
export const node = (code, value) => new Marker('node', code, value)
