import { Component, type ReactNode } from 'react';
export default class WorldBoundary extends Component<
  { children: ReactNode; onFallback: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="fallback-message">
        <p>The world couldn’t start on this device.</p>
        <button onClick={this.props.onFallback}>
          Open the readable portfolio →
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
