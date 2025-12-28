import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import type { KOL } from '../types';
import { formatNumber, getPlatformIcon, getInfluenceLevel } from '../utils/format';

interface KOLCardProps {
  kol: KOL;
  onClick?: () => void;
  index?: number;
}

export function KOLCard({ kol, onClick, index = 0 }: KOLCardProps) {
  const influenceLevel = getInfluenceLevel(kol.influence_score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 cursor-pointer hover:border-[var(--primary)] transition-colors"
    >
      {/* Top badge */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="text-lg">{getPlatformIcon(kol.platform)}</span>
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${influenceLevel.color}20`,
            color: influenceLevel.color,
          }}
        >
          {influenceLevel.label}
        </span>
      </div>

      {/* Avatar & Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img
            src={kol.avatar}
            alt={kol.name}
            className="w-16 h-16 rounded-xl bg-[var(--surface-light)] object-cover"
          />
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[var(--surface)] flex items-center justify-center text-xs"
            style={{ backgroundColor: influenceLevel.color }}
          >
            {kol.influence_score >= 80 ? '★' : ''}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-[var(--primary)] transition-colors">
            {kol.name}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">{kol.category}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {formatNumber(kol.followers)} 粉絲
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-[var(--surface-light)]">
          <div className="flex items-center justify-center gap-1 text-pink-400 mb-1">
            <Heart className="w-3 h-3" />
            <span className="text-xs">讚</span>
          </div>
          <p className="font-semibold text-sm">{formatNumber(kol.avg_likes)}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--surface-light)]">
          <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
            <MessageCircle className="w-3 h-3" />
            <span className="text-xs">留言</span>
          </div>
          <p className="font-semibold text-sm">{formatNumber(kol.avg_comments)}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[var(--surface-light)]">
          <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
            <Share2 className="w-3 h-3" />
            <span className="text-xs">分享</span>
          </div>
          <p className="font-semibold text-sm">{formatNumber(kol.avg_shares)}</p>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--text-secondary)]">影響力指數</span>
          <span className="font-semibold" style={{ color: influenceLevel.color }}>
            {kol.influence_score}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface-light)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${kol.influence_score}%` }}
            transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
            className="h-full rounded-full"
            style={{ backgroundColor: influenceLevel.color }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {kol.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-xs bg-[var(--surface-light)] text-[var(--text-secondary)]"
          >
            {tag}
          </span>
        ))}
        {kol.tags.length > 3 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--surface-light)] text-[var(--text-secondary)]">
            +{kol.tags.length - 3}
          </span>
        )}
      </div>

      {/* Engagement rate badge */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--surface-light)]">
        <TrendingUp className="w-3 h-3 text-emerald-400" />
        <span className="text-xs font-medium text-emerald-400">
          {kol.engagement_rate}%
        </span>
      </div>
    </motion.div>
  );
}
