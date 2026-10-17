/** Renders the component with its resolved props. Families override this when they need more. */
export function DefaultStage({ Component, props }) {
  return <Component {...props} />
}
