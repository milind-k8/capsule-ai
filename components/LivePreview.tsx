import React, { useState, useEffect, ReactNode, Component } from 'react';
import { transformCode, executeCode } from '../utils/previewUtils';
import { Loader2, AlertTriangle } from 'lucide-react';

interface LivePreviewProps {
  code: string;
}

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    try {
      setError(null);
      // 1. Transform TSX -> JS
      const jsCode = transformCode(code);
      // 2. Execute and get Component
      const Comp = executeCode(jsCode);
      if (Comp) {
        setComponent(() => Comp);
      } else {
        setError("No default export found in the generated code.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to render component");
    }
  }, [code]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-red-400 bg-red-950/20 rounded-lg border border-red-900/50">
        <AlertTriangle className="w-10 h-10 mb-4 opacity-80" />
        <h3 className="text-lg font-semibold mb-2">Preview Error</h3>
        <pre className="text-xs bg-black/40 p-4 rounded border border-red-900/30 w-full overflow-auto max-h-[200px] text-red-300">
          {error}
        </pre>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-500" />
        <p>Compiling preview...</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full overflow-auto bg-zinc-950 rounded-lg shadow-sm border border-zinc-800 relative"
      style={{ contain: 'paint' }}
    >
      <ErrorBoundary fallback={(err) => (
         <div className="p-8 text-red-400">
           <h3 className="font-bold">Runtime Error</h3>
           <pre className="text-xs mt-2 bg-red-950/20 p-2 rounded">{err.message}</pre>
         </div>
      )}>
        <Component />
      </ErrorBoundary>
    </div>
  );
};