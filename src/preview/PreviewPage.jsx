import { families } from './registry.jsx'

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-2xl font-bold">Ecom UI Kit</h1>
          <p className="text-sm text-slate-500">Component preview</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-8">
        {families.map((family) => (
          <section key={family.id} aria-labelledby={family.id}>
            <h2 id={family.id} className="mb-6 text-xl font-semibold">
              {family.name}
            </h2>
            <div className="space-y-8">
              {family.variants.map((variant) => (
                <div key={variant}>
                  <p className="mb-3 inline-block rounded bg-slate-200 px-2 py-0.5 font-mono text-xs">
                    variant: {variant}
                  </p>
                  {family.render(variant)}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
