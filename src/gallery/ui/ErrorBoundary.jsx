import { Component } from 'react'

/** Keeps one broken variant from blanking the whole frame: shows the error where the preview would be. */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    this.props.onError?.(error)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="m-4 rounded-surface border border-danger bg-danger-soft p-4 text-sm">
        <p className="font-semibold">This preview failed to render.</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs">{String(this.state.error?.message ?? this.state.error)}</pre>
      </div>
    )
  }
}
