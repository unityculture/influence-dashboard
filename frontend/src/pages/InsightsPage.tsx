import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Volume2,
  Heart,
  Search,
  Filter
} from 'lucide-react';
import { useBuzzTrends, useDashboardOverview } from '../hooks/useApi';
import {
  ChartContainer,
  BuzzTrendChart,
  PlatformDistributionChart,
  CategoryBarChart
} from '../components/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { formatNumber } from '../utils/format';
import { cn } from '../lib/utils';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

export function InsightsPage() {
  const [selectedKeyword, setSelectedKeyword] = useState<string | undefined>();
  const { data: buzzData, isLoading: buzzLoading } = useBuzzTrends(selectedKeyword);
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();

  // 處理輿情趨勢數據
  const trendData = buzzData?.trends
    ? Object.entries(
        buzzData.trends.reduce((acc, item) => {
          if (!acc[item.date]) {
            acc[item.date] = { date: item.date, volume: 0, sentiment: 0, count: 0 };
          }
          acc[item.date].volume += item.volume;
          acc[item.date].sentiment += item.sentiment;
          acc[item.date].count += 1;
          return acc;
        }, {} as Record<string, { date: string; volume: number; sentiment: number; count: number }>)
      ).map(([, value]) => ({
        date: value.date,
        volume: value.volume,
        sentiment: value.sentiment / value.count,
      }))
    : [];

  if (overviewLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">數據洞察</h1>
        </div>
        <p className="text-slate-400">
          深度分析輿情趨勢、市場動態與平台表現
        </p>
      </motion.div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-500">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">聲量趨勢</h3>
              </div>
              <p className="text-4xl font-bold text-gradient mb-2">+23.5%</p>
              <p className="text-sm text-slate-400">
                相較上週，整體聲量成長顯著
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">情緒指數</h3>
              </div>
              <p className="text-4xl font-bold text-gradient-accent mb-2">0.72</p>
              <p className="text-sm text-slate-400">
                正面情緒佔比維持在 72%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-pink-500">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">互動效率</h3>
              </div>
              <p className="text-4xl font-bold text-gradient mb-2">{overview?.avg_engagement_rate || 0}%</p>
              <p className="text-sm text-slate-400">
                平均互動率高於業界標準
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Keyword Filter */}
      {buzzData?.keywords && buzzData.keywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Filter className="w-4 h-4" />
                  <span>關鍵字篩選：</span>
                </div>
                <Button
                  variant={!selectedKeyword ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedKeyword(undefined)}
                >
                  全部
                </Button>
                {buzzData.keywords.map((keyword) => (
                  <Button
                    key={keyword}
                    variant={selectedKeyword === keyword ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedKeyword(keyword)}
                  >
                    {keyword}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Charts */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trends">
            <Volume2 className="w-4 h-4 mr-2" />
            輿情趨勢
          </TabsTrigger>
          <TabsTrigger value="platform">
            <PieChart className="w-4 h-4 mr-2" />
            平台分析
          </TabsTrigger>
          <TabsTrigger value="category">
            <BarChart3 className="w-4 h-4 mr-2" />
            類別分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="輿情趨勢分析"
              subtitle="聲量與情緒的時間序列變化"
              delay={0.5}
            >
              {buzzLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                </div>
              ) : trendData.length > 0 ? (
                <BuzzTrendChart data={trendData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>暫無輿情數據</p>
                  </div>
                </div>
              )}
            </ChartContainer>

            {overview?.platform_distribution && (
              <ChartContainer
                title="平台效益分析"
                subtitle="各平台的 KOL 分佈與互動效率"
                delay={0.6}
              >
                <PlatformDistributionChart data={overview.platform_distribution} />
              </ChartContainer>
            )}
          </div>
        </TabsContent>

        <TabsContent value="platform">
          {overview?.platform_distribution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>平台效益比較</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-slate-400 border-b border-slate-800">
                          <th className="pb-4 font-medium">平台</th>
                          <th className="pb-4 font-medium">KOL 數量</th>
                          <th className="pb-4 font-medium">總粉絲數</th>
                          <th className="pb-4 font-medium">平均互動率</th>
                          <th className="pb-4 font-medium">平均影響力</th>
                          <th className="pb-4 font-medium">趨勢</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(overview.platform_distribution).map(([platform, stats]) => (
                          <tr key={platform} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-4">
                              <Badge variant="outline" className="capitalize font-medium">
                                {platform}
                              </Badge>
                            </td>
                            <td className="py-4 tabular-nums">{stats.count}</td>
                            <td className="py-4 tabular-nums">{formatNumber(stats.total_followers)}</td>
                            <td className="py-4">
                              <span className="text-emerald-400 font-medium tabular-nums">
                                {stats.avg_engagement}%
                              </span>
                            </td>
                            <td className="py-4 tabular-nums">{stats.avg_influence}</td>
                            <td className="py-4">
                              <span className="flex items-center gap-1 text-emerald-400 text-sm">
                                <TrendingUp className="w-4 h-4" />
                                穩定
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="category">
          {overview?.category_insights && (
            <ChartContainer
              title="內容類別深度分析"
              subtitle="各類別的 KOL 數量與平均互動率"
              delay={0.7}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryBarChart data={overview.category_insights} />
                <div className="space-y-3">
                  {[...overview.category_insights]
                    .sort((a, b) => b.avg_engagement - a.avg_engagement)
                    .slice(0, 6)
                    .map((cat, index) => (
                      <motion.div
                        key={cat.category}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                              index === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" :
                              index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900" :
                              index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
                              "bg-slate-700 text-slate-300"
                            )}
                          >
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{cat.category}</p>
                            <p className="text-xs text-slate-400">
                              {cat.kol_count} 位 KOL · 觸及 {formatNumber(cat.total_reach)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-400 tabular-nums">
                            {cat.avg_engagement}%
                          </p>
                          <p className="text-xs text-slate-400">平均互動率</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </ChartContainer>
          )}
        </TabsContent>
      </Tabs>

      {/* Key Takeaways */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <CardTitle>關鍵洞察摘要</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  成長機會
                </h4>
                <p className="text-sm text-slate-400">
                  TikTok 平台互動率持續上升，建議增加該平台 KOL 合作比重
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  精準定位
                </h4>
                <p className="text-sm text-slate-400">
                  美妝與時尚類別 KOL 的受眾品質分數最高，適合高端品牌合作
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  優化建議
                </h4>
                <p className="text-sm text-slate-400">
                  中型 KOL (10-50萬粉絲) 的 CP 值最高，建議作為主要合作對象
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  風險提醒
                </h4>
                <p className="text-sm text-slate-400">
                  部分科技類 KOL 情緒分數波動較大，建議加強事前評估
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
