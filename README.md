# YouTube Media Downloader (Personal / Local Use)

A local, personal-use web application for downloading YouTube media using a React + Vite + TypeScript frontend and a FastAPI backend with `yt-dlp` and `FFmpeg`.

## Prerequisites

- **Node.js**: v18+ (v22 recommended)
- **npm**: v10+
- **Python**: 3.10+
- **FFmpeg**: Installed on host system and available in PATH (required for merging separate high-quality video and audio streams).

## Architecture

- **Frontend**: React, Vite, TypeScript, Tailwind CSS (`frontend/`)
- **Backend**: Python, FastAPI, `yt-dlp`, Pydantic (`backend/`)
- **Storage**: Media files are saved locally to `downloads/`. Temporary processing files use `temp/`.

## Setup & Running

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The backend health endpoint can be verified at: `http://127.0.0.1:8000/health`.

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```

Open your browser at `http://localhost:5173`.

## Usage

1. Open the local web application in your browser (`http://localhost:5173`).
2. Paste a valid YouTube video URL into the input field.
3. Click **Fetch Info**. The backend will inspect `yt-dlp` format information and display actual available resolutions (e.g. 2160p, 1440p, 1080p, 720p, or Audio Only).
4. Select your preferred format and click **Download Selected**.
5. Real-time download progress and speed will display. Once finished, the file will be saved in your local `downloads/` directory.

## Download Location

Downloaded media files are automatically saved to the local `downloads/` folder inside the project root directory. Unused temporary processing files are cleaned automatically.
