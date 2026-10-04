import React, { useState } from 'react';
import { ArrowRight, ClipboardPaste, Link2, Loader2, X } from 'lucide-react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  onToast?: (kind: 'success' | 'error' | 'info', text: string) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading, onToast }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  // navigator.clipboard only exists on HTTPS/localhost, so it is missing on the LAN address.
  const canPaste = typeof navigator !== 'undefined' && !!navigator.clipboard?.readText;

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
    if (validateUrl(url)) onSubmit(url.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text.trim());
      setError(null);
    } catch {
      onToast?.('error', 'Could not read the clipboard. Long-press the field to paste.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="muted pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2" aria-hidden="true" />
          <input
            type="url"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste YouTube video URL here"
            disabled={isLoading}
            aria-label="YouTube video URL"
            aria-invalid={!!error}
            className="line solid min-h-12 w-full rounded-xl py-3 pl-12 pr-14 text-base outline-none transition focus:ring-2 focus:ring-orange-400/50 disabled:opacity-60"
            style={error ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,.2)' } : undefined}
          />
          {!isLoading && (url || canPaste) && (
            <button
              type="button"
              onClick={url ? () => setUrl('') : handlePaste}
              aria-label={url ? 'Clear URL' : 'Paste from clipboard'}
              className="muted absolute right-1.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg transition active:scale-90"
            >
              {url ? <X className="size-5" aria-hidden="true" /> : <ClipboardPaste className="size-5" aria-hidden="true" />}
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 to-orange-500 px-6 font-semibold text-white shadow-lg shadow-red-600/20 transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <span>Fetch Info</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      {error && (
        <p role="alert" className="pl-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </form>
  );
};
