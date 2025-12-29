import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import type { TourStep } from '../../types/tour';

interface TourTooltipProps {
  step: TourStep;
  targetRect: DOMRect;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export function TourTooltip({
  step,
  targetRect,
  currentIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
}: TourTooltipProps) {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const tooltipWidth = 380;
  const tooltipOffset = 20;

  // 計算 tooltip 位置
  useEffect(() => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let left = 0;
    let top = 0;

    switch (step.position) {
      case 'bottom':
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        top = targetRect.bottom + tooltipOffset;
        break;
      case 'top':
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        top = targetRect.top - tooltipOffset - 280; // 預估高度
        break;
      case 'left':
        left = targetRect.left - tooltipWidth - tooltipOffset;
        top = targetRect.top + targetRect.height / 2 - 140;
        break;
      case 'right':
        left = targetRect.right + tooltipOffset;
        top = targetRect.top + targetRect.height / 2 - 140;
        break;
    }

    // 邊界檢查
    left = Math.max(16, Math.min(left, viewport.width - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, viewport.height - 300));

    setPosition({ left, top });
  }, [step.position, targetRect, tooltipWidth]);

  const isLastStep = currentIndex === totalSteps - 1;
  const isFirstStep = currentIndex === 0;

  // 計算動畫方向
  const getAnimationProps = () => {
    switch (step.position) {
      case 'top':
        return { initial: { y: 10 }, animate: { y: 0 } };
      case 'bottom':
        return { initial: { y: -10 }, animate: { y: 0 } };
      case 'left':
        return { initial: { x: 10 }, animate: { x: 0 } };
      case 'right':
        return { initial: { x: -10 }, animate: { x: 0 } };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, ...animationProps.initial }}
      animate={{ opacity: 1, scale: 1, ...animationProps.animate }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed z-[9999]"
      style={{
        left: position.left,
        top: position.top,
        width: tooltipWidth,
      }}
    >
      <div className="relative rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* 頂部漸層裝飾 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500" />

        {/* 關閉按鈕 */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
          aria-label="關閉導覽"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* 步驟指示器 */}
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </motion.div>
            <span className="text-xs font-medium text-indigo-400 tracking-wide">
              步驟 {currentIndex + 1} / {totalSteps}
            </span>
          </div>

          {/* 標題 */}
          <h3 className="text-xl font-bold text-white mb-3 pr-8 leading-tight">
            {step.title}
          </h3>

          {/* 內容 */}
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {step.content}
          </p>

          {/* 進度條 */}
          <div className="flex items-center justify-center gap-1.5 mb-5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  width: i === currentIndex ? 24 : 8,
                  backgroundColor: i === currentIndex
                    ? 'rgb(99, 102, 241)'
                    : i < currentIndex
                      ? 'rgb(99, 102, 241)'
                      : 'rgb(51, 65, 85)',
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
                style={{
                  boxShadow: i === currentIndex
                    ? '0 0 8px rgba(99, 102, 241, 0.5)'
                    : 'none',
                }}
              />
            ))}
          </div>

          {/* 導航按鈕 */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-slate-400 hover:text-white text-sm"
            >
              跳過導覽
            </Button>

            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrev}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一步
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={onNext}
                className="gap-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 border-0"
              >
                {isLastStep ? '開始探索' : '下一步'}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 底部光暈效果 */}
        <div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>
    </motion.div>
  );
}
