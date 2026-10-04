import React, { useState } from 'react';
import { CircleCheck, Link2, Loader2, Save, TriangleAlert } from 'lucide-react';
import { getDownloadFileUrl } from '../services/api';
import { formatBytes } from '../utils/format';

interface StatusSectionProps {
  status: 'idle' | 'fetching' | 'ready' | 'downloading' | 'completed' | 'error';
  errorMessage?: string | null;
  downloadProgress?: number;
  downloadSpeed?: string;
  downloadedBytes?: number;
  totalBytes?: number;
  savedFilename?: string;
  jobId?: string | null;
  jobStatus?: string;
  onReset?: () => void;
}

type PickerHandle = {
  createWritable(): Promise<{ write(data: Uint8Array): Promise<void>; close(): Promise<void> }>;
};
type PickerWindow = Window & {
  showSaveFilePicker?: (o: { suggestedName?: string }) => Promise<PickerHandle>;
};

export const StatusSection: React.FC<StatusSectionProps> = ({
  status,
  errorMessage,
  downloadProgress = 0,
  downloadSpeed,
  downloadedBytes = 0,
  totalBytes = 0,
  savedFilename = '',
  jobId,
  jobStatus,
  onReset,
}) => {
  const [saving, setSaving] = useState(false);
  const [savePct, setSavePct] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  const handleSave = async () => {
    if (!jobId) return;
    setSaveError(null);
    const url = getDownloadFileUrl(jobId);
    const picker = (window as PickerWindow).showSaveFilePicker;
    if (picker) {
      try {
        // Must be the first await so the browser still sees the user's click.
        const handle = await picker.call(window, { suggestedName: savedFilename });
        setSaving(true);
        const res = await fetch(url);
        if (!res.ok || !res.body) throw new Error(`Could not fetch the file (${res.status}).`);
        const total = Number(res.headers.get('Content-Length')) || 0;
        const writable = await handle.createWritable();
        const reader = res.body.getReader();
        let got = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          await writable.write(value);
          got += value.length;
          if (total) setSavePct(Math.round((got / total) * 100));
        }
        await writable.close();
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          setSaveError(err instanceof Error ? err.message : 'Saving failed.');
        }
      } finally {
        setSaving(false);
        setSavePct(null);
      }
      return;
    }
    setUsedFallback(true);
    const a = document.createElement('a');
    a.href = url;
    a.download = savedFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (status === 'idle') {
    return (
      <div className="rise rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: 'var(--line)' }}>
        <div className="line muted mx-auto grid size-12 place-items-center rounded-full">
          <Link2 className="size-6" aria-hidden="true" />
        </div>
        <h3 className="mt-3 text-base font-medium">No URL Entered</h3>
        <p className="muted mx-auto mt-1 max-w-sm text-sm">
          Paste a YouTube video link above and click <b>Fetch Info</b> to view available download qualities.
        </p>
      </div>
    );
  }

  if (status === 'fetching') {
    return (
      <div className="card space-y-4 p-5" aria-busy="true" aria-label="Loading video information">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="aspect-video w-full animate-pulse rounded-xl bg-white/10 md:w-64" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-4/5 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
          </div>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2">
          <div className="h-16 animate-pulse rounded-xl bg-white/10" />
          <div className="h-16 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    );
  }

  if (status === 'error' && errorMessage) {
    return (
      <div role="alert" className="rise space-y-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-red-500" aria-hidden="true" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold">Action Failed</h4>
            <p className="muted mt-1 break-words text-sm">{errorMessage}</p>
          </div>
        </div>
        {onReset && (
          <button type="button" onClick={onReset} className="line min-h-11 w-full rounded-xl px-4 text-sm font-medium active:scale-[.98] sm:w-auto">
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (status === 'downloading') {
    const pct = Math.min(100, Math.max(0, downloadProgress));
    return (
      <div className="card rise space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="size-2.5 animate-pulse rounded-full bg-emerald-500" />
            {jobStatus === 'processing' ? 'Finishing up…' : 'Downloading…'}
          </span>
          <span className="font-mono text-sm font-semibold text-emerald-500">{pct.toFixed(0)}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          className="line h-2.5 w-full overflow-hidden rounded-full"
        >
          <div className="h-full rounded-full bg-linear-to-r from-emerald-500 to-lime-400 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <div className="muted flex flex-wrap justify-between gap-x-4 font-mono text-xs">
          {totalBytes > 0 && <span>{formatBytes(downloadedBytes)} / {formatBytes(totalBytes)}</span>}
          {downloadSpeed && <span>{downloadSpeed}</span>}
        </div>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="rise space-y-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
        <div className="flex items-start gap-3">
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold">Your file is ready</h4>
            <p className="muted mt-1 text-sm">A copy also stays in the downloads folder on the computer running the backend.</p>
            {savedFilename && <p className="line solid mt-2 break-all rounded-lg px-3 py-1.5 font-mono text-xs">{savedFilename}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !jobId}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 to-orange-500 px-6 font-semibold text-white transition active:scale-[.98] disabled:opacity-60"
        >
          {saving ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Save className="size-5" aria-hidden="true" />}
          <span>{saving ? (savePct !== null ? `Saving… ${savePct}%` : 'Saving…') : 'Save to…'}</span>
        </button>
        {saveError && (
          <p role="alert" className="text-sm text-red-400">
            {saveError} <button type="button" onClick={handleSave} className="underline">Retry</button>
          </p>
        )}
        {usedFallback && (
          <p className="muted text-xs">
            To choose a folder each time: browser Settings &gt; Downloads &gt; turn on “Ask where to save each file before downloading”.
          </p>
        )}
        {onReset && (
          <button type="button" onClick={onReset} className="line min-h-11 w-full rounded-xl px-4 text-sm font-medium active:scale-[.98]">
            Download another
          </button>
        )}
      </div>
    );
  }

  return null;
};
