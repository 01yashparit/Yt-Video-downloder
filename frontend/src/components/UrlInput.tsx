import React, { useState } from 'react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setError('Please enter a YouTube video URL');
      return false;
    }

    try {
      const parsedUrl = new URL(value.trim());
      const validHosts = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'];
      if (!validHosts.includes(parsedUrl.hostname.toLowerCase())) {
        setError('Please enter a valid YouTube domain URL (e.g. youtube.com or youtu.be)');
        return false;
      }
    } catch {
      setError('Please enter a valid URL');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(url)) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste YouTube video URL here (e.g. https://www.youtube.com/watch?v=...)"
            disabled={isLoading}
            className="w-full bg-neutral-900 border border-neutral-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-neutral-100 rounded-xl px-4 py-3.5 text-sm sm:text-base placeholder-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed outline-none"
            aria-label="YouTube video URL"
          />
          {url && !isLoading && (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 text-xs bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded-md transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base shrink-0 shadow-lg shadow-red-600/20 active:scale-98"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <span>Fetch Info</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-400 pl-1 flex items-center space-x-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </form>
  );
};
