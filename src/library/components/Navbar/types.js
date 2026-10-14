/**
 * Shared Navbar contract. Every variant accepts exactly these props, so
 * switching designs only means changing `variant`.
 *
 * @typedef {object} NavbarBrand
 * @property {string} name            Store name. Used as the wordmark and as the link's accessible name.
 * @property {string} [href='/']
 * @property {React.ReactNode} [logo] Replaces the text wordmark (e.g. an <img> or <svg>).
 *
 * @typedef {object} NavbarMenuLink
 * @property {string} label
 * @property {string} href
 * @property {string} [badge]         Short label such as "New".
 *
 * @typedef {object} NavbarMenu       Mega menu content (used by the `mega` variant, and as an accordion on mobile).
 * @property {{ title: string, links: NavbarMenuLink[] }[]} columns
 * @property {{ title: string, description?: string, href: string, image?: string, imageAlt?: string, cta?: string }} [featured]
 *
 * @typedef {object} NavbarLink
 * @property {string} [id]            Stable key. Falls back to href, then label.
 * @property {string} label
 * @property {string} [href]          Always provide one, even with `menu`, so simpler variants can link to it.
 * @property {boolean} [current]      Marks the active page (aria-current="page").
 * @property {string} [badge]
 * @property {NavbarMenu} [menu]
 *
 * @typedef {object} NavbarSearch
 * @property {string} [placeholder='Search products']
 * @property {string} [label='Search']        Accessible name of the field.
 * @property {string} [defaultValue]
 * @property {(query: string, event: React.FormEvent) => void} [onSubmit]  When set, the form does not navigate.
 * @property {string} [action]                Native GET target used when `onSubmit` is not set.
 *
 * @typedef {object} NavbarAction     Account, wishlist and cart share this shape.
 * @property {string} [label]         Accessible name. Defaults to "Account" / "Wishlist" / "Cart".
 * @property {string} [href]          Renders a link when set, otherwise a button.
 * @property {(event: React.MouseEvent) => void} [onClick]
 * @property {number} [count]         Shown as a badge when above zero (wishlist and cart).
 *
 * @typedef {object} NavbarProps
 * @property {NavbarBrand} brand
 * @property {NavbarLink[]} [links=[]]
 * @property {NavbarSearch|boolean} [search]   Omit or `false` to hide. `true` renders a field with defaults.
 * @property {NavbarAction|boolean} [account]  Omit or `false` to hide.
 * @property {NavbarAction|boolean} [wishlist]
 * @property {NavbarAction|boolean} [cart]
 * @property {(item: object, event: React.MouseEvent) => void} [onNavigate]  Called for every link click. Call `event.preventDefault()` to route client-side.
 * @property {React.ReactNode} [endSlot]       Extra content after the actions (currency picker, locale, …). Desktop only.
 * @property {{ search?, account?, wishlist?, cart?, menu?, close?, chevron? }} [icons]  Replace any built-in icon with your own element.
 * @property {string} [navLabel='Main']        Accessible name of the primary <nav>. Make it unique if several navbars share a page.
 * @property {'narrow'|'default'|'wide'|'full'} [containerSize='default']
 * @property {boolean} [sticky=false]
 * @property {string} [className]
 */

export {}
