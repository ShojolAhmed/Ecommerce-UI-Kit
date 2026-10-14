import { cn } from '../../library/utils/cn.js'

// Class names are written out in full so Tailwind can detect them.
const colorGroups = [
  {
    title: 'Surfaces & text',
    items: [
      ['background', 'bg-background'],
      ['surface', 'bg-surface'],
      ['surface-muted', 'bg-surface-muted'],
      ['surface-sunken', 'bg-surface-sunken'],
      ['border', 'bg-border'],
      ['border-strong', 'bg-border-strong'],
      ['foreground', 'bg-foreground'],
      ['foreground-muted', 'bg-foreground-muted'],
      ['foreground-subtle', 'bg-foreground-subtle'],
      ['ring', 'bg-ring'],
    ],
  },
  {
    title: 'Actions',
    items: [
      ['primary', 'bg-primary'],
      ['primary-hover', 'bg-primary-hover'],
      ['primary-active', 'bg-primary-active'],
      ['secondary', 'bg-secondary'],
      ['secondary-hover', 'bg-secondary-hover'],
      ['danger', 'bg-danger'],
      ['danger-hover', 'bg-danger-hover'],
    ],
  },
  {
    title: 'Status',
    items: [
      ['success', 'bg-success'],
      ['success-soft', 'bg-success-soft'],
      ['warning', 'bg-warning'],
      ['warning-soft', 'bg-warning-soft'],
      ['danger-soft', 'bg-danger-soft'],
      ['info', 'bg-info'],
      ['info-soft', 'bg-info-soft'],
    ],
  },
]

const textSizes = [
  ['text-xs', 'text-xs'],
  ['text-sm', 'text-sm'],
  ['text-base', 'text-base'],
  ['text-lg', 'text-lg'],
  ['text-xl', 'text-xl'],
  ['text-2xl', 'text-2xl'],
  ['text-3xl', 'text-3xl'],
  ['text-4xl', 'text-4xl'],
]

const radii = [
  ['sm', 'rounded-sm'],
  ['md', 'rounded-md'],
  ['lg', 'rounded-lg'],
  ['xl', 'rounded-xl'],
  ['2xl', 'rounded-2xl'],
  ['control', 'rounded-control'],
  ['surface', 'rounded-surface'],
  ['full', 'rounded-full'],
]

const shadows = [
  ['xs', 'shadow-xs'],
  ['sm', 'shadow-sm'],
  ['md', 'shadow-md'],
  ['lg', 'shadow-lg'],
  ['xl', 'shadow-xl'],
]

const breakpoints = [
  ['xs', '30rem (480px)'],
  ['sm', '40rem (640px)'],
  ['md', '48rem (768px)'],
  ['lg', '64rem (1024px)'],
  ['xl', '80rem (1280px)'],
  ['2xl', '96rem (1536px)'],
]

function Colors() {
  return (
    <div className="space-y-6">
      {colorGroups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-2 text-sm font-medium text-foreground-muted">{group.title}</h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {group.items.map(([name, cls]) => (
              <li key={name} className="flex items-center gap-2">
                <span className={cn('size-8 shrink-0 rounded-md border border-border', cls)} />
                <span className="font-mono text-xs">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Typography() {
  return (
    <div className="space-y-2">
      {textSizes.map(([name, cls]) => (
        <p key={name} className="flex items-baseline gap-4">
          <span className="w-20 shrink-0 font-mono text-xs text-foreground-muted">{name}</span>
          <span className={cls}>The quick brown fox jumps over the lazy dog</span>
        </p>
      ))}
    </div>
  )
}

function Spacing() {
  return (
    <div className="space-y-3">
      {[
        ['gutter', 'w-gutter', 'clamp(1rem, 4vw, 2rem) — page side padding (px-gutter)'],
        ['section', 'w-section', 'clamp(3rem, 8vw, 6rem) — vertical rhythm (py-section)'],
        ['4 (base × 4)', 'w-4', '1rem'],
        ['8 (base × 8)', 'w-8', '2rem'],
      ].map(([name, cls, note]) => (
        <div key={name} className="flex items-center gap-4">
          <span className="w-28 shrink-0 font-mono text-xs text-foreground-muted">{name}</span>
          <span className={cn('h-4 rounded-sm bg-primary', cls)} />
          <span className="text-xs text-foreground-muted">{note}</span>
        </div>
      ))}
    </div>
  )
}

function Radius() {
  return (
    <ul className="flex flex-wrap gap-4">
      {radii.map(([name, cls]) => (
        <li key={name} className="flex flex-col items-center gap-2">
          <span className={cn('size-16 border border-border-strong bg-surface-muted', cls)} />
          <span className="font-mono text-xs">{name}</span>
        </li>
      ))}
    </ul>
  )
}

function Shadow() {
  return (
    <ul className="flex flex-wrap gap-6 p-2">
      {shadows.map(([name, cls]) => (
        <li key={name} className="flex flex-col items-center gap-2">
          <span className={cn('size-20 rounded-surface bg-surface', cls)} />
          <span className="font-mono text-xs">{name}</span>
        </li>
      ))}
    </ul>
  )
}

function Breakpoints() {
  return (
    <div className="space-y-3">
      <p className="text-sm">
        Active breakpoint:{' '}
        <strong className="font-mono">
          <span className="xs:hidden">base</span>
          <span className="hidden xs:inline sm:hidden">xs</span>
          <span className="hidden sm:inline md:hidden">sm</span>
          <span className="hidden md:inline lg:hidden">md</span>
          <span className="hidden lg:inline xl:hidden">lg</span>
          <span className="hidden xl:inline 2xl:hidden">xl</span>
          <span className="hidden 2xl:inline">2xl</span>
        </strong>
      </p>
      <ul className="grid gap-1 font-mono text-xs sm:grid-cols-2 lg:grid-cols-3">
        {breakpoints.map(([name, value]) => (
          <li key={name}>
            <span className="inline-block w-10 text-foreground-muted">{name}</span>
            {value}
          </li>
        ))}
      </ul>
    </div>
  )
}

const sections = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadow: Shadow,
  breakpoints: Breakpoints,
}

export default function TokenShowcase({ section }) {
  const Section = sections[section]
  return Section ? <Section /> : null
}
