import { motion } from 'framer-motion';
import { Calendar, Users, Target } from 'lucide-react';
import type { Campaign } from '../types';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../utils/format';

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
  index?: number;
}

export function CampaignCard({ campaign, onClick, index = 0 }: CampaignCardProps) {
  const statusColor = getStatusColor(campaign.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] cursor-pointer hover:border-[var(--primary)] transition-colors"
    >
      {/* Header with brand */}
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{campaign.brand_logo}</span>
            <div>
              <h3 className="font-semibold text-white">{campaign.name}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{campaign.brand}</p>
            </div>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${statusColor}20`,
              color: statusColor,
            }}
          >
            {getStatusLabel(campaign.status)}
          </span>
        </div>

        {/* Objectives */}
        <div className="flex flex-wrap gap-1 mt-3">
          {campaign.objectives.map((obj) => (
            <span
              key={obj}
              className="px-2 py-1 rounded-lg text-xs bg-[var(--primary)]/10 text-[var(--primary)]"
            >
              {obj}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--surface-light)]">
              <Calendar className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">活動期間</p>
              <p className="text-sm font-medium">
                {formatDate(campaign.start_date).split('年')[1]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--surface-light)]">
              <Users className="w-4 h-4 text-[var(--secondary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">合作 KOL</p>
              <p className="text-sm font-medium">{campaign.kol_count} 位</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="text-sm text-[var(--text-secondary)]">
              {campaign.target_audience}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-secondary)]">預算</p>
            <p className="font-semibold text-[var(--success)]">
              {formatCurrency(campaign.budget)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar for active campaigns */}
      {campaign.status === 'active' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--surface-light)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
          />
        </div>
      )}
    </motion.div>
  );
}
