import { useQuery } from '@tanstack/react-query';
import type {
  DashboardOverview,
  KOL,
  Campaign,
  CampaignPerformance,
  StoriesResponse,
  AudienceDemographic
} from '../types';

// 支援 Zeabur 部署 - 從環境變數取得 API URL
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Zeabur 免費版有冷啟動問題，需要 retry 邏輯
async function fetchWithRetry<T>(url: string, retries = 3, delay = 2000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.status === 503 && i < retries - 1) {
        // 503 表示服務正在喚醒，等待後重試
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries reached');
}

async function fetchJson<T>(url: string): Promise<T> {
  return fetchWithRetry<T>(url);
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => fetchJson<DashboardOverview>(`${API_BASE}/dashboard/overview`),
    retry: 3,
    retryDelay: 2000,
  });
}

export function useKOLs(params?: {
  platform?: string;
  category?: string;
  min_followers?: number;
  sort_by?: string;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.platform) searchParams.set('platform', params.platform);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.min_followers) searchParams.set('min_followers', String(params.min_followers));
  if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
  if (params?.limit) searchParams.set('limit', String(params.limit));

  return useQuery({
    queryKey: ['kols', params],
    queryFn: () => fetchJson<{ total: number; kols: KOL[] }>(
      `${API_BASE}/kols?${searchParams.toString()}`
    ),
  });
}

export function useKOLDetail(kolId: string) {
  return useQuery({
    queryKey: ['kol', kolId],
    queryFn: () => fetchJson<KOL & {
      audience_demographics: AudienceDemographic;
      campaigns: Campaign[];
      performance_history: {
        months: string[];
        engagement_rates: number[];
        followers_growth: number[];
      };
    }>(`${API_BASE}/kols/${kolId}`),
    enabled: !!kolId,
  });
}

export function useCampaigns(status?: string) {
  const params = status ? `?status=${status}` : '';
  return useQuery({
    queryKey: ['campaigns', status],
    queryFn: () => fetchJson<{ total: number; campaigns: Campaign[] }>(
      `${API_BASE}/campaigns${params}`
    ),
  });
}

export function useCampaignDetail(campaignId: string) {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => fetchJson<Campaign & {
      performance: CampaignPerformance;
      kols: KOL[];
    }>(`${API_BASE}/campaigns/${campaignId}`),
    enabled: !!campaignId,
  });
}

export function useCampaignPerformance(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-performance', campaignId],
    queryFn: () => fetchJson<CampaignPerformance>(
      `${API_BASE}/campaigns/${campaignId}/performance`
    ),
    enabled: !!campaignId,
  });
}

export function useDataStories() {
  return useQuery({
    queryKey: ['data-stories'],
    queryFn: () => fetchJson<StoriesResponse>(`${API_BASE}/stories/overview`),
  });
}

export function useBuzzTrends(keyword?: string, days: number = 30) {
  const params = new URLSearchParams();
  if (keyword) params.set('keyword', keyword);
  params.set('days', String(days));

  return useQuery({
    queryKey: ['buzz-trends', keyword, days],
    queryFn: () => fetchJson<{
      trends: Array<{
        keyword: string;
        date: string;
        volume: number;
        sentiment: number;
        source_breakdown: Record<string, number>;
      }>;
      keywords: string[];
    }>(`${API_BASE}/buzz/trends?${params.toString()}`),
  });
}

export function useRecommendations(params?: {
  category?: string;
  budget?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.budget) searchParams.set('budget', String(params.budget));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  return useQuery({
    queryKey: ['recommendations', params],
    queryFn: () => fetchJson<{
      recommendations: Array<KOL & {
        match_score: number;
        match_reasons: string[];
        predicted_reach: number;
        predicted_engagement: number;
      }>;
    }>(`${API_BASE}/recommend?${searchParams.toString()}`),
  });
}
