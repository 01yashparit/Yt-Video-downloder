import React, { useState } from 'react';
import type { VideoMetadata } from '../types';

interface MetadataCardProps {
  metadata: VideoMetadata;
  onStartDownload: (formatId: string) => void;
  isDownloading: boolean;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  metadata,
  onStartDownload,
  isDownloading,
}) => {
  const [selectedFormatId, setSelectedFormatId] = useState<string>(
    metadata.formats[0]?.format_id || ''
  );

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    if (hours > 0) {
      return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1000) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Thumbnail preview */}
        <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/50">
          <img
            src={metadata.thumbnail}
            alt={metadata.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-neutral-950/80 backdrop-blur-sm text-neutral-200 text-xs px-2 py-0.5 rounded font-mono font-medium border border-neutral-700/50">
            {formatDuration(metadata.duration)}
          </div>
        </div>

        {/* Info details */}
        <div className="flex-1 space-y-3 min-w-0">
          <h2 className="text-lg font-semibold text-neutral-100 line-clamp-2 leading-snug">
            {metadata.title}
          </h2>
          {metadata.author && (
            <p className="text-xs text-neutral-400 flex items-center space-x-1.5">
              <span>Channel:</span>
              <span className="text-neutral-300 font-medium">{metadata.author}</span>
            </p>
          )}
          <div className="pt-2">
            <span className="inline-flex items-center text-xs font-mono bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md border border-neutral-700/50">
              {metadata.formats.length} formats available
            </span>
          </div>
        </div>
      </div>

      {/* Format Selector & Download Section */}
      <div className="border-t border-neutral-800 pt-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label htmlFor="format-select" className="text-xs font-medium text-neutral-300">
            Select Quality / Format
          </label>
          <span className="text-xs text-neutral-500">Audio + Video formats listed</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            id="format-select"
            value={selectedFormatId}
            onChange={(e) => setSelectedFormatId(e.target.value)}
            disabled={isDownloading}
            className="flex-1 bg-neutral-950 border border-neutral-700/80 text-neutral-100 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none disabled:opacity-60"
          >
            {metadata.formats.map((fmt) => (
              <option key={fmt.format_id} value={fmt.format_id}>
                {fmt.resolution} ({fmt.extension}) {fmt.note ? `- ${fmt.note}` : ''}{' '}
                {fmt.filesize_approx ? `(~${formatFileSize(fmt.filesize_approx)})` : ''}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onStartDownload(selectedFormatId)}
            disabled={isDownloading || !selectedFormatId}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm shrink-0 shadow-lg shadow-emerald-600/20 active:scale-98"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download Selected</span>
          </button>
        </div>
      </div>
    </div>
  );
};
