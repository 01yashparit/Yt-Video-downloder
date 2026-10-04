from pydantic import BaseModel, Field
from typing import Optional, List

class HealthResponse(BaseModel):
    status: str = Field("healthy", description="Status of backend service")
    service: str = Field("youtube-downloader-backend", description="Service name")
    version: str = Field("0.1.0", description="API version")
    ffmpeg_installed: bool = Field(True, description="Whether FFmpeg is detected on host system")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message summary")
    detail: Optional[str] = Field(None, description="Detailed error information")
    code: int = Field(..., description="HTTP status code")

class InfoRequest(BaseModel):
    url: str = Field(..., description="YouTube video URL to inspect")

class VideoFormatSchema(BaseModel):
    format_id: str = Field(..., description="yt-dlp format identifier")
    extension: str = Field(..., description="Container extension e.g. mp4, m4a")
    resolution: str = Field(..., description="Human readable quality/resolution label")
    height: Optional[int] = Field(None, description="Video height in pixels")
    width: Optional[int] = Field(None, description="Video width in pixels")
    fps: Optional[float] = Field(None, description="Frames per second")
    vcodec: Optional[str] = Field(None, description="Video codec name")
    acodec: Optional[str] = Field(None, description="Audio codec name")
    filesize_approx: Optional[int] = Field(None, description="Approximate filesize in bytes")
    has_audio: bool = Field(..., description="True if format includes audio")
    has_video: bool = Field(..., description="True if format includes video")
    note: Optional[str] = Field(None, description="Additional format note")

class VideoInfoResponse(BaseModel):
    id: str = Field(..., description="Video ID")
    title: str = Field(..., description="Video title")
    url: str = Field(..., description="Video original URL")
    thumbnail: str = Field(..., description="Thumbnail image URL")
    duration: int = Field(..., description="Duration in seconds")
    uploader: Optional[str] = Field(None, description="Uploader / Channel name")
    formats: List[VideoFormatSchema] = Field(..., description="List of actual available formats")

class DownloadRequest(BaseModel):
    url: str = Field(..., description="YouTube video URL")
    format_id: str = Field(..., description="Selected format identifier or resolution preference")

class DownloadResponse(BaseModel):
    job_id: str = Field(..., description="Unique download job ID")
    status: str = Field("pending", description="Initial job status")
    message: str = Field("Download job initiated", description="Status details")

class DownloadStatusResponse(BaseModel):
    job_id: str = Field(..., description="Download job ID")
    status: str = Field(..., description="Job status: pending, downloading, processing, completed, failed")
    progress_percentage: float = Field(0.0, description="Download progress 0-100")
    downloaded_bytes: Optional[int] = Field(None, description="Bytes downloaded so far")
    total_bytes: Optional[int] = Field(None, description="Total expected bytes")
    speed: Optional[str] = Field(None, description="Current download speed string")
    filename: Optional[str] = Field(None, description="Output filename if completed")
    error: Optional[str] = Field(None, description="Error message if failed")
