# KOL 影響力儀表板開發需求文件

## 一、專案背景

### 商業背景（Business Context）

Fergus 與 Aaron 共同推進一個「影響力行銷與數據應用」計畫，目標是協助品牌更精準地媒合 KOL、KOC 或藝人，並用數據化方式展示與驗證其行銷成效。

目前專案所屬的公司（由 Aaron 主導）主要承接品牌端的 Campaign，負責替品牌找合適的 KOL／藝人，並提供具備創意與數據基礎的行銷提案。

**重要定位**：這不是要賣錢的產品，而是用於**投資人展示**與**品牌提案**的 Showcase。因此 UI 必須「**很炫炮很科幻**」，展現數據實力與技術能力。

### 合作範圍（Scope）

1. **KOL 影響力分析模型**
   - 目標：建立一套可量化的 KOL／藝人影響力 Profile 模型
   - 資料來源：輿情（Q-Search 等來源）、社群互動數據、內容關鍵字
   - 輸出內容：
     - KOL 屬性標籤與分類（主題、受眾、風格等）
     - 影響力指標（聲量、互動、情緒傾向、關鍵詞影響範圍）
     - 媒合依據說明（為什麼這位 KOL 適合某品牌）

2. **Campaign 成效驗證與儀表板**
   - 目標：可視化各 KOL 在不同 Campaign 中的成效
   - 內容範圍：
     - 活動成效儀表板（流量、互動、曝光）
     - 受眾 Profile 匹配分析
     - 輿情變化趨勢（活動前後品牌關鍵詞熱度）
   - **重要**：範圍不涉及交易或購買轉換數據，停留在表層輿情與互動層級

3. **內外部影響力延伸**
   - 外部影響力：品牌對外評估 KOL／藝人價值的分數與排名
   - 內部影響力：以會員推薦（MGM）或社群互動為基礎，觀察品牌內部用戶的口碑傳播網絡

---

## 二、技術棧要求

### 後端
- Python FastAPI
- 使用 `uv` 管理虛擬環境、Python 版本、套件安裝
- 啟動指令：`uv run uvicorn app.main:app --reload --port 8001`

### 前端
- React 18 + TypeScript + Vite
- **shadcn/ui** 做所有 UI 組件（這是關鍵！預設就很美，AI 訓練數據豐富）
- **Tailwind CSS**（不要自定義 CSS 檔案，使用 utility-first）
- **Recharts** 做資料視覺化
- **Framer Motion** 做動畫
- **@tanstack/react-query** 做資料請求
- 啟動指令：`npm run dev`（預設 port 5173）

### 已建立的 shadcn/ui 組件
位於 `/frontend/src/components/ui/`：
- `button.tsx` - 按鈕（含 glow 變體）
- `card.tsx` - 卡片（含 gradient 支援）
- `badge.tsx` - 標籤（含 success, warning, glow 變體）
- `avatar.tsx` - 頭像
- `progress.tsx` - 進度條
- `tabs.tsx` - 分頁切換
- `tooltip.tsx` - 提示框
- `separator.tsx` - 分隔線
- `skeleton.tsx` - 載入骨架屏

---

## 三、設計系統

### 色彩系統
```css
Primary: blue-500/600 (#6366f1)
Accent: cyan-500 (#06b6d4)
Secondary: pink-500 (#ec4899)
Background: slate-950 / #0a0a0f (dark mode)
Border radius: rounded-xl
Spacing: 4px base unit
```

### 霓虹色（Neon Colors）
```css
--neon-blue: #00f0ff
--neon-purple: #bf00ff
--neon-pink: #ff00aa
--neon-green: #00ff88
```

### 必須包含的設計要素
- Dark mode support（深色主題）
- Gradient backgrounds（漸層背景）
- Responsive design（響應式設計）
- Loading skeletons（載入骨架屏）
- Error states（錯誤狀態）
- Smooth animations（流暢動畫）
- Glow effects（發光效果）
- Glass effect（玻璃擬態效果）

### 組件規範
1. 頁面內容包在 `max-w-7xl mx-auto` container
2. 使用 `gap-4` 或 `gap-6` 做 grid/flex 間距
3. 統計卡片必須有：icon、value、label、trend indicator
4. 圖表必須有：title、legend、responsive container

### 動畫規範
- Page transitions: `animate-in fade-in duration-300`
- Hover states: `transition-all duration-200`
- Charts: 使用 Recharts 內建動畫屬性
- Card hover: `translateY(-4px) scale(1.01)` + glow shadow

### 已實作的 CSS 效果（/frontend/src/index.css）
- 動態背景（radial-gradient 多層疊加）
- 網格線效果（Grid Lines Effect）
- 漸層文字（.text-gradient）
- 發光效果（.glow-primary, .glow-accent, .glow-neon）
- 脈動發光動畫（animate-pulse-glow）
- 漂浮動畫（animate-float）
- 閃爍動畫（animate-shimmer）
- 邊框發光動畫（animate-border-glow）
- 數字計數動畫（animate-count-up）
- 卡片懸停效果（.card-hover）
- 科幻邊框效果（.sci-fi-border）
- 動態旋轉邊框（.animated-border）

---

## 四、資料來源（輿情導向，非交易數據）

| 來源 | 類型 | 說明 |
|------|------|------|
| Q-Search 輿情系統 | 輿情數據 | 社群留言、貼文、關鍵字聲量 |
| 社群平台 API | KOL 數據 | 粉絲數、互動數據 |
| Campaign 追蹤 | 成效數據 | 專屬碼、UTM 追蹤 |
| 12CN 會員系統 | 會員數據 | MGM 導流、會員標籤 |

