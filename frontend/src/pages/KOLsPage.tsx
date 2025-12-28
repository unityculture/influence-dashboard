import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { useKOLs } from '../hooks/useApi';
import { KOLCard } from '../components/KOLCard';
import clsx from 'clsx';

interface KOLsPageProps {
  onSelectKOL: (id: string) => void;
}

const platforms = [
  { id: 'all', label: '全部' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'facebook', label: 'Facebook' },
];

const categories = [
  '全部', '美妝', '時尚', '美食', '旅遊', '科技', '生活風格', '親子', '健身', '遊戲', '教育'
];

const sortOptions = [
  { id: 'influence_score', label: '影響力' },
  { id: 'followers', label: '粉絲數' },
  { id: 'engagement_rate', label: '互動率' },
  { id: 'sentiment_score', label: '情緒分數' },
];

export function KOLsPage({ onSelectKOL }: KOLsPageProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('influence_score');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading } = useKOLs({
    platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
    category: selectedCategory === '全部' ? undefined : selectedCategory,
    sort_by: sortBy,
    limit: 50,
  });

  const filteredKOLs = data?.kols.filter(
    (kol) =>
      !searchQuery ||
      kol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kol.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">KOL 探索</h1>
        <p className="text-[var(--text-secondary)]">
          瀏覽、篩選並找到最適合您品牌的創作者
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="搜尋 KOL 名稱或標籤..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Platform tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                selectedPlatform === platform.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]'
              )}
            >
              {platform.label}
            </button>
          ))}
        </div>

        {/* Category & Sort */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--text-secondary)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  依{opt.label}排序
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1" />

          <p className="text-sm text-[var(--text-secondary)]">
            找到 {filteredKOLs?.length || 0} 位 KOL
          </p>
        </div>
      </motion.div>

      {/* KOL Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-[var(--text-secondary)]">載入中...</p>
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            'grid gap-4',
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          )}
        >
          {filteredKOLs?.map((kol, index) => (
            <KOLCard
              key={kol.id}
              kol={kol}
              index={index}
              onClick={() => onSelectKOL(kol.id)}
            />
          ))}
        </div>
      )}

      {filteredKOLs?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">
            沒有找到符合條件的 KOL
          </p>
        </div>
      )}
    </div>
  );
}
