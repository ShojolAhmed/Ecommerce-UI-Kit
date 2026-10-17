import { useRef } from 'react'
import { Button, FilterButton, productCardLayouts, productGridColumns, countActiveFilters } from '../../library/index.js'
import { cn } from '../../library/utils/cn.js'
import { productCases, sampleFilterGroups } from '../data/index.js'
import { useStage } from '../engine/useStage.js'
import { ref, state } from './markers.js'

/**
 * Stages wrap a family's component with whatever a real page would provide around it
 * (state, a trigger button, a list parent). They never change the component or its props.
 * Each receives `{ Component, variant, props, store, description, log }`.
 */

/** Placeholder page content, so a sticky header and a fixed bottom bar have something to sit over. */
export function FakePage() {
  return (
    <div className="space-y-4 p-6 pb-20 md:pb-6" aria-hidden="true">
      <div className="h-8 w-1/3 rounded bg-surface-sunken" />
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="h-24 rounded-surface bg-surface-muted" />
      ))}
    </div>
  )
}

/** Four data states of one card design. Each case owns its own wishlist state, like a real card list would. */
function CardCase({ Component, variant, description, product, log }) {
  const { props } = useStage(
    { ...description, product: ref('product', product), isWishlisted: state('wishlisted', product.id === 1001) },
    log,
  )
  return <Component variant={variant.id} {...props} />
}

export function ProductCardStage({ Component, variant, description, log }) {
  const layout = productCardLayouts[variant.id]
  const columns = variant.id === 'horizontal' ? layout.columns : productGridColumns[4]
  return (
    <div className={cn('grid', columns, layout?.gap)}>
      {productCases.map(({ id, product }) => (
        <CardCase key={id} Component={Component} variant={variant} description={description} product={product} log={log} />
      ))}
    </div>
  )
}

/** Sidebars fill their container; only `collapsible` sizes itself. */
export function SidebarStage({ Component, variant, props }) {
  return (
    <div className={cn(variant.id !== 'collapsible' && 'w-full md:w-64')}>
      <Component {...props} />
    </div>
  )
}

/**
 * Overlays start open and portal into the frame. The trigger is what a real page would render:
 * it reopens the overlay, and its ref lets focus return there on close.
 */
export function FilterDrawerStage({ Component, props, store }) {
  const triggerRef = useRef(null)
  return (
    <div className="space-y-3">
      <FilterButton
        ref={triggerRef}
        open={props.open}
        activeCount={countActiveFilters(sampleFilterGroups, props.filters)}
        onClick={() => store.set('open', true)}
      />
      <Component {...props} triggerRef={triggerRef} />
    </div>
  )
}

export function CartDrawerStage({ Component, props, store }) {
  const triggerRef = useRef(null)
  return (
    <div className="space-y-3">
      <Button ref={triggerRef} variant="outline" onClick={() => store.set('open', true)}>
        Open cart
      </Button>
      <Component {...props} triggerRef={triggerRef} />
    </div>
  )
}

export function ConfirmDialogStage({ Component, props, store }) {
  const triggerRef = useRef(null)
  return (
    <div>
      <Button ref={triggerRef} variant="danger" onClick={() => store.set('open', true)}>
        Open dialog
      </Button>
      <Component {...props} triggerRef={triggerRef} />
    </div>
  )
}

export function ListStage({ Component, props }) {
  return (
    <ul className="divide-y divide-border rounded-surface border border-border bg-surface px-4">
      <Component {...props} />
    </ul>
  )
}

export function BorderedStage({ Component, props }) {
  return (
    <div className="rounded-surface border border-border bg-surface">
      <Component {...props} />
    </div>
  )
}
