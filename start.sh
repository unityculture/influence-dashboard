#!/bin/bash

# KOL Influence Dashboard - 啟動腳本

echo "🚀 啟動 KOL 影響力儀表板..."
echo ""

# 檢查是否在正確目錄
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ 請在專案根目錄執行此腳本"
    exit 1
fi

# 啟動後端
echo "📦 啟動後端 API (Port 8000)..."
cd backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# 等待後端啟動
sleep 3

# 啟動前端
echo "🎨 啟動前端開發伺服器 (Port 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 服務已啟動！"
echo ""
echo "📊 前端: http://localhost:5173"
echo "🔌 後端 API: http://localhost:8000"
echo "📚 API 文件: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服務"

# 等待用戶中斷
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '👋 已停止所有服務'; exit 0" SIGINT SIGTERM

wait
