import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CHEOPS ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 z-50 bg-[#004e98] flex items-center justify-center p-4 font-sans select-none text-white">
          <div className="max-w-md w-full bg-[#ece9d8] border-3 border-[#0055ea] shadow-2xl rounded-t-lg rounded-b-xs overflow-hidden text-black">
            {/* Titre XP Luna */}
            <div className="bg-gradient-to-r from-[#0055ea] via-[#215dc6] to-[#0055ea] px-3 py-1.5 flex items-center justify-between text-white font-bold text-xs shadow-xs">
              <div className="flex items-center gap-1.5">
                <span>⚠️</span>
                <span>CHEOPS-OS — Exception Non Gérée</span>
              </div>
            </div>

            {/* Corps */}
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 border border-red-400 flex items-center justify-center text-red-600 shrink-0 text-xl font-bold">
                  ✕
                </div>
                <div>
                  <h3 className="font-bold text-sm text-red-700">
                    Arrêt de protection du poste de travail
                  </h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    Le sous-système de télémesure administrative a intercepté une interruption de trame.
                  </p>
                  {this.state.error && (
                    <div className="mt-2 p-2 bg-slate-900 text-[#00ff66] font-mono text-[11px] rounded-xs max-h-24 overflow-y-auto">
                      {this.state.error.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#9c9a91] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="xp-btn flex items-center gap-1.5 px-4 py-1 text-xs font-bold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Réinitialiser la session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
