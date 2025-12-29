import type { TourStep } from '../types/tour';

/**
 * Dashboard Onboarding Tour 步驟配置
 *
 * 商業故事脈絡：問題解決導向
 * 品牌痛點 → 我們的解決方案 → 實際成效
 */
export const dashboardTourSteps: TourStep[] = [
  {
    id: 'welcome',
    targetId: 'dashboard-header',
    title: '品牌行銷的痛點：找不到對的 KOL？',
    content:
      '傳統 KOL 媒合靠人脈、憑感覺，難以評估真實影響力。這個儀表板用數據幫您解決這個問題。',
    position: 'bottom',
    spotlightPadding: 16,
  },
  {
    id: 'hero-metrics',
    targetId: 'hero-metrics-grid',
    title: '一眼掌握全局數據',
    content:
      'KOL 總數、觸及人數、Campaign 數量、平均 ROI — 這些是您最需要關注的核心指標，即時更新，一目了然。',
    position: 'bottom',
    spotlightPadding: 12,
  },
  {
    id: 'engagement-rate',
    targetId: 'secondary-metrics',
    title: '不只是粉絲數，更看互動品質',
    content:
      '我們的 KOL 平均互動率高於業界標準。高互動代表真實的粉絲連結，高轉換潛力，這才是真正的影響力。',
    position: 'bottom',
    spotlightPadding: 12,
  },
  {
    id: 'platform-chart',
    targetId: 'charts-row',
    title: '跨平台策略，精準佈局',
    content:
      '清楚看到 KOL 在各平台的分佈與類別分析，幫助您規劃多管道行銷策略，觸及不同受眾群體。',
    position: 'top',
    spotlightPadding: 12,
  },
  {
    id: 'data-stories',
    targetId: 'data-stories-preview',
    title: '數據會說故事',
    content:
      'AI 自動生成的洞察報告，幫您發現隱藏趨勢：哪個 KOL 聲量爆漲、哪個類別成長最快、市場情緒變化。',
    position: 'top',
    spotlightPadding: 12,
  },
  {
    id: 'top-kols',
    targetId: 'top-kols-section',
    title: '精選頂尖創作者',
    content:
      '影響力指數最高的 KOL 一目了然。點擊卡片可查看詳細資料、受眾分析、合作報價，快速評估適配性。',
    position: 'top',
    spotlightPadding: 12,
  },
  {
    id: 'cta',
    targetId: 'view-stories-button',
    title: '開始您的影響力行銷之旅',
    content:
      '探索更多數據故事，或點擊側邊欄查看完整 KOL 列表、Campaign 管理與數據洞察功能。',
    position: 'bottom',
    spotlightPadding: 8,
  },
];
