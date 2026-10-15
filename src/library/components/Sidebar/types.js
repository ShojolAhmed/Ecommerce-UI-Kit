/**
 * Shared Sidebar contract (also used by FilterDrawer, ActiveFilters and SortDropdown).
 * Every sidebar variant accepts exactly these props, so switching designs only
 * means changing `variant`. The minimal variant is category-only and ignores
 * the filter props.
 *
 * Nothing here is stored by the components: the page owns the active category,
 * the filter values and the sort, and passes them back in.
 *
 * @typedef {object} Category
 * @property {string|number} id
 * @property {string} label
 * @property {number} [count]          Product count, shown beside the label.
 * @property {string} [href]           Makes the row a real link. Without it the row is a button.
 * @property {Category[]} [children]   Shown while the category or one of its descendants is active.
 *
 * @typedef {object} FilterOption
 * @property {string|number|boolean} value   Compared with strict equality, so keep types consistent.
 * @property {string} label
 * @property {number} [count]
 * @property {boolean} [disabled]
 *
 * @typedef {object} FilterGroup
 * @property {string} id                      Key in the `filters` object.
 * @property {string} label
 * @property {'checkbox'|'radio'|'range'} [type='checkbox']  checkbox = many options, radio = one, range = min/max numbers.
 * @property {FilterOption[]} [options]       checkbox and radio groups.
 * @property {number} [visibleOptions=6]      Checkbox groups longer than this get "Show more". Selected options always stay visible.
 * @property {boolean} [defaultOpen=true]     Initial state of the group when the sidebar uses accordions (collapsible sidebar, drawer).
 * @property {number} [min]                   Range groups: lowest allowed value (also the placeholder; entries are clamped to it).
 * @property {number} [max]                   Range groups: highest allowed value.
 * @property {number} [step]                  Range groups: step of the number inputs.
 * @property {string} [currency]              Range groups: ISO 4217 code used to format the chip, e.g. 'USD'.
 * @property {(amount: number) => string} [format]  Range groups: replaces the built-in number formatting.
 *
 * @typedef {Record<string, any>} FilterState
 *   Keyed by group id: checkbox -> array of option values, radio -> one option value,
 *   range -> `{ min?: number, max?: number }`. Absent key = nothing selected.
 *
 * @typedef {object} SidebarProps
 * @property {Category[]} [categories=[]]
 * @property {string|number|null} [activeCategory=null]   Controlled. `null` highlights the "All" row.
 * @property {(id: string|number|null, category: Category|null, event: React.MouseEvent) => void} [onCategoryChange]
 *   Called with `null` for the "All" row. Links navigate unless you call `event.preventDefault()`.
 * @property {FilterGroup[]} [filterGroups=[]]
 * @property {FilterState} [filters={}]                    Controlled.
 * @property {(next: FilterState) => void} [onFiltersChange]  Receives the complete next filter object.
 * @property {() => void} [onClearAll]                     Defaults to `onFiltersChange({})`. Provide it to also reset search, page, etc.
 * @property {SidebarLabels} [labels]
 * @property {string} [ariaLabel]                          Accessible name of the sidebar landmark. Defaults to the "Filters" label.
 * @property {2|3|4|5} [headingLevel=2]                    Level of the sidebar title. Sections inside use the next level.
 * @property {string} [className]
 *
 * @typedef {object} SidebarLabels   Every visible or announced string, so stores can localise.
 * @property {string} [filters='Filters']
 * @property {string} [categories='Categories']
 * @property {string|null} [allCategories='All products']   `null` hides the "All" row.
 * @property {string} [clearAll='Clear all']
 * @property {string} [clear='Clear']                       Per-group clear button.
 * @property {(groupLabel: string) => string} [clearGroup]  Accessible name of the per-group clear button.
 * @property {string} [min='Min']
 * @property {string} [max='Max']
 * @property {string} [showMore='Show more']
 * @property {string} [showLess='Show less']
 * @property {(count: number) => string} [itemCount]        Screen-reader text after a count.
 * @property {string} [expandFilters='Expand filters']      Collapsible variant.
 * @property {string} [collapseFilters='Collapse filters']  Collapsible variant.
 * @property {(count: number) => string} [activeCount]      Collapsible variant: announced with the collapsed toggle.
 *
 * @typedef {SidebarProps & {
 *   collapsed?: boolean,
 *   defaultCollapsed?: boolean,
 *   onCollapsedChange?: (collapsed: boolean) => void,
 *   width?: string,
 *   collapsedWidth?: string,
 * }} CollapsibleSidebarProps   Extra props of the `collapsible` variant.
 */

export {}
