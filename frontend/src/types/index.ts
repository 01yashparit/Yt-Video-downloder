export interface VideoFormat {
  format_id: string;
  extension: string;
  resolution: string;
  height?: number;
  fps?: number;
  filesize_approx?: number;
  has_audio: boolean;
  has_video: boolean;
  note?: string;
}

export interface VideoMetadata {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: number; // in seconds
  uploader?: string;
  formats: VideoFormat[];
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  ffmpeg_installed: boolean;
}

export interface DownloadRequest {
  url: string;
  format_id: string;
}

export interface DownloadStatusResponse {
  job_id: string;
  status: 'pending' | 'downloading' | 'processing' | 'completed' | 'failed';
  progress_percentage: number;
  downloaded_bytes?: number;
  total_bytes?: number;
  speed?: string;
  error?: string;
  filename?: string;
}
