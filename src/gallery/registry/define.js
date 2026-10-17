import { DefaultStage } from '../ui/DefaultStage.jsx'

/**
 * Registry format shared by every component family, whether its variants come from the
 * library's own registry (Navbar, ProductCard, Sidebar, Footer) or are prop presets
 * (HeroBanner `layout`, Breadcrumbs `maxItems`, ...).
 *
 * family = {
 *   id, name, category, summary,
 *   component, importName, extraImports?, reactImports?, source,   // what is previewed and where it lives
 *   variantProp?: 'variant',     // prop that selects the design; omit for prop presets
 *   baseProps?,                  // props shared by every variant (markers allowed, see markers.js)
 *   variants: [{ id, label, description?, props?, setup? }],
 *   Stage?,                      // optional wrapper component (controlled state, triggers, fake page)
 *   frame: { desktop, mobile, tablet?, padded?, filler?, stageClassName? },
 *   docs: { sections: [{ title, file, typedef?, note? }], shapes?: string[] },
 * }
 */

/**
 * Builds the variant list from a library registry object (`{ id: Component }`) so a design added
 * to the library appears in the gallery automatically. `info` supplies labels and notes;
 * a variant without an entry still shows up, labelled by its id.
 */
export function variantsFromRegistry(registry, info = {}, propsFor = () => ({})) {
  return Object.keys(registry).map((id) => ({
    id,
    label: info[id]?.label ?? id,
    description: info[id]?.description ?? '',
    setup: info[id]?.setup,
    props: propsFor(id),
  }))
}

export function defineFamily(definition) {
  const { baseProps = {}, variants, Stage = DefaultStage, frame = {}, ...rest } = definition
  return {
    ...rest,
    Stage,
    frame: { desktop: 560, mobile: 640, padded: true, ...frame },
    variants: variants.map((variant) => ({
      description: '',
      ...variant,
      // Merged once so the object identity is stable between renders.
      props: { ...baseProps, ...variant.props },
    })),
  }
}
