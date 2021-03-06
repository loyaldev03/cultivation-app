import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info)
    if (typeof Rollbar !== 'undefined') {
      Rollbar.error('Something went wrong', error)
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p className="bg-red white">Error!</p>
    }

    return this.props.children
  }
}

export { ErrorBoundary }
