import { motion } from 'framer-motion';
import {
  Users,
  Eye,
  Megaphone,
  TrendingUp,
  Heart,
  Award,
  Zap,
  Sparkles,
  ArrowRight,
  Volume2
} from 'lucide-react';
import { useDashboardOverview, useCampaigns, useDataStories } from '../hooks/useApi';
import { KOLCard } from '../components/KOLCard';
import { CampaignCard } from '../components/CampaignCard';
import {
  ChartContainer,
  PlatformDistributionChart,
  CategoryBarChart
} from '../components/Charts';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Progress } from '../components/ui/progress';
import { formatNumber } from '../utils/format';
import { cn } from '../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectKOL: (id: string) => void;
  onSelectCampaign: (id: string) => void;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  gradient: string;
  delay: number;
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, gradient, delay }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="relative overflow-hidden card-hover">
        <div className={cn("absolute inset-0 opacity-20", gradient)} />
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-3 rounded-xl", gradient)}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
              <Badge variant={trend.isPositive ? "success" : "destructive"} className="font-medium">
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </Badge>
            )}
          </div>
          <p className="text-4xl font-bold mb-1 tabular-nums animate-count-up">
            {value}
          </p>
          <p className="text-sm font-medium text-slate-300">{title}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}

export function DashboardPage({ onNavigate, onSelectKOL, onSelectCampaign }: DashboardPageProps) {
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: campaignsData } = useCampaigns('active');
  const { data: storiesData } = useDataStories();

  if (overviewLoading) {
    return <LoadingSkeleton />;
  }

  const stories = storiesData?.stories?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 animate-pulse-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gradient">影響力數據總覽</h1>
          </div>
          <p className="text-slate-400">
            洞察 KOL 影響力、Campaign 成效與輿情趨勢
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-slate-300">即時數據更新</span>
          </div>
          <Button variant="glow" onClick={() => onNavigate('stories')}>
            <Volume2 className="w-4 h-4" />
            查看數據故事
          </Button>
        </div>
      </motion.div>

      {/* Hero Metrics - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <MetricCard
          title="KOL 總數"
          value={overview?.total_kols || 0}
          subtitle="已建檔 KOL"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          gradient="bg-gradient-to-br from-indigo-500 to-purple-500"
          delay={0}
        />
        <MetricCard
          title="總觸及人數"
          value={formatNumber(overview?.total_reach || 0)}
          subtitle="潛在受眾規模"
          icon={Eye}
          trend={{ value: 8, isPositive: true }}
          gradient="bg-gradient-to-br from-cyan-500 to-blue-500"
          delay={0.1}
        />
        <MetricCard
          title="進行中 Campaign"
          value={overview?.active_campaigns || 0}
          subtitle={`已完成 ${overview?.completed_campaigns || 0} 個`}
          icon={Megaphone}
          gradient="bg-gradient-to-br from-pink-500 to-rose-500"
          delay={0.2}
        />
        <MetricCard
          title="平均 ROI"
          value={`${overview?.avg_roi || 0}x`}
          subtitle="投資報酬率"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
          delay={0.3}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-500">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">平均互動率</p>
                  <p className="text-xs text-slate-400">跨平台平均</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-amber-400 tabular-nums">
                  {overview?.avg_engagement_rate || 0}%
                </p>
                <Badge variant="success" className="mb-1">高於業界</Badge>
              </div>
              <Progress value={(overview?.avg_engagement_rate || 0) * 10} className="mt-3" indicatorClassName="bg-gradient-to-r from-amber-400 to-orange-500" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-violet-500">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">總互動數</p>
                  <p className="text-xs text-slate-400">所有 Campaign 累計</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-violet-400 tabular-nums">
                {formatNumber(overview?.total_engagement || 0)}
              </p>
              <p className="text-xs text-slate-500 mt-2">相較上月 +18.5%</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">已完成 Campaign</p>
                  <p className="text-xs text-slate-400">成功執行的活動</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                {overview?.completed_campaigns || 0}
              </p>
              <p className="text-xs text-slate-500 mt-2">100% 達成目標</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {overview?.platform_distribution && (
          <ChartContainer
            title="平台分佈"
            subtitle="KOL 在各平台的分佈情況"
            delay={0.7}
          >
            <PlatformDistributionChart data={overview.platform_distribution} />
          </ChartContainer>
        )}

        {overview?.category_insights && (
          <ChartContainer
            title="類別分析"
            subtitle="各內容類別的 KOL 數量"
            delay={0.8}
          >
            <CategoryBarChart data={overview.category_insights} />
          </ChartContainer>
        )}
      </div>

      {/* Data Stories Preview */}
      {stories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-semibold">數據故事</h2>
              <Badge variant="glow">關鍵洞察</Badge>
            </div>
            <Button variant="ghost" onClick={() => onNavigate('stories')}>
              查看全部
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Card className="h-full card-hover group">
                  <CardContent className="p-5">
                    <Badge variant="outline" className="mb-3">
                      {story.category || story.type}
                    </Badge>
                    <h3 className="font-semibold mb-2 group-hover:text-gradient transition-all">
                      {story.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {story.content}
                    </p>
                    {story.metric !== undefined && (
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <p className="text-2xl font-bold text-gradient tabular-nums">
                          {typeof story.metric === 'number' && story.metric > 1000
                            ? formatNumber(story.metric)
                            : story.metric}
                        </p>
                        <p className="text-xs text-slate-500">{story.metric_label}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Top KOLs */}
      {overview?.top_kols && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">頂尖 KOL</h2>
              <p className="text-sm text-slate-400">
                影響力指數最高的創作者
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('kols')}>
              探索更多
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {overview.top_kols.map((kol, index) => (
              <KOLCard
                key={kol.id}
                kol={kol}
                index={index}
                onClick={() => onSelectKOL(kol.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Campaigns */}
      {campaignsData?.campaigns && campaignsData.campaigns.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">進行中的 Campaign</h2>
              <p className="text-sm text-slate-400">
                目前正在執行的行銷活動
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('campaigns')}>
              查看全部
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaignsData.campaigns.slice(0, 3).map((campaign, index) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                index={index}
                onClick={() => onSelectCampaign(campaign.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
