import { useState } from 'react'
import { Button, ProductGrid, productCardVariants } from '../../library/index.js'
import { sampleProducts } from '../sampleData.js'
import DemoStatus from './DemoStatus.jsx'
import { useProductDemo } from './useProductDemo.js'

const columnOptions = [
  { id: undefined, label: 'Auto' },
  { id: 2, label: '2' },
  { id: 3, label: '3' },
  { id: 4, label: '4' },
]

function Switcher({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1">
      <span aria-hidden="true" className="mr-1 text-sm text-foreground-muted">
        {label}
      </span>
      {options.map(({ id, label: optionLabel }) => (
        <Button
          key={optionLabel}
          size="sm"
          variant={value === id ? 'primary' : 'outline'}
          aria-pressed={value === id}
          onClick={() => onChange(id)}
        >
          {optionLabel}
        </Button>
      ))}
    </div>
  )
}

const variantOptions = Object.keys(productCardVariants).map((id) => ({ id, label: id }))

/** Playground: one ProductGrid, switch the card variant and column count without touching the data. */
function InteractiveGrid() {
  const [variant, setVariant] = useState('minimal')
  const [columns, setColumns] = useState(undefined)
  const { wishlistedIds, addingIds, cartCount, lastEvent, handlers } = useProductDemo({ initialWishlist: [1005] })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <Switcher label="Card variant" options={variantOptions} value={variant} onChange={setVariant} />
        <Switcher label="Columns" options={columnOptions} value={columns} onChange={setColumns} />
      </div>
      <ProductGrid
        label="Demo products"
        products={sampleProducts}
        variant={variant}
        columns={columns}
        wishlistedIds={wishlistedIds}
        addingToCartIds={addingIds}
        {...handlers}
      />
      <DemoStatus lastEvent={lastEvent} cartCount={cartCount} />
    </div>
  )
}

/** No products (or none with a valid id and name): the built-in empty state, and a custom one. */
function EmptyGrids() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ProductGrid products={[]} />
      <ProductGrid
        products={[]}
        emptyState={
          <div className="rounded-surface bg-surface-muted p-8 text-center">
            <p className="font-medium">No matches for “wool socks”</p>
            <p className="mt-1 text-sm text-foreground-muted">Try a broader search or clear your filters.</p>
          </div>
        }
      />
    </div>
  )
}

export default function ProductGridDemo({ mode }) {
  return mode === 'empty' ? <EmptyGrids /> : <InteractiveGrid />
}
