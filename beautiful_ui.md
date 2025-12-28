Antigravity 漂亮的 UI 主要來自三個因素：
1. Tech Stack 選擇決定了 80% 的視覺品質
組件用途為什麼重要shadcn/ui組件庫這是關鍵！預設就很美，且 AI 對它的訓練數據豐富Tailwind CSS樣式系統utility-first，AI 可精確控制樣式Recharts圖表Dashboard 必備的數據視覺化Framer Motion動畫讓 UI 有生命感Next.js 14+ (App Router)框架現代 React 生態系標準
2. Prompt 結構化程度極高
從 DataCamp 的教程中，Antigravity 的 prompt 模式是這樣的：
Build me a [框架] app called "[名稱]" that [功能描述].

For every [實體], display [具體欄位列表].

Use [tech stack 明確指定] to make the UI look like a [設計風格描述].
3. 設計要素的明確指定
Antigravity 生成的 Implementation Plan 會自動包含：

Dark mode support
Gradient backgrounds
Responsive design
Loading skeletons
Error states
Smooth animations
