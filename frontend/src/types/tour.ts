/**
 * Tour 系統類型定義
 * 用於 Onboarding 商業故事引導
 */

export interface TourStep {
  /** 步驟唯一識別碼 */
  id: string;
  /** 對應目標元素的 data-tour-id 屬性值 */
  targetId: string;
  /** 步驟標題（痛點問題或價值主張） */
  title: string;
  /** 步驟說明文字 */
  content: string;
  /** Tooltip 相對於目標元素的位置 */
  position: 'top' | 'bottom' | 'left' | 'right';
  /** Spotlight 區域的 padding（預設 12px） */
  spotlightPadding?: number;
}

export interface TourState {
  /** Tour 是否啟動中 */
  isActive: boolean;
  /** 當前步驟索引 */
  currentStep: number;
  /** 所有步驟配置 */
  steps: TourStep[];
}

export interface TourContextValue {
  /** Tour 狀態 */
  state: TourState;
  /** 開始 Tour */
  startTour: () => void;
  /** 結束 Tour */
  endTour: () => void;
  /** 下一步 */
  nextStep: () => void;
  /** 上一步 */
  prevStep: () => void;
  /** 跳到指定步驟 */
  goToStep: (index: number) => void;
  /** 跳過整個 Tour */
  skipTour: () => void;
}
