import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { MetadataCard } from './components/MetadataCard';
import { StatusSection } from './components/StatusSection';
import type { VideoMetadata, HealthResponse } from './types';
import { checkHealth, fetchVideoInfo, startDownload, getDownloadStatus } from './services/api';

export function App() {
  const [status, setStatus] = useState<
    'idle' | 'fetching' | 'ready' | 'downloading' | 'completed' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  // Download Job tracking state
  const [, setCurrentJobId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadSpeed, setDownloadSpeed] = useState<string>('');
  const [savedFilename, setSavedFilename] = useState<string>('');

  const pollIntervalRef = useRef<number | null>(null);

  const verifyBackendHealth = () => {
    checkHealth()
      .then((res) => {
        setBackendHealth(res);
        setHealthError(null);
      })
      .catch((err) => {
        setHealthError(
          `Cannot connect to local backend engine (${err.message}). Ensure FastAPI backend is running on http://127.0.0.1:8000`
        );
      });
  };

  useEffect(() => {
    verifyBackendHealth();
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
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
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch video information from YouTube.');
      setStatus('error');
    }
  };

  const handleStartDownload = async (formatId: string) => {
    if (!metadata) return;

    setStatus('downloading');
    setErrorMessage(null);
    setDownloadProgress(0);
    setDownloadSpeed('');

    try {
      const { job_id } = await startDownload(metadata.url, formatId);
      setCurrentJobId(job_id);

      // Poll status every 1 second
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

      pollIntervalRef.current = window.setInterval(async () => {
        try {
          const statusRes = await getDownloadStatus(job_id);
          setDownloadProgress(statusRes.progress_percentage || 0);
          if (statusRes.speed) setDownloadSpeed(statusRes.speed);

          if (statusRes.status === 'completed') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setStatus('completed');
            setSavedFilename(statusRes.filename || 'Downloaded Media File');
          } else if (statusRes.status === 'failed') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setStatus('error');
            setErrorMessage(statusRes.error || 'Download failed during execution.');
          }
        } catch (pollErr: any) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStatus('error');
          setErrorMessage(`Error polling download status: ${pollErr.message}`);
        }
      }, 1000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to initiate download job.');
    }
  };

  const handleReset = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setStatus('idle');
    setErrorMessage(null);
    setMetadata(null);
    setCurrentJobId(null);
    setDownloadProgress(0);
    setDownloadSpeed('');
    setSavedFilename('');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Backend health alert banner if disconnected */}
        {healthError && (
          <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-4 text-xs text-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-amber-400">⚠️</span>
              <span>{healthError}</span>
            </div>
            <button
              onClick={verifyBackendHealth}
              className="text-amber-400 hover:underline shrink-0 font-medium ml-2"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* FFmpeg Missing Warning Banner if FFmpeg is absent on host */}
        {backendHealth && !backendHealth.ffmpeg_installed && (
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 text-xs text-amber-200 space-y-1">
            <div className="font-semibold flex items-center space-x-1 text-amber-300">
              <span>⚠️ FFmpeg Warning</span>
            </div>
            <p>
              FFmpeg was not detected on your system. Downloading separate high-quality video and audio formats will rely on single-stream fallbacks until FFmpeg is installed and added to PATH.
            </p>
          </div>
        )}

        {/* URL Input Form */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-neutral-100">Download YouTube Media</h2>
            <p className="text-xs text-neutral-400">
              Enter a valid YouTube video URL to inspect actual available video and audio qualities.
            </p>
          </div>

          <UrlInput onSubmit={handleFetchInfo} isLoading={status === 'fetching'} />
        </div>

        {/* Video Preview & Format Selection */}
        {metadata && (status === 'ready' || status === 'downloading') && (
          <MetadataCard
            metadata={metadata}
            onStartDownload={handleStartDownload}
            isDownloading={status === 'downloading'}
          />
        )}

        {/* Status / Error / Download progress section */}
        <StatusSection
          status={status}
          errorMessage={errorMessage}
          downloadProgress={downloadProgress}
          downloadSpeed={downloadSpeed}
          savedFilename={savedFilename}
          onReset={handleReset}
        />

        {/* Backend Status Footer Badge */}
        {backendHealth && (
          <div className="text-center pt-4">
            <span className="text-[11px] font-mono text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
              Backend Engine: {backendHealth.service} (v{backendHealth.version}) | FFmpeg: {backendHealth.ffmpeg_installed ? 'Installed' : 'Not Found'}
            </span>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

