import React from "react";
import { IoWarning } from "react-icons/io5";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 text-center">
          <IoWarning className="text-red-500 mb-4" size={64} />
          <h1 className="text-2xl font-bold mb-2">System Critical Failure</h1>
          <p className="text-slate-400 mb-6 max-w-md">
            Aethel-Nexus encountered an unexpected error.
            <br />
            <span className="text-xs font-mono bg-slate-900 p-2 rounded mt-4 block text-red-300 border border-red-900/50">
              {this.state.error?.toString()}
            </span>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/20"
          >
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;