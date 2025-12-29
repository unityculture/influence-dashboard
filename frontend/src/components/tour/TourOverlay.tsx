import { motion } from 'framer-motion';

interface TourOverlayProps {
  targetRect: DOMRect;
  padding: number;
}

export function TourOverlay({ targetRect, padding }: TourOverlayProps) {
  const spotlightX = targetRect.left - padding;
  const spotlightY = targetRect.top - padding;
  const spotlightWidth = targetRect.width + padding * 2;
  const spotlightHeight = targetRect.height + padding * 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9998] pointer-events-none"
    >
      {/* 使用 SVG mask 實現 spotlight 挖空效果 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <defs>
          <mask id="spotlight-mask">
            {/* 白色背景 = 顯示 */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* 黑色區域 = 挖空（透明） */}
            <motion.rect
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              x={spotlightX}
              y={spotlightY}
              width={spotlightWidth}
              height={spotlightHeight}
              rx="16"
              ry="16"
              fill="black"
            />
          </mask>
        </defs>
        {/* 遮罩層 */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.8)"
          mask="url(#spotlight-mask)"
          style={{ backdropFilter: 'blur(2px)' }}
        />
      </svg>

      {/* Spotlight 霓虹光暈邊框 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="absolute rounded-2xl pointer-events-none"
        style={{
          left: spotlightX,
          top: spotlightY,
          width: spotlightWidth,
          height: spotlightHeight,
          border: '2px solid rgba(99, 102, 241, 0.6)',
          boxShadow: `
            0 0 20px rgba(99, 102, 241, 0.4),
            0 0 40px rgba(6, 182, 212, 0.3),
            inset 0 0 20px rgba(99, 102, 241, 0.1)
          `,
        }}
      />

      {/* 呼吸動畫光暈 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute rounded-2xl pointer-events-none"
        style={{
          left: spotlightX - 4,
          top: spotlightY - 4,
          width: spotlightWidth + 8,
          height: spotlightHeight + 8,
          border: '1px solid rgba(6, 182, 212, 0.3)',
        }}
      />
    </motion.div>
  );
}
