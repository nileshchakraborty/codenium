#!/bin/bash
set -x
export DEBUG_LOGS=true
export PORT=3001

# Function to kill processes on specific ports
kill_port() {
    PORT_NUM=$1
    echo "Checking port $PORT_NUM..."
    PID=$(lsof -ti :$PORT_NUM)
    if [ -n "$PID" ]; then
        echo "Port $PORT_NUM is in use by PID $PID. Killing..."
        kill -9 $PID 2>/dev/null
    fi
}

echo "🧹 Cleaning up ports..."
kill_port 8000
kill_port 3001
kill_port 3000

# Run Validation
echo "🧪 Validating Infrastructure..."
node scripts/validate_infrastructure.js
if [ $? -ne 0 ]; then
    echo "❌ Validation failed. Check your environment variables and connections."
    exit 1
fi

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    trap - SIGINT SIGTERM EXIT
    echo ""
    echo "Shutting down services..."
    if [ -n "$BACKEND_PID" ]; then
        echo "Stopping Backend..."
        pkill -P $BACKEND_PID 2>/dev/null
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        echo "Stopping Frontend..."
        pkill -P $FRONTEND_PID 2>/dev/null
        kill $FRONTEND_PID 2>/dev/null
    fi
    kill_port 8000
    kill_port 3001
    kill_port 3000
    exit
}

trap cleanup SIGINT SIGTERM EXIT

echo "Starting Backend (Port 3001)..."
PORT=3001 make run-api > api.log 2>&1 &
BACKEND_PID=$!

sleep 5

echo "Starting Unified Frontend (Port 3000)..."
make run-frontend > frontend.log 2>&1 &
FRONTEND_PID=$!

wait
