import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Terjadi kesalahan pada komponen.' }
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-3">
          Terjadi kesalahan saat memuat pemindai. {this.state.message}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
