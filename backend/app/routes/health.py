from fastapi import APIRouter
from app.models.schemas import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint confirming that the backend engine is running.
    """
    return HealthResponse(
        status="healthy",
        service="youtube-downloader-backend",
        version="0.1.0"
    )
