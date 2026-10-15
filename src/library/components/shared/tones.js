/**
 * Surface tones for sections that can sit on a colored band
 * (AnnouncementBar, PromoBanner, NewsletterSignup).
 *
 * - `root`       classes for the surface itself
 * - `theme`      `dark` re-themes the whole subtree through data-theme="dark", so every
 *                semantic token (buttons, inputs, muted text) flips with it. It stays dark
 *                even when the page is light.
 * - `cta`        Button variant that stays visible on this surface
 * - `quietCta`   classes for a quiet (outline) button on this surface. They use the
 *                important modifier on purpose: they replace the Button's own colors.
 */
export const toneStyles = {
  default: { root: 'bg-background text-foreground', cta: 'primary', quietCta: '' },
  muted: { root: 'bg-surface-muted text-foreground', cta: 'primary', quietCta: '' },
  accent: { root: 'bg-warning-soft text-warning-soft-foreground', cta: 'primary', quietCta: '' },
  primary: {
    root: 'bg-primary text-primary-foreground',
    cta: 'secondary',
    quietCta: 'text-current! border-current! hover:bg-current/15! active:bg-current/25! focus-visible:outline-current!',
  },
  dark: { root: 'bg-background text-foreground', theme: 'dark', cta: 'primary', quietCta: '' },
}

export const getTone = (tone, fallback = 'default') => toneStyles[tone] ?? toneStyles[fallback]
