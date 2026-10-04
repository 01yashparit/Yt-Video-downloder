import React, { useState } from 'react';
import { Download, ImageOff, Film, Music } from 'lucide-react';
import type { VideoMetadata, VideoFormat } from '../types';
import { formatBytes, formatDuration } from '../utils/format';

interface MetadataCardProps {
  metadata: VideoMetadata;
  onStartDownload: (formatId: string) => void;
  isDownloading: boolean;
  ffmpegInstalled?: boolean;
}

const badgeOf = (f: VideoFormat) =>
  f.has_video && f.has_audio ? 'Video + Audio' : f.has_video ? 'Video only' : 'Audio only';

export const MetadataCard: React.FC<MetadataCardProps> = ({
  metadata,
  onStartDownload,
  isDownloading,
  ffmpegInstalled,
}) => {
  const [tab, setTab] = useState<'video' | 'audio'>('video');
  const [selectedId, setSelectedId] = useState<string>(metadata.formats[0]?.format_id || '');
  const [imgOk, setImgOk] = useState(true);

  const videoList = metadata.formats.filter((f) => f.has_video);
  const audioList = metadata.formats.filter((f) => !f.has_video && f.has_audio);
  const list = tab === 'video' ? videoList : audioList;
  const active = list.find((f) => f.format_id === selectedId) ?? list[0];
  const maxHeight = Math.max(0, ...videoList.map((f) => f.height || 0));

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const backward = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!forward && !backward) return;
    e.preventDefault();
    const i = list.findIndex((f) => f.format_id === active?.format_id);
    const n = (i + (forward ? 1 : -1) + list.length) % list.length;
    setSelectedId(list[n].format_id);
    (e.currentTarget.children[n] as HTMLElement | undefined)?.focus();
  };

  const tabClass = (on: boolean) =>
    `flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-medium transition active:scale-[.98] ${
      on ? 'bg-linear-to-r from-red-600 to-orange-500 text-white' : 'muted'
    }`;

  return (
    <div className="card rise space-y-5 p-4 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-black/30 md:w-64">
          {imgOk && metadata.thumbnail ? (
            <img
              src={metadata.thumbnail}
              alt={metadata.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgOk(false)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="muted grid h-full place-items-center">
              <ImageOff className="size-8" aria-hidden="true" />
            </div>
          )}
          <span className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-0.5 font-mono text-xs text-white">
            {formatDuration(metadata.duration)}
          </span>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="line-clamp-2 text-lg font-semibold leading-snug">{metadata.title}</h2>
          {metadata.uploader && (
            <p className="muted text-sm">
              Channel: <span style={{ color: 'var(--text)' }} className="font-medium">{metadata.uploader}</span>
            </p>
          )}
          <span className="line muted inline-block rounded-md px-2.5 py-1 font-mono text-xs">
            {metadata.formats.length} formats available
          </span>
        </div>
      </div>

      <div role="tablist" aria-label="Media type" className="line grid grid-cols-2 gap-1 rounded-xl p-1">
        <button type="button" role="tab" aria-selected={tab === 'video'} disabled={isDownloading} onClick={() => setTab('video')} className={tabClass(tab === 'video')}>
          <Film className="size-4" aria-hidden="true" /> Video
        </button>
        <button type="button" role="tab" aria-selected={tab === 'audio'} disabled={isDownloading} onClick={() => setTab('audio')} className={tabClass(tab === 'audio')}>
          <Music className="size-4" aria-hidden="true" /> Audio
        </button>
      </div>

      {list.length === 0 ? (
        <p className="muted py-4 text-center text-sm">No {tab} formats are available for this video.</p>
      ) : (
        <div role="radiogroup" aria-label="Select quality" onKeyDown={onKey} className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((f) => {
            const on = f.format_id === active?.format_id;
            return (
              <button
                key={f.format_id}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                disabled={isDownloading}
                onClick={() => setSelectedId(f.format_id)}
                className="line min-h-14 rounded-xl p-3.5 text-left transition active:scale-[.98] disabled:opacity-60"
                style={on ? { borderColor: '#fb923c', background: 'rgba(251,146,60,.10)' } : undefined}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold">{f.resolution}</span>
                  {f.has_video && maxHeight > 0 && f.height === maxHeight && (
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-medium text-emerald-500">Best</span>
                  )}
                  <span className="muted line rounded px-1.5 py-0.5 text-[11px]">{badgeOf(f)}</span>
                </div>
                <p className="muted mt-1 text-xs">
                  {f.extension.toUpperCase()}
                  {f.fps ? ` · ${Math.round(f.fps)} fps` : ''} · {formatBytes(f.filesize_approx)}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {active && active.has_video && !active.has_audio && ffmpegInstalled && (
        <p className="muted text-xs">Audio is merged automatically.</p>
      )}

      <div className="actionbar">
        <p className="muted min-w-0 flex-1 truncate text-sm sm:hidden">
          {active ? `${active.resolution} · ${active.extension.toUpperCase()}` : 'No format selected'}
        </p>
        <button
          type="button"
          onClick={() => active && onStartDownload(active.format_id)}
          disabled={isDownloading || !active}
          className="flex min-h-12 w-auto shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 to-orange-500 px-6 font-semibold text-white transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-full"
        >
          <Download className="size-4" aria-hidden="true" />
          <span>Download Selected</span>
        </button>
      </div>
    </div>
  );
};
