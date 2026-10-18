// Local placeholder artwork so the storefront needs no network and no binary assets.
// Replace `placeholderImage(...)` calls in data/products.js, data/categories.js and data/promotions.js with real
// URLs when real photography exists; every consumer only needs a string `src`.

const escapeXml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * @param {object} options
 * @param {string} options.label   Text drawn on the image.
 * @param {number} options.hue     0-360, base colour.
 * @param {number} [options.width=800]
 * @param {number} [options.height=1000]
 * @param {boolean} [options.showLabel=true]  Draw the label (turn off where the page already shows the name).
 * @returns {string} a data: URI usable as an <img> src.
 */
export function placeholderImage({ label, hue, width = 800, height = 1000, showLabel = true }) {
  const short = Math.min(width, height)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="hsl(${hue} 28% 86%)"/>
<circle cx="${width * 0.68}" cy="${height * 0.4}" r="${short * 0.3}" fill="hsl(${hue} 32% 74%)"/>
<rect x="${width * 0.12}" y="${height * 0.52}" width="${width * 0.34}" height="${height * 0.2}" rx="${short * 0.02}" fill="hsl(${(hue + 18) % 360} 30% 62%)"/>
${showLabel ? `<text x="${width * 0.08}" y="${height * 0.93}" font-family="Georgia, serif" font-size="${short * 0.06}" fill="hsl(${hue} 35% 22%)">${escapeXml(label)}</text>` : ''}
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
