import { useState } from 'react'
import { cn } from '../../utils/cn.js'

/**
 * Cover image with a quiet fallback. The caller sizes the frame (aspect ratio
 * or height), so layout never shifts when an image fails or is not provided.
 * Remembers the failing URL, so a new `src` gets a fresh attempt.
 *
 * @param {object} props
 * @param {string|null} [props.src]
 * @param {string} [props.alt='']   Empty = decorative.
 * @param {boolean} [props.eager=false]  Skip lazy loading (use for the hero).
 */
export default function MediaImage({ src, alt = '', eager = false, className, imgClassName, children }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const showImage = Boolean(src) && failedSrc !== src

  return (
    <div className={cn('relative overflow-hidden bg-surface-sunken', className)}>
      {showImage && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailedSrc(src)}
          className={cn('absolute inset-0 size-full object-cover', imgClassName)}
        />
      )}
      {children}
    </div>
  )
}
