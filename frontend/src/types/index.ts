export interface KOL {
  id: string;
  name: string;
  avatar: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'facebook';
  category: string;
  followers: number;
  engagement_rate: number;
  avg_likes: number;
  avg_comments: number;
  avg_shares: number;
  influence_score: number;
  sentiment_score: number;
  authenticity_score: number;
  audience_quality_score: number;
  tags: string[];
  price_range: string;
  collaboration_count: number;
  brand_fit_tags: string[];
}

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  brand_logo: string;
  industry: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'active' | 'completed';
  budget: number;
  kol_ids: string[];
  kol_count: number;
  objectives: string[];
  target_audience: string;
}

export interface CampaignPerformance {
  campaign_id: string;
  campaign_name: string;
  brand: string;
  status: string;
  total_reach: number;
  total_impressions: number;
  total_engagement: number;
  engagement_rate: number;
  sentiment_positive: number;
  sentiment_neutral: number;
  sentiment_negative: number;
  top_performing_content: TopContent[];
  roi_estimate: number;
  brand_mention_increase: number;
  daily_metrics: DailyMetric[];
  budget: number;
  cost_per_engagement: number;
  cost_per_reach: number;
}

export interface TopContent {
  kol_name: string;
  type: string;
  engagement: number;
  reach: number;
}

export interface DailyMetric {
  date: string;
  reach: number;
  engagement: number;
  impressions: number;
  sentiment: number;
}

export interface AudienceDemographic {
  kol_id: string;
  age_groups: Record<string, number>;
  gender: Record<string, number>;
  locations: Record<string, number>;
  interests: Array<{ name: string; percentage: number }>;
}

export interface DataStory {
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

export interface DashboardOverview {
  total_kols: number;
  total_reach: number;
  active_campaigns: number;
  completed_campaigns: number;
  total_engagement: number;
  avg_engagement_rate: number;
  avg_roi: number;
  platform_distribution: Record<string, PlatformStats>;
  category_insights: CategoryInsight[];
  top_kols: KOL[];
}

export interface PlatformStats {
  count: number;
  total_followers: number;
  avg_engagement: number;
  avg_influence: number;
}

export interface CategoryInsight {
  category: string;
  kol_count: number;
  total_reach: number;
  avg_engagement: number;
  avg_influence: number;
  top_kol: string;
}

export interface StoriesResponse {
  stories: DataStory[];
  key_metrics: {
    total_kols: number;
    total_reach: number;
    avg_engagement: number;
    active_campaigns: number;
    total_campaign_engagement: number;
  };
}
