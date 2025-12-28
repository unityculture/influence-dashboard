import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Users, Heart, BarChart3 } from 'lucide-react';
import { useKOLDetail } from '../hooks/useApi';
import { formatNumber, getPlatformIcon, getInfluenceLevel } from '../utils/format';
import { AudienceAgeChart, GenderChart } from './Charts';

interface KOLDetailModalProps {
  kolId: string | null;
  onClose: () => void;
}

export function KOLDetailModal({ kolId, onClose }: KOLDetailModalProps) {
  const { data: kol, isLoading } = useKOLDetail(kolId || '');

  if (!kolId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--surface)] rounded-3xl border border-[var(--border)]"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-[var(--text-secondary)]">載入中...</p>
            </div>
          ) : kol ? (
            <>
              {/* Header */}
              <div className="relative p-6 border-b border-[var(--border)]">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--surface-light)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-6">
                  <img
                    src={kol.avatar}
                    alt={kol.name}
                    className="w-24 h-24 rounded-2xl bg-[var(--surface-light)]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{kol.name}</h2>
                      <span className="text-2xl">{getPlatformIcon(kol.platform)}</span>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: `${getInfluenceLevel(kol.influence_score).color}20`,
                          color: getInfluenceLevel(kol.influence_score).color,
                        }}
                      >
                        {getInfluenceLevel(kol.influence_score).label} KOL
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] mb-3">
                      {kol.category} · {formatNumber(kol.followers)} 粉絲
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {kol.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-lg text-xs bg-[var(--surface-light)] text-[var(--text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--text-secondary)]">報價區間</p>
                    <p className="font-semibold text-[var(--success)]">{kol.price_range}</p>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="p-6 border-b border-[var(--border)]">
                <h3 className="font-semibold mb-4">核心指標</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-sm text-[var(--text-secondary)]">影響力指數</span>
                    </div>
                    <p className="text-2xl font-bold">{kol.influence_score}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span className="text-sm text-[var(--text-secondary)]">互動率</span>
                    </div>
                    <p className="text-2xl font-bold">{kol.engagement_rate}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-[var(--text-secondary)]">真實性</span>
                    </div>
                    <p className="text-2xl font-bold">{kol.authenticity_score}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-[var(--text-secondary)]">受眾品質</span>
                    </div>
                    <p className="text-2xl font-bold">{kol.audience_quality_score}</p>
                  </div>
                </div>
              </div>

              {/* Audience Demographics */}
              {kol.audience_demographics && (
                <div className="p-6 border-b border-[var(--border)]">
                  <h3 className="font-semibold mb-4">受眾分析</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm text-[var(--text-secondary)] mb-3">年齡分佈</h4>
                      <AudienceAgeChart data={kol.audience_demographics.age_groups} />
                    </div>
                    <div>
                      <h4 className="text-sm text-[var(--text-secondary)] mb-3">性別分佈</h4>
                      <GenderChart data={kol.audience_demographics.gender} />

                      <h4 className="text-sm text-[var(--text-secondary)] mt-6 mb-3">地區分佈</h4>
                      <div className="space-y-2">
                        {Object.entries(kol.audience_demographics.locations)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([location, percentage]) => (
                            <div key={location} className="flex items-center gap-2">
                              <span className="text-sm w-16">{location}</span>
                              <div className="flex-1 h-2 rounded-full bg-[var(--surface-light)]">
                                <div
                                  className="h-full rounded-full bg-[var(--primary)]"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-[var(--text-secondary)] w-12 text-right">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mt-6">
                    <h4 className="text-sm text-[var(--text-secondary)] mb-3">興趣標籤</h4>
                    <div className="flex flex-wrap gap-2">
                      {kol.audience_demographics.interests.map((interest) => (
                        <span
                          key={interest.name}
                          className="px-3 py-1.5 rounded-lg text-sm bg-[var(--primary)]/10 text-[var(--primary)]"
                        >
                          {interest.name} {interest.percentage.toFixed(0)}%
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Brand Fit */}
              <div className="p-6">
                <h3 className="font-semibold mb-4">品牌適配性</h3>
                <div className="flex flex-wrap gap-2">
                  {kol.brand_fit_tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg text-sm bg-[var(--accent)]/10 text-[var(--accent)]"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-[var(--text-secondary)]">
                  已完成 {kol.collaboration_count} 次品牌合作
                </p>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-[var(--text-secondary)]">找不到 KOL 資料</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
