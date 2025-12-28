import { motion } from 'framer-motion';
import { Crown, Heart, TrendingUp, BarChart3, Users, Sparkles } from 'lucide-react';
import type { DataStory } from '../types';
import clsx from 'clsx';

interface DataStoryCardProps {
  story: DataStory;
  index?: number;
  variant?: 'default' | 'featured';
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  crown: Crown,
  heart: Heart,
  'trending-up': TrendingUp,
  'bar-chart': BarChart3,
  users: Users,
  sparkles: Sparkles,
};

const typeColors: Record<string, { bg: string; text: string; glow: string }> = {
  highlight: { bg: 'from-amber-500 to-orange-500', text: 'text-amber-400', glow: 'shadow-amber-500/30' },
  engagement: { bg: 'from-pink-500 to-rose-500', text: 'text-pink-400', glow: 'shadow-pink-500/30' },
  roi: { bg: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' },
  trend: { bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-400', glow: 'shadow-indigo-500/30' },
  quality: { bg: 'from-cyan-500 to-blue-500', text: 'text-cyan-400', glow: 'shadow-cyan-500/30' },
};

export function DataStoryCard({ story, index = 0, variant = 'default' }: DataStoryCardProps) {
  const Icon = iconMap[story.icon] || Sparkles;
  const colors = typeColors[story.type] || typeColors.highlight;

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className={clsx(
          'relative overflow-hidden rounded-3xl p-8 col-span-2',
          'bg-gradient-to-br',
          colors.bg
        )}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 blur-2xl" />

        <div className="relative">
          <div className="flex items-start gap-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{story.title}</h3>
              <p className="text-lg text-white/90 mb-4">{story.content}</p>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur">
                  <p className="text-sm text-white/70">{story.metric_label}</p>
                  <p className="text-3xl font-bold text-white">{story.metric}</p>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-black/10">
                  <p className="text-sm text-white/90">💡 {story.insight}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={clsx(
        'relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6',
        'hover:shadow-xl',
        colors.glow
      )}
    >
      {/* Gradient accent */}
      <div
        className={clsx(
          'absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-30 bg-gradient-to-br',
          colors.bg
        )}
      />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={clsx('p-2 rounded-xl bg-gradient-to-br', colors.bg)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className={clsx('font-semibold', colors.text)}>{story.title}</h3>
        </div>

        <p className="text-[var(--text-primary)] mb-4">{story.content}</p>

        {story.metric && (
          <div className="flex items-baseline gap-2 mb-4">
            <span className={clsx('text-3xl font-bold', colors.text)}>
              {story.metric}
              {story.metric_label?.includes('%') && '%'}
              {story.metric_label?.includes('x') && 'x'}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              {story.metric_label?.replace('%', '').replace('x', '')}
            </span>
          </div>
        )}

        {story.data && (
          <div className="flex gap-2">
            {Object.entries(story.data).map(([key, value]) => (
              <div
                key={key}
                className="flex-1 p-2 rounded-lg bg-[var(--surface-light)] text-center"
              >
                <p className="text-xs text-[var(--text-secondary)] capitalize">{key}</p>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 rounded-xl bg-[var(--surface-light)]">
          <p className="text-sm text-[var(--text-secondary)]">
            💡 {story.insight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
