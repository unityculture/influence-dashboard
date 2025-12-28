import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, X } from 'lucide-react';
import { useCampaigns, useCampaignDetail } from '../hooks/useApi';
import { CampaignCard } from '../components/CampaignCard';
import {
  ChartContainer,
  EngagementTrendChart,
  SentimentChart
} from '../components/Charts';
import { formatNumber, formatCurrency } from '../utils/format';
import clsx from 'clsx';

const statusTabs = [
  { id: 'all', label: '全部' },
  { id: 'active', label: '進行中' },
  { id: 'completed', label: '已完成' },
  { id: 'planning', label: '規劃中' },
];

export function CampaignsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const { data: campaignsData, isLoading } = useCampaigns(
    selectedStatus === 'all' ? undefined : selectedStatus
  );
  const { data: campaignDetail } = useCampaignDetail(selectedCampaignId || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Campaign 管理</h1>
          <p className="text-[var(--text-secondary)]">
            追蹤與分析行銷活動成效
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          新增 Campaign
        </button>
      </motion.div>

      {/* Status Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2"
      >
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              selectedStatus === tab.id
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              {campaignsData?.total || 0} 個 Campaign
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              {campaignsData?.campaigns.map((campaign, index) => (
                <div
                  key={campaign.id}
                  className={clsx(
                    'transition-all duration-200',
                    selectedCampaignId === campaign.id && 'ring-2 ring-[var(--primary)] rounded-2xl'
                  )}
                >
                  <CampaignCard
                    campaign={campaign}
                    index={index}
                    onClick={() => setSelectedCampaignId(campaign.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campaign Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedCampaignId && campaignDetail ? (
              <motion.div
                key={campaignDetail.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Campaign Header */}
                <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{campaignDetail.brand_logo}</span>
                      <div>
                        <h2 className="text-2xl font-bold">{campaignDetail.name}</h2>
                        <p className="text-[var(--text-secondary)]">
                          {campaignDetail.brand} · {campaignDetail.industry}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCampaignId(null)}
                      className="p-2 rounded-lg hover:bg-[var(--surface-light)] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Key Metrics */}
                  {campaignDetail.performance && (
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">總觸及</p>
                        <p className="text-2xl font-bold">
                          {formatNumber(campaignDetail.performance.total_reach)}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">總互動</p>
                        <p className="text-2xl font-bold">
                          {formatNumber(campaignDetail.performance.total_engagement)}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">互動率</p>
                        <p className="text-2xl font-bold text-[var(--accent)]">
                          {campaignDetail.performance.engagement_rate}%
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">ROI</p>
                        <p className="text-2xl font-bold text-[var(--success)]">
                          {campaignDetail.performance.roi_estimate}x
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance Charts */}
                {campaignDetail.performance && (
                  <div className="grid grid-cols-2 gap-6">
                    <ChartContainer
                      title="成效趨勢"
                      subtitle="每日觸及與互動數據"
                    >
                      <EngagementTrendChart
                        data={campaignDetail.performance.daily_metrics}
                      />
                    </ChartContainer>

                    <ChartContainer
                      title="情緒分析"
                      subtitle="受眾回饋情緒分佈"
                    >
                      <SentimentChart
                        positive={campaignDetail.performance.sentiment_positive}
                        neutral={campaignDetail.performance.sentiment_neutral}
                        negative={campaignDetail.performance.sentiment_negative}
                      />
                    </ChartContainer>
                  </div>
                )}

                {/* Participating KOLs */}
                {campaignDetail.kols && (
                  <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6">
                    <h3 className="font-semibold mb-4">參與 KOL ({campaignDetail.kols.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {campaignDetail.kols.map((kol) => (
                        <div
                          key={kol.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-light)]"
                        >
                          <img
                            src={kol.avatar}
                            alt={kol.name}
                            className="w-10 h-10 rounded-lg"
                          />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{kol.name}</p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              {formatNumber(kol.followers)} 粉絲
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cost Analysis */}
                {campaignDetail.performance && (
                  <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6">
                    <h3 className="font-semibold mb-4">成本分析</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">總預算</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(campaignDetail.budget)}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">CPE</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(campaignDetail.performance.cost_per_engagement)}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--surface-light)]">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">CPM</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(campaignDetail.performance.cost_per_reach)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-96 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
              >
                <Filter className="w-12 h-12 text-[var(--text-secondary)] mb-4" />
                <p className="text-[var(--text-secondary)]">
                  選擇一個 Campaign 來查看詳細資料
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
