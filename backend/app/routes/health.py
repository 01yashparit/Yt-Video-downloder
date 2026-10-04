from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.services.downloader import downloader_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="youtube-downloader-backend",
        version="0.1.0",
        ffmpeg_installed=downloader_service.is_ffmpeg_installed(),
    )