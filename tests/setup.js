import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  document.body.removeAttribute('style') // a failed test must not leave the scroll lock behind
})
