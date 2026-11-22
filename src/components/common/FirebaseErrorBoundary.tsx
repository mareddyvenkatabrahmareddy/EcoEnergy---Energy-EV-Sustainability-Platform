import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import firebaseConfig from '../../../firebase-applet-config.json';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  isQuotaError: boolean;
}

export class FirebaseErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      isQuotaError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const raw = error?.message || 'Unexpected application error';
    const isQuotaError = raw.includes('Quota exceeded');
    let formatted = raw;
    try {
      const parsed = JSON.parse(raw) as { error?: string; operationType?: string; path?: string };
      if (parsed.error) {
        formatted = `${parsed.operationType || 'operation'} on ${parsed.path || 'firestore'}: ${parsed.error}`;
      }
    } catch {
      // plain string error
    }
    return {
      hasError: true,
      errorMessage: formatted,
      isQuotaError,
    };
  }

  render() {
    if (this.state.hasError) {
      const upgradeUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data?openUpgradeDialog=true`;
      return (
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#0A0A0A] border border-red-500/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h2 className="font-heading text-lg font-bold text-white">
                {this.state.isQuotaError
                  ? 'Firestore Daily Quota Exceeded'
                  : 'Database Synchronization Error'}
              </h2>
            </div>
            <p className="text-xs text-[#AAB8C5] leading-relaxed break-words">
              {this.state.errorMessage}
            </p>
            {this.state.isQuotaError && (
              <p className="text-xs text-[#6EE7B7]">
                Free tier daily quota resets tomorrow. You can inspect usage or upgrade here:{' '}
                <a
                  href={upgradeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-[#00E5A0]"
                >
                  Open Firebase Console
                </a>
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00C781] hover:bg-[#00E5A0] text-black text-xs font-bold rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