**重要**：範圍不涉及交易或購買轉換數據，停留在表層輿情與互動層級。

---

## 五、功能模組與頁面結構

### 頁面結構

1. **Dashboard（總覽）** - `/`
   - 核心指標卡片（KOL 總數、總觸及、活躍 Campaign、平均互動率）
   - 平台分佈圖表
   - 類別分析圖表
   - 快速入口

2. **KOL 列表** - `/kols`
   - KOL 搜尋、篩選、排序
   - 卡片式列表展示

3. **KOL 詳情** - `/kols/:id`
   - 個別 KOL 的完整 Profile
   - 受眾分析
   - 歷史表現

4. **Campaign 列表** - `/campaigns`
   - 活動管理
   - 狀態篩選

5. **Campaign 詳情** - `/campaigns/:id`
   - 單一活動成效分析
   - KOL 貢獻度

6. **數據故事** - `/stories`
   - 輿情導向的數據敘事
   - 8 個業務場景故事卡片
   - 資料來源展示

7. **數據洞察** - `/insights`
   - 深度分析與趨勢圖表
   - 分頁切換（輿情趨勢 / 平台分析 / 類別分析）
   - 關鍵字篩選功能
   - 關鍵洞察摘要

### 數據故事類別（8 個）

| 類別 | 故事 | 說明 |
|------|------|------|
| 輿情分析 | 輿情聲量領袖 | 總聲量數、熱門關鍵字 |
| 輿情分析 | 情緒指數觀測 | 正面情緒佔比、最佳形象 KOL |
| KOL 分析 | 影響力指數排行 | 綜合評估模型計算 |
| KOL 分析 | 互動效率之星 | 最高互動率 KOL |
| 成效驗證 | Campaign 成效追蹤 | ROI 倍數、觸及數 |
| 市場洞察 | 平台生態分佈 | 各平台 KOL 數量 |
| 深度分析 | 受眾品質評估 | 平均受眾品質分數 |
| 智慧推薦 | 品牌適配推薦 | AI 驅動的媒合系統 |

---

## 六、API 端點結構

### Dashboard
- `GET /api/dashboard/overview` - 儀表板總覽數據

### KOL
- `GET /api/kols` - KOL 列表（支援篩選、排序）
- `GET /api/kols/:id` - KOL 詳情
- `GET /api/kols/:id/audience` - KOL 受眾分析
- `GET /api/kols/compare` - KOL 比較

### Campaign
- `GET /api/campaigns` - Campaign 列表
- `GET /api/campaigns/:id` - Campaign 詳情
- `GET /api/campaigns/:id/performance` - Campaign 成效

### 輿情
- `GET /api/buzz/trends` - 輿情趨勢（支援關鍵字篩選）

### 洞察
- `GET /api/insights/platform` - 平台洞察
- `GET /api/insights/category` - 類別洞察

### 推薦
- `GET /api/recommend` - KOL 推薦

### 數據故事
- `GET /api/stories/overview` - 數據故事與洞察

---

## 七、用戶反饋與修復記錄

### 問題 1：數據洞察分頁壞了
- **描述**：「數據洞察那個分頁壞了，點不進去」
- **原因**：InsightsPage 組件有問題，無法正常渲染
- **修復**：完整重寫 InsightsPage，加入：
  - LoadingSkeleton 載入狀態
  - 正確的 API hooks（useBuzzTrends, useDashboardOverview）
  - Tabs 分頁切換（輿情趨勢 / 平台分析 / 類別分析）
  - 關鍵字篩選功能
  - 錯誤處理與空狀態

### 問題 2：數據故事需要重構
- **描述**：「數據故事我覺得要重構一下」
- **原因**：原本的數據故事沒有對齊輿情業務場景
- **修復**：
  - 後端 API 重構為 8 個輿情導向的數據故事
  - 加入 category 分類（輿情分析、KOL 分析、成效驗證、市場洞察、深度分析、智慧推薦）
  - 加入 data_source 標示資料來源
  - 前端 StoriesPage 完整重寫，展示資料來源區塊

### 問題 3：前端風格需要升級
- **描述**：「前端的風格，請參考 CLAUDE.md & beautiful_ui.md」
- **修復**：
  - 建立 9 個 shadcn/ui 組件
  - 重寫 index.css 加入科幻賽博龐克主題
  - 升級 DashboardPage、StoriesPage、InsightsPage 的 UI

---

## 八、開發注意事項

1. **請深度思考並安排長時間執行**，不要急著完成
2. 前端風格以「現代」為主，要讓投資人眼睛一亮
3. 所有數據都是 Mock Data，但結構要合理、數字要有意義
4. 優先確保 UI 美觀與互動流暢，功能完整度次之
5. 不要創建額外的 markdown 文件來記錄變更（除非明確要求）
6. 一律使用 `uv` 管理 Python 環境/套件

---

## 九、啟動指令

```bash
# 後端（port 8001）
cd backend
uv run uvicorn app.main:app --reload --port 8001

# 前端（port 5173，proxy 到 8001）
cd frontend
npm run dev
```

### Vite Proxy 設定
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8001',
      changeOrigin: true,
    }
  }
}
```

---

## 十、參考文件

- `meetingnote.md` - 與 Fergus、Aaron 的 Kickoff 會議逐字稿
- `note.md` - 整理版會議紀錄
- `beautiful_ui.md` - UI 設計指南（Antigravity 風格）
- `CLAUDE.md` - 前端開發規範
