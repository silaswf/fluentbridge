import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Copy, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  stack: string;
  copied: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
    stack: '',
    copied: false,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      message: error?.message || 'Erro inesperado na renderização.',
      stack: error?.stack || '',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FluentBridge ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleCopyDetails = async () => {
    const payload = `FluentBridge Error\nMessage: ${this.state.message}\n\n${this.state.stack}`;
    try {
      await navigator.clipboard.writeText(payload);
      this.setState({ copied: true });
      window.setTimeout(() => this.setState({ copied: false }), 2500);
    } catch {
      // Ignore clipboard failures
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="safe-top safe-bottom flex min-h-screen items-center justify-center bg-[#F7F9FC] p-4">
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-6 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-xl font-extrabold text-slate-900">
            Ops! Algo saiu do esperado
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Seus dados e progresso continuam salvos com segurança. Recarregue a plataforma para continuar estudando.
          </p>
          {this.state.message && (
            <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700">
              {this.state.message}
            </p>
          )}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Recarregar plataforma</span>
            </button>
            <button
              type="button"
              onClick={() => void this.handleCopyDetails()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{this.state.copied ? 'Copiado!' : 'Copiar erro'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
