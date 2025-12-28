import { motion } from 'framer-motion';
import {
  BookOpen,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Zap,
  Crown,
  Heart,
  BarChart3,
  Volume2,
  Database,
  Sparkles
} from 'lucide-react';
import { useDataStories, useDashboardOverview, useCampaigns } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';
import { formatNumber } from '../utils/format';
import { cn } from '../lib/utils';

const iconMap: Record<string, React.ElementType> = {
  volume: Volume2,
  heart: Heart,
  crown: Crown,
  zap: Zap,
  'trending-up': TrendingUp,
  'bar-chart': BarChart3,
  users: Users,
  target: Target,
};

const categoryColors: Record<string, string> = {
  '輿情分析': 'from-cyan-500 to-blue-500',
  'KOL 分析': 'from-purple-500 to-pink-500',
  '成效驗證': 'from-green-500 to-emerald-500',
  '市場洞察': 'from-amber-500 to-orange-500',
  '深度分析': 'from-indigo-500 to-violet-500',
  '智慧推薦': 'from-rose-500 to-pink-500',
};

interface DataStory {
  id: string;
  title: string;
  type: string;
  icon: string;
  category?: string;
  content: string;
  insight: string;
  metric?: number;
  metric_label?: string;
  data_source?: string;
  data?: Record<string, number>;
}

function StoryCard({ story, index }: { story: DataStory; index: number }) {
  const Icon = iconMap[story.icon] || Lightbulb;
  const gradientClass = story.category ? categoryColors[story.category] || 'from-slate-500 to-slate-600' : 'from-indigo-500 to-purple-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="h-full card-hover group overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
              gradientClass
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {story.category && (
              <Badge variant="glow" className="text-xs">
                {story.category}
              </Badge>
            )}
          </div>
          <CardTitle className="mt-4 text-lg group-hover:text-gradient transition-all">
            {story.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            {story.content}
          </p>

          {story.metric !== undefined && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <p className="text-3xl font-bold text-gradient tabular-nums">
                {typeof story.metric === 'number' && story.metric > 1000
                  ? formatNumber(story.metric)
                  : story.metric}
              </p>
              <p className="text-xs text-slate-400 mt-1">{story.metric_label}</p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                {story.insight}
              </p>
            </div>
          </div>

          {story.data_source && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Database className="w-3 h-3" />
              <span>資料來源：{story.data_source}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function StoriesPage() {
  const { data: storiesData, isLoading } = useDataStories();
  const { data: overview } = useDashboardOverview();
  const { data: campaignsData } = useCampaigns();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const stories = storiesData?.stories || [];
  const dataSources = (storiesData as { data_sources?: Array<{ name: string; type: string; description: string }> })?.data_sources || [];
  const keyMetrics = (storiesData as { key_metrics?: { total_buzz_volume?: number; avg_sentiment?: number } })?.key_metrics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">數據故事</h1>
        </div>
        <p className="text-slate-400">
          透過數據說故事，將洞察轉化為可行動的商業價值
        </p>
      </motion.div>

      {/* Hero Story - Data Power */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/10 blur-2xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-amber-200 text-sm font-medium">Powered by AI & 輿情數據</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            影響力行銷的數據力量
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl">
            我們分析了 {overview?.total_kols || 0} 位 KOL、{campaignsData?.total || 0} 個 Campaign，
            結合輿情聲量與情緒分析，挖掘出這些關鍵洞察。
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <p className="text-white/70 text-sm mb-1">總觸及潛力</p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {formatNumber(overview?.total_reach || 0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <p className="text-white/70 text-sm mb-1">輿情總聲量</p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {formatNumber(keyMetrics?.total_buzz_volume || 0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <p className="text-white/70 text-sm mb-1">正面情緒佔比</p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {keyMetrics?.avg_sentiment || 0}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <p className="text-white/70 text-sm mb-1">平均 ROI</p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {overview?.avg_roi || 0}x
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Sources */}
      {dataSources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            數據來源
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dataSources.map((source, index) => (
              <Card key={index} className="bg-slate-900/50">
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">{source.type}</Badge>
                  <p className="font-medium text-sm">{source.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{source.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      <Separator />

      {/* Story Grid */}
      {stories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            關鍵發現
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Strategic Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-400" />
          策略建議
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* KOL Selection Strategy */}
          <Card glow>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <CardTitle>KOL 選擇策略</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  精準匹配
                </h4>
                <p className="text-sm text-slate-400">
                  根據受眾品質分數與品牌適配性標籤，精準篩選最適合的 KOL，
                  確保投放效益最大化。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  數據驅動
                </h4>
                <p className="text-sm text-slate-400">
                  結合影響力指數、互動率與情緒分數，建立完整的 KOL 評估模型，
                  降低合作風險。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  預算優化
                </h4>
                <p className="text-sm text-slate-400">
                  中型 KOL (10-50萬粉絲) 通常具有最佳的成本效益比，
                  建議作為主要合作對象。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Optimization */}
          <Card glow>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <CardTitle>Campaign 優化</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  輿情監測
                </h4>
                <p className="text-sm text-slate-400">
                  透過 Q-Search 即時追蹤活動相關討論聲量與情緒變化，
                  及早發現潛在危機並調整策略。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  多平台整合
                </h4>
                <p className="text-sm text-slate-400">
                  跨平台 Campaign 的整體觸及率提升 35%，
                  建議同時佈局 Instagram 與 TikTok。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  持續追蹤
                </h4>
                <p className="text-sm text-slate-400">
                  活動期間每日監控輿情變化與情緒指標，
                  及時調整內容策略與危機處理。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-semibold">為什麼選擇數據驅動的影響力行銷？</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gradient mb-2">3.2x</div>
            <p className="font-medium mb-1">更高的 ROI</p>
            <p className="text-sm text-slate-400">
              相較傳統廣告投放，KOL 行銷帶來更高的投資報酬
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gradient-accent mb-2">68%</div>
            <p className="font-medium mb-1">消費者信任</p>
            <p className="text-sm text-slate-400">
              消費者更信任 KOL 推薦，轉換率顯著提升
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gradient mb-2">45%</div>
            <p className="font-medium mb-1">品牌認知提升</p>
            <p className="text-sm text-slate-400">
              透過精準 KOL 合作，品牌知名度大幅成長
            </p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl font-bold mb-4">
          準備好讓數據驅動您的影響力行銷了嗎？
        </h2>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
          我們的平台整合 Q-Search 輿情系統、KOL 分析與 Campaign 追蹤功能，
          協助您做出更聰明的行銷決策。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg">
            開始免費試用
          </Button>
          <Button variant="outline" size="lg">
            預約 Demo
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
