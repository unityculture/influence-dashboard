import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TourOverlay } from './TourOverlay';
import { TourTooltip } from './TourTooltip';
import type { TourStep, TourState, TourContextValue } from '../../types/tour';

const TourContext = createContext<TourContextValue | null>(null);

export function useTourContext() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within TourProvider');
  }
  return context;
}

interface TourProviderProps {
  children: ReactNode;
  steps: TourStep[];
  onComplete?: () => void;
}

export function TourProvider({ children, steps, onComplete }: TourProviderProps) {
  const [state, setState] = useState<TourState>({
    isActive: false,
    currentStep: 0,
    steps,
  });

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // 計算目標元素位置
  useEffect(() => {
    if (!state.isActive) {
      setTargetRect(null);
      return;
    }

    const currentStep = state.steps[state.currentStep];
    if (!currentStep) return;

    const updateTargetRect = () => {
      const targetElement = document.querySelector(`[data-tour-id="${currentStep.targetId}"]`);

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetRect(rect);

        // 滾動到目標元素
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // 初始更新
    updateTargetRect();

    // 監聽視窗大小變化
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect);

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect);
    };
  }, [state.isActive, state.currentStep, state.steps]);

  // ESC 鍵關閉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isActive) {
        skipTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isActive]);

  const startTour = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true, currentStep: 0 }));
  }, []);

  const endTour = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false }));
    onComplete?.();
  }, [onComplete]);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep >= prev.steps.length - 1) {
        onComplete?.();
        return { ...prev, isActive: false };
      }
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  }, [onComplete]);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const goToStep = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(Math.max(0, index), prev.steps.length - 1),
    }));
  }, []);

  const skipTour = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false }));
  }, []);

  const value: TourContextValue = {
    state,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    skipTour,
  };

  const currentStepData = state.steps[state.currentStep];

  return (
    <TourContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {state.isActive && targetRect && currentStepData && (
          <>
            <TourOverlay
              targetRect={targetRect}
              padding={currentStepData.spotlightPadding ?? 12}
            />
            <TourTooltip
              step={currentStepData}
              targetRect={targetRect}
              currentIndex={state.currentStep}
              totalSteps={state.steps.length}
              onNext={nextStep}
              onPrev={prevStep}
              onSkip={skipTour}
            />
          </>
        )}
      </AnimatePresence>
    </TourContext.Provider>
  );
}
