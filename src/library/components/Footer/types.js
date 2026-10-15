/**
 * Shared Footer contract. Every variant accepts exactly these props, so
 * switching designs only means changing `variant`. A variant simply ignores
 * what it does not show (see the table in the README).
 *
 * @typedef {object} FooterBrand
 * @property {string} name              Store name: the wordmark, and the link's accessible name when `logo` is set.
 * @property {string} [href='/']
 * @property {React.ReactNode} [logo]   Replaces the text wordmark.
 * @property {string} [description]     One or two sentences about the store.
 *
 * @typedef {object} FooterLink
 * @property {string} [id]
 * @property {string} label
 * @property {string} href
 * @property {boolean} [external]       Opens in a new tab and says so to screen readers.
 *
 * @typedef {object} FooterColumn
 * @property {string} [id]
 * @property {string} title
 * @property {FooterLink[]} links
 *
 * @typedef {object} FooterSocial
 * @property {string} [id]
 * @property {'instagram'|'facebook'|'x'|'youtube'} [platform]  Picks a built-in icon and the default label.
 * @property {React.ReactNode} [icon]   Custom icon (wins over `platform`).
 * @property {string} [label]           Accessible name, e.g. "Instagram". Defaults from `platform`.
 * @property {string} href
 *
 * @typedef {object} FooterNewsletter   Used by `newsletter` and `dark`. Omit it to hide the signup.
 * @property {string} [title]
 * @property {string} [description]
 * @property {React.ReactNode} [consent]  Consent checkbox label (makes it required).
 * @property {(values: { email: string, consent?: boolean }, event) => void | Promise<void>} [onSubscribe]
 * @property {object} [labels]            See NewsletterForm `labels`.
 *
 * @typedef {object} FooterProps
 * @property {FooterBrand} brand
 * @property {FooterColumn[]} [columns]     Link groups. Shown by every variant except `simple`.
 * @property {FooterLink[]} [links]         Flat links for `simple`. Falls back to the first 6 links of `columns`.
 * @property {FooterSocial[]} [social]
 * @property {FooterNewsletter} [newsletter]
 * @property {FooterLink[]} [legalLinks]    Privacy, terms, ... shown in the bottom bar.
 * @property {string|false} [copyright]     Defaults to "© {year} {brand.name}. All rights reserved." `false` hides it.
 * @property {React.ReactNode} [bottomSlot] Extra node in the bottom bar (currency or language picker, payment icons).
 * @property {(item, event) => void} [onNavigate]  Called for every link click. Call `event.preventDefault()` to route client-side.
 * @property {2|3|4} [headingLevel=2]       Level of column and newsletter titles.
 * @property {'sm'|'default'|'wide'} [containerSize]
 * @property {object} [labels]              `navigation`, `legal`, `social`, `opensInNewTab`.
 * @property {string} [navLabel]            Shorthand for `labels.navigation` (make it unique if a page has several footers).
 * @property {string} [className]
 */

export {}
