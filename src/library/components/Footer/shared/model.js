export const defaultFooterLabels = {
  navigation: 'Footer',
  legal: 'Legal',
  social: 'Social media',
  opensInNewTab: '(opens in a new tab)',
}

export const socialPlatformNames = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X',
  youtube: 'YouTube',
}

export function resolveLabels(labels, navLabel) {
  return { ...defaultFooterLabels, ...(navLabel ? { navigation: navLabel } : null), ...labels }
}

/** `false` hides it; a string is used as is; otherwise "© {year} {name}. All rights reserved." */
export function resolveCopyright(copyright, brand) {
  if (copyright === false) return null
  if (typeof copyright === 'string') return copyright
  return `© ${new Date().getFullYear()} ${brand?.name ?? ''}. All rights reserved.`.replace('  ', ' ')
}

/** Keeps entries that can render: links need a label and an href. */
export const validLinks = (links = []) => links.filter((link) => link && link.label && link.href)

export const linkKey = (link) => link.id ?? `${link.href}|${link.label}`

/** Links for the `simple` footer: the flat `links` prop, else the first few links of the columns. */
export function simpleLinks(links, columns, max = 6) {
  if (links?.length) return validLinks(links)
  return validLinks((columns ?? []).flatMap((column) => column.links ?? [])).slice(0, max)
}
