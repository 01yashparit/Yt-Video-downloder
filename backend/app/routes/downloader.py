from fastapi import APIRouter, HTTPException, status
from app.models.schemas import (
    InfoRequest,
    VideoInfoResponse,
    DownloadRequest,
    DownloadResponse,
    DownloadStatusResponse,
    ErrorResponse
)
from app.services.downloader import downloader_service, DownloaderError

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
