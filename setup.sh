#!/usr/bin/env bash

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONDA_ENV="aiml"

echo "=========================================="
echo " YouTube Downloader - Setup"
echo "=========================================="
echo
echo "Project: $PROJECT_DIR"
echo "Conda environment: $CONDA_ENV"
echo

# --------------------------------------------------
# Check Conda
# --------------------------------------------------

if ! command -v conda >/dev/null 2>&1; then
    echo "ERROR: Conda was not found."
    echo
    echo "Please initialize Conda first:"
    echo "    conda init bash"
    echo
    echo "Then restart your terminal."
    exit 1
fi

echo "Conda found:"
conda --version
echo

# --------------------------------------------------
# Initialize Conda for this script
# --------------------------------------------------

CONDA_BASE="$(conda info --base)"

source "$CONDA_BASE/etc/profile.d/conda.sh"

# --------------------------------------------------
# Check aiml environment
# --------------------------------------------------

if ! conda env list | awk '{print $1}' | grep -qx "$CONDA_ENV"; then
    echo "ERROR: Conda environment '$CONDA_ENV' does not exist."
    echo
    echo "Create it first, for example:"
    echo "    conda create -n aiml python=3.12"
    exit 1
fi

# --------------------------------------------------
# Activate aiml
# --------------------------------------------------

echo "Activating Conda environment: $CONDA_ENV"
conda activate "$CONDA_ENV"

echo
echo "Python:"
python --version

echo
echo "Python location:"
which python

echo
echo "=========================================="
echo " Installing Backend Requirements"
echo "=========================================="

cd "$PROJECT_DIR/backend"

if [ -f "requirements.txt" ]; then
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
else
    echo "ERROR: backend/requirements.txt not found."
    exit 1
fi

# --------------------------------------------------
# Frontend requirements
# --------------------------------------------------

echo
echo "=========================================="
echo " Installing Frontend Requirements"
echo "=========================================="

cd "$PROJECT_DIR/frontend"

if [ -f "package.json" ]; then
    npm install
else
    echo "ERROR: frontend/package.json not found."
    exit 1
fi

# --------------------------------------------------
# Project directories
# --------------------------------------------------

echo
echo "=========================================="
echo " Creating Project Directories"
echo "=========================================="

mkdir -p "$PROJECT_DIR/downloads"
mkdir -p "$PROJECT_DIR/temp"

# --------------------------------------------------
# Check Python packages
# --------------------------------------------------

echo
echo "=========================================="
echo " Verifying Python Environment"
echo "=========================================="

python -c "import fastapi; print('FastAPI:', fastapi.__version__)"

# --------------------------------------------------
# Finished
# --------------------------------------------------

echo
echo "=========================================="
echo " Setup Complete"
echo "=========================================="
echo
echo "Python environment:"
echo "    Conda: $CONDA_ENV"
echo
echo "Run the application with:"
echo
echo "    ./run.sh"
echos