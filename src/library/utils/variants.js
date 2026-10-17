/**
 * Variant registry helper shared by the families that have interchangeable designs
 * (Navbar, ProductCard, Sidebar, Footer). It only maps a `variant` name to a component:
 * it knows nothing about props, state or business rules, so those stay in each family's shared code.
 *
 * - `variants` is the canonical list: `{ name: Component }`. Docs, the gallery and `names` use only these.
 * - `aliases` are extra accepted spellings that point at a canonical name (`{ megaMenu: 'mega' }`).
 * - A missing variant (`undefined` / `null`) silently means the default.
 * - An unknown variant falls back to the default and, in development, warns once per value.
 */
const warned = new Set()

export function createVariantRegistry({ name, variants, defaultVariant, aliases = {} }) {
  const names = Object.keys(variants)

  if (import.meta.env?.DEV) {
    if (!Object.hasOwn(variants, defaultVariant)) {
      console.warn(`[${name}] Default variant "${defaultVariant}" is not registered.`)
    }
    for (const [alias, target] of Object.entries(aliases)) {
      if (!Object.hasOwn(variants, target) || Object.hasOwn(variants, alias)) {
        console.warn(`[${name}] Alias "${alias}" must point at a registered variant and not shadow one.`)
      }
    }
  }

  /** Canonical variant name for whatever the caller passed. */
  function resolveId(requested) {
    if (requested == null) return defaultVariant
    // hasOwn, not `in` / indexing: "constructor" or "toString" must not count as variants.
    if (typeof requested === 'string' && Object.hasOwn(variants, requested)) return requested
    if (typeof requested === 'string' && Object.hasOwn(aliases, requested)) return aliases[requested]

    if (import.meta.env?.DEV) {
      const key = `${name}:${String(requested)}`
      if (!warned.has(key)) {
        warned.add(key)
        const extra = Object.keys(aliases)
        console.warn(
          `[${name}] Unknown variant ${JSON.stringify(requested)}. Falling back to "${defaultVariant}". ` +
            `Available: ${names.join(', ')}${extra.length ? ` (also accepted: ${extra.join(', ')})` : ''}`,
        )
      }
    }
    return defaultVariant
  }

  return Object.freeze({
    name,
    variants,
    defaultVariant,
    aliases,
    names,
    resolveId,
    /** The component to render for `requested`. Never undefined. */
    resolve: (requested) => variants[resolveId(requested)],
  })
}
