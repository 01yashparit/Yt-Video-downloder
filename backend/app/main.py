from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.health import router as health_router
from app.routes.downloader import router as downloader_router
from app.utils.config import settings
from app.utils.logger import logger

app = FastAPI(
    title="YouTube Video Downloader Local Backend",
    description="Local-first backend service for downloading media.",
    version="0.1.0"
)

# CORS Middleware setup for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "An internal server error occurred.", "code": 500}
    )

# Routers
app.include_router(health_router)
app.include_router(downloader_router)

@app.get("/")
async def root():
    return {"message": "YouTube Downloader Backend API is active", "health": "/health"}
