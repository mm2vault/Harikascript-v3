import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('HarikaScript render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#08060f] text-slate-100 flex items-center justify-center p-6">
          <section className="w-full max-w-lg rounded-2xl border border-purple-500/30 bg-[#120d20] p-6 text-center shadow-2xl">
            <h1 className="text-2xl font-bold text-purple-300">HarikaScript yüklenemedi</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Sayfa beklenmeyen bir hatayla karşılaştı. Verilerin silinmedi. Sayfayı yenilemeyi deneyebilirsin.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-500"
            >
              Sayfayı yenile
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
