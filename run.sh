#!/usr/bin/env bash

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONDA_ENV="aiml"

echo "=========================================="
echo " YouTube Downloader"
echo "=========================================="
echo

# --------------------------------------------------
# Check Conda
# --------------------------------------------------

if ! command -v conda >/dev/null 2>&1; then
    echo "ERROR: Conda was not found."
    exit 1
fi

CONDA_BASE="$(conda info --base)"

source "$CONDA_BASE/etc/profile.d/conda.sh"

# --------------------------------------------------
# Check environment
# --------------------------------------------------

if ! conda env list | awk '{print $1}' | grep -qx "$CONDA_ENV"; then
    echo "ERROR: Conda environment '$CONDA_ENV' does not exist."
    exit 1
fi

# --------------------------------------------------
# Activate environment
# --------------------------------------------------

echo "Activating Conda environment: $CONDA_ENV"

conda activate "$CONDA_ENV"

echo
echo "Python:"
python --version

echo "Python executable:"
which python

echo

# --------------------------------------------------
# Verify backend
# --------------------------------------------------

if [ ! -f "$PROJECT_DIR/backend/app/main.py" ]; then
    echo "ERROR: FastAPI application not found."
    exit 1
fi

# --------------------------------------------------
# Verify frontend
# --------------------------------------------------

if [ ! -f "$PROJECT_DIR/frontend/package.json" ]; then
    echo "ERROR: Frontend package.json not found."
    exit 1
fi

# --------------------------------------------------
# Start backend
# --------------------------------------------------

echo "=========================================="
echo " Starting FastAPI Backend"
echo "=========================================="

cd "$PROJECT_DIR/backend"

uvicorn app.main:app --reload &
BACKEND_PID=$!

# --------------------------------------------------
# Give backend time to start
# --------------------------------------------------

sleep 2

# --------------------------------------------------
# Start frontend
# --------------------------------------------------

echo
echo "=========================================="
echo " Starting React Frontend"
echo "=========================================="

cd "$PROJECT_DIR/frontend"

npm run dev &
FRONTEND_PID=$!

# --------------------------------------------------
# Cleanup
# --------------------------------------------------

cleanup() {

    echo
    echo "=========================================="
    echo " Stopping Application"
    echo "=========================================="

    if [ -n "${BACKEND_PID:-}" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    if [ -n "${FRONTEND_PID:-}" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi

    echo "Application stopped."
}

trap cleanup EXIT INT TERM

# --------------------------------------------------
# Information
# --------------------------------------------------

echo
echo "=========================================="
echo " YouTube Downloader Running"
echo "=========================================="
echo
echo "Conda environment:"
echo "    $CONDA_ENV"
echo
echo "Frontend:"
echo "    http://localhost:5173"
echo
echo "Backend:"
echo "    http://127.0.0.1:8000"
echo
echo "API documentation:"
echo "    http://127.0.0.1:8000/docs"
echo
echo "Downloads:"
echo "    $PROJECT_DIR/downloads"
echo
echo "Press Ctrl+C to stop."
echo

wait