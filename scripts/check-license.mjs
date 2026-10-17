// Blocks publishing while LICENSE is still the placeholder (wired into `prepublishOnly`).
import { readFileSync } from 'node:fs'

const text = readFileSync(new URL('../LICENSE', import.meta.url), 'utf8')
if (text.includes('LICENSE PLACEHOLDER')) {
  console.error('Refusing to publish: LICENSE is still the placeholder. The owner must choose a license (see LICENSE).')
  process.exit(1)
}
console.log('LICENSE is not the placeholder.')
