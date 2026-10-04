import mimetypes
from pathlib import Path

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from app.models.schemas import (
    InfoRequest,
    VideoInfoResponse,
    DownloadRequest,
    DownloadResponse,
    DownloadStatusResponse,
    ErrorResponse
)
from app.services.downloader import downloader_service, DownloaderError
from app.utils.config import settings

router = APIRouter(prefix="/api", tags=["downloader"])


@router.post(
    "/info",
    response_model=VideoInfoResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}}
)
async def get_video_info(request: InfoRequest):
    """
    Retrieves metadata and actual available video/audio formats for a given YouTube URL.
    """
    try:
        info = downloader_service.fetch_video_info(request.url)
        return info
    except DownloaderError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@router.post(
    "/download",
    response_model=DownloadResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}}
)
async def start_download(request: DownloadRequest):
    """
    Initiates a background media download for the specified URL and format ID.
    """
    try:
        job_id = downloader_service.start_download_job(request.url, request.format_id)
        return DownloadResponse(
            job_id=job_id,
            status="pending",
            message="Download initiated successfully."
        )
    except DownloaderError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initiate download: {str(e)}"
        )


@router.get(
    "/download/{job_id}/status",
    response_model=DownloadStatusResponse,
    responses={404: {"model": ErrorResponse}}
)
async def get_download_status(job_id: str):
    """
    Retrieves real-time download progress and status for a job ID.
    """
    job = downloader_service.get_job_status(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Download job ID '{job_id}' not found."
        )
    return job


@router.get(
    "/download/{job_id}/file",
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}}
)
async def download_file(job_id: str):
    """
    Serves a completed download so the browser can save it.
    The client never supplies a path: the filename comes from the job record,
    and the resolved path must stay inside the downloads directory.
    """
    job = downloader_service.get_job_status(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Download job ID '{job_id}' not found."
        )
    if job.status != "completed" or not job.filename:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Download is not finished yet."
        )

    downloads_dir = Path(settings.DOWNLOAD_DIR).resolve()
    file_path = (downloads_dir / job.filename).resolve()
    if downloads_dir not in file_path.parents or not file_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found."
        )

    media_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type=media_type
    )