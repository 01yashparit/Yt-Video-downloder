import { useState, useEffect, useRef, useCallback } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { MetadataCard } from './components/MetadataCard';
import { StatusSection } from './components/StatusSection';
import { Toasts, type ToastItem } from './components/Toast';
import type { VideoMetadata, HealthResponse } from './types';
import { checkHealth, fetchVideoInfo, startDownload, getDownloadStatus } from './services/api';

type Theme = 'dark' | 'light';

export function App() {
  const [status, setStatus] = useState<
    'idle' | 'fetching' | 'ready' | 'downloading' | 'completed' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  // Download job tracking state
  const [jobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadSpeed, setDownloadSpeed] = useState<string>('');
  const [downloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [totalBytes, setTotalBytes] = useState<number>(0);
  const [savedFilename, setSavedFilename] = useState<string>('');

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* storage unavailable */
    }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const pollIntervalRef = useRef<number | null>(null);

  const toast = useCallback((kind: ToastItem['kind'], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  const verifyBackendHealth = () => {
    checkHealth()
      .then((res) => {
        setBackendHealth(res);
        setHealthError(null);
      })
      .catch((err: Error) => {
        setHealthError(
          `Cannot connect to the local backend engine (${err.message}). Make sure the FastAPI backend is running.`
        );
      });
  };

  useEffect(() => {
    verifyBackendHealth();
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleFetchInfo = async (url: string) => {
    setStatus('fetching');
    setErrorMessage(null);
    setMetadata(null);

    try {
      const data = await fetchVideoInfo(url);
      setMetadata(data);
      setStatus('ready');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch video information from YouTube.');
      setStatus('error');
    }
  };

  const handleStartDownload = async (formatId: string) => {
    if (!metadata) return;

    setStatus('downloading');
    setErrorMessage(null);
    setDownloadProgress(0);
    setDownloadSpeed('');
    setDownloadedBytes(0);
    setTotalBytes(0);
    setJobStatus('pending');

    try {
      const { job_id } = await startDownload(metadata.url, formatId);
      setCurrentJobId(job_id);

      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

      let pollFailures = 0;
      pollIntervalRef.current = window.setInterval(async () => {
        try {
          const statusRes = await getDownloadStatus(job_id);
          pollFailures = 0;
          setJobStatus(statusRes.status);
          // Never let the bar go backwards (the backend resets it between streams).
          setDownloadProgress((prev) => Math.max(prev, statusRes.progress_percentage || 0));
          setDownloadedBytes(statusRes.downloaded_bytes || 0);
          setTotalBytes(statusRes.total_bytes || 0);
          if (statusRes.speed) setDownloadSpeed(statusRes.speed);

          if (statusRes.status === 'completed') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setStatus('completed');
            setSavedFilename(statusRes.filename || 'Downloaded Media File');
            toast('success', 'Download complete');
          } else if (statusRes.status === 'failed') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setStatus('error');
            setErrorMessage(statusRes.error || 'Download failed during execution.');
          }
        } catch (pollErr) {
          pollFailures += 1;
          if (pollFailures < 5) return;
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStatus('error');
          setErrorMessage(
            `Error polling download status: ${pollErr instanceof Error ? pollErr.message : 'unknown error'}`
          );
        }
      }, 1000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to initiate download job.');
    }
  };

  const handleReset = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setStatus('idle');
    setErrorMessage(null);
    setMetadata(null);
    setCurrentJobId(null);
    setJobStatus('');
    setDownloadProgress(0);
    setDownloadSpeed('');
    setDownloadedBytes(0);
    setTotalBytes(0);
    setSavedFilename('');
  };

  const showCard = !!metadata && (status === 'ready' || status === 'downloading');

  return (
    <div className="flex min-h-dvh flex-col">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />

      <main className={`mx-auto w-full max-w-4xl flex-1 space-y-5 px-4 pt-6 sm:pb-10 ${showCard ? 'pb-32' : 'pb-10'}`}>
        {healthError && (
          <div role="alert" className="flex flex-col gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden="true" />
              <span className="break-words">{healthError}</span>
            </span>
            <button type="button" onClick={verifyBackendHealth} className="line min-h-11 shrink-0 rounded-xl px-4 font-medium active:scale-[.98]">
              Retry Connection
            </button>
          </div>
        )}

        {backendHealth && !backendHealth.ffmpeg_installed && (
          <div role="alert" className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <TriangleAlert className="size-4 text-amber-500" aria-hidden="true" /> FFmpeg Warning
            </p>
            <p className="muted mt-1">
              FFmpeg was not detected on your system. Downloading separate high-quality video and audio formats will rely on single-stream fallbacks until FFmpeg is installed and added to PATH.
            </p>
          </div>
        )}

        <section className="card space-y-4 p-5 sm:p-6">
          <div className="space-y-1">
            <h2 className="text-[clamp(1.5rem,5vw,2.25rem)] font-bold leading-tight tracking-tight">Download YouTube Media</h2>
            <p className="muted text-sm">
              Enter a valid YouTube video URL to inspect actual available video and audio qualities.
            </p>
          </div>
          <UrlInput onSubmit={handleFetchInfo} isLoading={status === 'fetching'} onToast={toast} />
        </section>

        {showCard && metadata && (
          <MetadataCard
            metadata={metadata}
            onStartDownload={handleStartDownload}
            isDownloading={status === 'downloading'}
            ffmpegInstalled={backendHealth?.ffmpeg_installed}
          />
        )}

        <StatusSection
          status={status}
          errorMessage={errorMessage}
          downloadProgress={downloadProgress}
          downloadSpeed={downloadSpeed}
          downloadedBytes={downloadedBytes}
          totalBytes={totalBytes}
          savedFilename={savedFilename}
          jobId={jobId}
          jobStatus={jobStatus}
          onReset={handleReset}
        />
      </main>

      {backendHealth && (
        <footer className="mx-auto flex w-full max-w-4xl flex-wrap justify-center gap-2 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] font-mono text-[11px]">
          <span className="line muted rounded-full px-3 py-1">
            Backend Engine: {backendHealth.service} (v{backendHealth.version})
          </span>
          <span className="line rounded-full px-3 py-1" style={{ color: backendHealth.ffmpeg_installed ? '#10b981' : '#f59e0b' }}>
            FFmpeg: {backendHealth.ffmpeg_installed ? 'Installed' : 'Not Found'}
          </span>
        </footer>
      )}

      <Toasts items={toasts} />
    </div>
  );
}

export default App;
