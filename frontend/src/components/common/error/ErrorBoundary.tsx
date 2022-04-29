import React, { Component } from 'react';
import { ErrorBoundaryProps, ErrorBoundaryState } from 'types/errorBoundary';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    // @TODO: Log error here
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div>
          <p>We&apos;re sorry — something went wrong.</p>
          <p>Our team has been notified.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
