export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercentage(num: number): string {
  return num.toFixed(1) + '%';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    instagram: '#E4405F',
    youtube: '#FF0000',
    tiktok: '#000000',
    facebook: '#1877F2',
  };
  return colors[platform] || '#6366f1';
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: '📸',
    youtube: '🎬',
    tiktok: '🎵',
    facebook: '👥',
  };
  return icons[platform] || '📱';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: '#10b981',
    completed: '#6366f1',
    planning: '#f59e0b',
  };
  return colors[status] || '#94a3b8';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: '進行中',
    completed: '已完成',
    planning: '規劃中',
  };
  return labels[status] || status;
}

export function getSentimentColor(score: number): string {
  if (score >= 0.7) return '#10b981';
  if (score >= 0.4) return '#f59e0b';
  return '#ef4444';
}

export function getInfluenceLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: '頂尖', color: '#ec4899' };
  if (score >= 60) return { label: '優秀', color: '#6366f1' };
  if (score >= 40) return { label: '中等', color: '#06b6d4' };
  return { label: '成長中', color: '#10b981' };
}
