import React from 'react';

interface StatusSectionProps {
  status: 'idle' | 'fetching' | 'ready' | 'downloading' | 'completed' | 'error';
  errorMessage?: string | null;
  downloadProgress?: number;
  downloadSpeed?: string;
  downloadedBytes?: number;
  totalBytes?: number;
  savedFilename?: string;
  onReset?: () => void;
}

export const StatusSection: React.FC<StatusSectionProps> = ({
  status,
  errorMessage,
  downloadProgress = 0,
  downloadSpeed,
  savedFilename,
  onReset,
}) => {
  if (status === 'idle') {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-neutral-800/80 text-neutral-400 flex items-center justify-center mx-auto border border-neutral-700/50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h3 className="text-base font-medium text-neutral-200">No URL Entered</h3>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          Paste a YouTube video link above and click <span className="text-neutral-300 font-medium">Fetch Info</span> to view available download qualities.
        </p>
      </div>
    );
  }

  if (status === 'error' && errorMessage) {
    return (
      <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-6 text-neutral-200 space-y-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-red-900/40 rounded-lg text-red-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-semibold text-red-300">Action Failed</h4>
            <p className="text-xs text-red-200/80 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
        {onReset && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onReset}
              className="text-xs text-red-300 hover:text-red-100 bg-red-900/30 hover:bg-red-900/50 px-3 py-1.5 rounded-lg border border-red-800/40 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }

  if (status === 'downloading') {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-neutral-200">Downloading Media...</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            {downloadProgress.toFixed(0)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-950 rounded-full h-2.5 overflow-hidden border border-neutral-800">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, downloadProgress))}%` }}
          />
        </div>

        {downloadSpeed && (
          <div className="flex justify-between text-xs text-neutral-400 font-mono">
            <span>Speed: {downloadSpeed}</span>
            <span>Downloading to local folder</span>
          </div>
        )}
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-6 text-neutral-200 space-y-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-emerald-900/40 rounded-lg text-emerald-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-semibold text-emerald-300">Download Complete</h4>
            <p className="text-xs text-emerald-200/80">
              Media successfully saved to your local downloads folder.
            </p>
            {savedFilename && (
              <p className="text-xs font-mono bg-neutral-900/80 text-emerald-400 px-3 py-1.5 rounded-lg border border-neutral-800 mt-2 inline-block">
                {savedFilename}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
