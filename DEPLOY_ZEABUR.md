# Zeabur 部署指南

## 部署架構

```
┌─────────────────┐      ┌─────────────────┐
│    Frontend     │ ───▶ │     Backend     │
│  (Static Site)  │      │   (Python)      │
│                 │      │                 │
│  React + Vite   │      │  FastAPI        │
│  Zeabur Static  │      │  Zeabur Python  │
└─────────────────┘      └─────────────────┘
```

## 部署步驟

### 1. 準備 Git Repository

確保你的專案已推送到 GitHub/GitLab：

```bash
git add .
git commit -m "準備 Zeabur 部署"
git push origin main
```

### 2. 部署 Backend

1. 登入 [Zeabur Console](https://zeabur.com)
2. 建立新專案（Project）
3. 點擊「Add Service」→「Git」
4. 選擇你的 repository
5. **重要**：設定 Root Directory 為 `backend`
6. Zeabur 會自動偵測為 Python 專案
7. 部署完成後，記下你的 Backend URL（例如：`https://influence-api.zeabur.app`）

### 3. 部署 Frontend

1. 在同一個 Project 中，點擊「Add Service」→「Git」
2. 選擇同一個 repository
3. **重要**：設定 Root Directory 為 `frontend`
4. Zeabur 會自動偵測為 Static Site
5. 設定環境變數：
   - `VITE_API_URL` = `https://你的backend網址/api`

   例如：`VITE_API_URL=https://influence-api.zeabur.app/api`

6. 重新部署（Redeploy）讓環境變數生效

### 4. 設定網域（可選）

1. 在 Frontend 服務中，點擊「Networking」
2. 可以使用 Zeabur 提供的免費子網域
3. 或綁定自己的網域

---

## 環境變數說明

### Backend

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `PORT` | Zeabur 自動設定 | - |
| `ZEABUR_ENVIRONMENT` | Zeabur 自動設定 | - |
| `ALLOWED_ORIGINS` | CORS 允許的來源（可選） | `https://your-frontend.zeabur.app` |

### Frontend

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `VITE_API_URL` | 後端 API URL | `https://influence-api.zeabur.app/api` |

---

## 檔案結構

```
influence_dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI 應用
│   │   └── mock_data.py     # Mock 數據
│   ├── requirements.txt     # Python 依賴
│   ├── pyproject.toml
│   └── zeabur.json          # Zeabur 配置
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── zeabur.json          # Zeabur 配置
│   └── .env.example
│
└── DEPLOY_ZEABUR.md         # 本文件
```

---

## 常見問題

### Q: Frontend 顯示 API 錯誤？

確認：
1. Backend 已成功部署並運行
2. `VITE_API_URL` 環境變數已正確設定
3. 已重新部署 Frontend

### Q: CORS 錯誤？

Backend 在 Zeabur 環境會自動允許所有來源。如需限制：
1. 在 Backend 服務設定 `ALLOWED_ORIGINS` 環境變數
2. 值為前端網址，例如：`https://influence-dashboard.zeabur.app`

### Q: 如何查看 Log？

在 Zeabur Console 中，點擊服務 → Logs 分頁

---

## 本地開發 vs Zeabur 部署

| 項目 | 本地開發 | Zeabur 部署 |
|------|---------|------------|
| Frontend Port | 5173 | Zeabur 自動分配 |
| Backend Port | 8001 | Zeabur 自動分配 |
| API 呼叫 | Vite Proxy (`/api`) | 直接呼叫 Backend URL |
| CORS | localhost 白名單 | 允許所有 / 指定網域 |

---

## 快速部署指令

```bash
# 確保所有變更已提交
git add .
git commit -m "Deploy to Zeabur"
git push origin main
```

然後在 Zeabur Console 操作即可，Zeabur 會自動拉取最新程式碼並部署。
