import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md px-6 py-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600/20 p-2 rounded-lg border border-red-500/30 text-red-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-100">
              YouTube Downloader
            </h1>
            <p className="text-xs text-neutral-400">Local Media Downloader</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400 bg-neutral-800/80 px-3 py-1.5 rounded-full border border-neutral-700/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Local Engine</span>
        </div>
      </div>
    </header>
  );
};
