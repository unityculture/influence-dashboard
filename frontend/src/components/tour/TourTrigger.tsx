import { HelpCircle, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { useTourContext } from './TourProvider';

interface TourTriggerProps {
  /** 按鈕樣式變體 */
  variant?: 'button' | 'icon';
  /** 額外的 className */
  className?: string;
}

export function TourTrigger({ variant = 'button', className = '' }: TourTriggerProps) {
  const { startTour, state } = useTourContext();

  // Tour 進行中時不顯示觸發按鈕
  if (state.isActive) return null;

  if (variant === 'icon') {
    return (
      <button
        onClick={startTour}
        className={`
          p-2.5 rounded-xl
          bg-slate-800/50 border border-slate-700/50
          text-slate-400 hover:text-white
          hover:bg-slate-800 hover:border-indigo-500/50
          hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]
          transition-all duration-200
          ${className}
        `}
        title="開始功能導覽"
        aria-label="開始功能導覽"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={startTour}
      className={`gap-2 ${className}`}
    >
      <Play className="w-4 h-4" />
      功能導覽
    </Button>
  );
}
