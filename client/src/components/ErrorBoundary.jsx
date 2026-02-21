import React from "react";
import { IoWarning, IoCopyOutline } from "react-icons/io5";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("System Crash:", error, errorInfo);
  }

  handleCopy = () => {
    const errorLog = `Error: ${this.state.error?.toString()}\n\nStack Trace:\n${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorLog);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 text-center">
          <IoWarning className="text-red-500 mb-4 animate-pulse" size={64} />
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">System Critical Failure</h1>
          <p className="text-slate-400 mb-6 max-w-lg">
            Aethel-Nexus encountered an unexpected error.
          </p>

          <div className="relative bg-slate-900 border border-red-900/50 p-4 rounded-xl max-w-2xl w-full mb-8 text-left overflow-hidden shadow-2xl">
             <button 
                onClick={this.handleCopy}
                className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors flex items-center gap-2 text-xs"
             >
                <IoCopyOutline /> {this.state.copied ? "Copied!" : "Copy Log"}
             </button>
             <p className="text-red-400 font-bold mb-2 text-sm">{this.state.error?.toString()}</p>
             <pre className="text-xs text-slate-500 overflow-auto max-h-48 custom-scrollbar">
                {this.state.errorInfo?.componentStack}
             </pre>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(79,70,229,0.4)]"
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