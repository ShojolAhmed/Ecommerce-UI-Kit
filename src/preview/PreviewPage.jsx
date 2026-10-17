import { useEffect, useState } from 'react'
import { Button, Container } from '../library/index.js'
import { families } from './registry.jsx'

const themes = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

/** Preview-only: the library itself just reads `data-theme` on <html>. */
function ThemeSwitcher() {
  const [theme, setTheme] = useState('system')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div role="group" aria-label="Theme" className="flex gap-1">
      {themes.map(({ id, label }) => (
        <Button
          key={id}
          size="sm"
          variant={theme === id ? 'primary' : 'outline'}
          aria-pressed={theme === id}
          onClick={() => setTheme(id)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div>
            <h1 className="text-2xl font-bold">Ecom UI Kit</h1>
            <p className="text-sm text-foreground-muted">Component preview</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#/gallery" className="text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              Open the component gallery
            </a>
            <a href="#/home" className="text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              Open the demo homepage
            </a>
            <ThemeSwitcher />
          </div>
        </Container>
      </header>

      <Container as="main" className="space-y-12 py-8">
        {families.map((family) => (
          <section key={family.id} aria-labelledby={family.id}>
            <h2 id={family.id} className="mb-6 text-xl font-semibold">
              {family.name}
            </h2>
            <div className="space-y-8">
              {family.variants.map((variant) => (
                <div key={variant}>
                  <p className="mb-3 inline-block rounded bg-surface-sunken px-2 py-0.5 font-mono text-xs">
                    variant: {variant}
                  </p>
                  {family.render(variant)}
                </div>
              ))}
            </div>
          </section>
        ))}
      </Container>
    </div>
  )
}
