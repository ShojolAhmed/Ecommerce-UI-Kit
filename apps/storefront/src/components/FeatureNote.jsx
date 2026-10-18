/**
 * Marks the part of a page that a later feature owns. Delete it when the feature lands.
 * @param {object} props
 * @param {string} props.owner  Short feature name, e.g. "Checkout".
 * @param {string} props.file   Where the feature should be built, e.g. "src/pages/CheckoutPage.jsx".
 */
export default function FeatureNote({ owner, file, children }) {
  return (
    <aside className="feature-note" aria-label={`${owner} feature note`}>
      <p>
        <strong>{owner}</strong> is not built yet. Build it in <code>{file}</code>.
      </p>
      {children && <p>{children}</p>}
    </aside>
  )
}
