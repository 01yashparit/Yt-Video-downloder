import type { HealthResponse, VideoMetadata, DownloadStatusResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }
  return response.json();
}

export async function fetchVideoInfo(url: string): Promise<VideoMetadata> {
  const response = await fetch(`${API_BASE_URL}/api/info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
    throw new Error(errorData.detail || `Error fetching video info (${response.status})`);
  }

  return response.json();
}

export async function startDownload(url: string, format_id: string): Promise<{ job_id: string }> {
  const response = await fetch(`${API_BASE_URL}/api/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, format_id }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to initiate download' }));
    throw new Error(errorData.detail || `Error starting download (${response.status})`);
  }

  return response.json();
}

export async function getDownloadStatus(jobId: string): Promise<DownloadStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/download/${jobId}/status`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch status' }));
    throw new Error(errorData.detail || `Error getting status (${response.status})`);
  }
  return response.json();
}

