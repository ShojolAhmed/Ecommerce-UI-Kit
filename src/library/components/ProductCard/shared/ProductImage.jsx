import { useState } from 'react'
import { cn } from '../../../utils/cn.js'
import { ImageIcon } from './icons.jsx'

/**
 * Image frame with a graceful fallback. The caller sets the size and aspect
 * ratio (e.g. `aspect-[4/5]`), so the layout never shifts whether the image
 * loads, fails, or was never provided. Children render as overlays inside the frame.
 *
 * @param {object} props
 * @param {string|null} [props.src]
 * @param {string} [props.alt='']  Empty = decorative (the product name is announced next to it).
 * @param {boolean} [props.dimmed=false]  Fades the image (used for out-of-stock products).
 * @param {string} [props.imgClassName]
 */
export default function ProductImage({ src, alt = '', dimmed = false, className, imgClassName, children }) {
  // Remember which URL failed (rather than a boolean) so a new `src` gets a fresh attempt.
  const [failedSrc, setFailedSrc] = useState(null)
  const showImage = Boolean(src) && failedSrc !== src

  return (
    <div className={cn('relative overflow-hidden bg-surface-muted', className)}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
          className={cn('size-full object-cover', dimmed && 'opacity-60', imgClassName)}
        />
      ) : (
        <div
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          className="flex size-full items-center justify-center text-foreground-subtle"
        >
          <ImageIcon className="size-1/4 min-w-8 max-w-16" />
        </div>
      )}
      {children}
    </div>
  )
}
