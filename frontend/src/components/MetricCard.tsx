import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'secondary';
  delay?: number;
}

const colorClasses = {
  primary: 'from-indigo-500 to-purple-500',
  accent: 'from-cyan-500 to-blue-500',
  success: 'from-emerald-500 to-teal-500',
  warning: 'from-amber-500 to-orange-500',
  secondary: 'from-pink-500 to-rose-500',
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6"
    >
      {/* Gradient background accent */}
      <div
        className={clsx(
          'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br',
          colorClasses[color]
        )}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={clsx(
              'p-3 rounded-xl bg-gradient-to-br',
              colorClasses[color]
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div
              className={clsx(
                'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg',
                trend.isPositive
                  ? 'text-emerald-400 bg-emerald-400/10'
                  : 'text-red-400 bg-red-400/10'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
        <p className="text-3xl font-bold tabular-nums">{value}</p>
        {subtitle && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
