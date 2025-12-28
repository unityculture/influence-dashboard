"""
KOL 影響力數據模型
根據專案需求設計的數據結構，涵蓋：
1. KOL Profile 與影響力指標
2. Campaign 成效數據
3. 受眾分析數據
4. 輿情趨勢數據
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class KOLProfile(BaseModel):
    """KOL 基本資料與影響力 Profile"""
    id: str
    name: str
    avatar: str
    platform: str  # instagram, youtube, tiktok, facebook
    category: str  # 美妝, 時尚, 美食, 旅遊, 科技, 生活風格
    followers: int
    engagement_rate: float  # 互動率 (%)
    avg_likes: int
    avg_comments: int
    avg_shares: int
    influence_score: float  # 綜合影響力分數 0-100
    sentiment_score: float  # 情緒傾向分數 -1 到 1
    authenticity_score: float  # 真實性分數 0-100
    audience_quality_score: float  # 受眾品質分數 0-100
    tags: list[str]  # 標籤
    price_range: str  # 報價區間
    collaboration_count: int  # 合作次數
    brand_fit_tags: list[str]  # 適合的品牌類型


class AudienceDemographic(BaseModel):
    """受眾人口統計"""
    age_groups: dict[str, float]  # 年齡分佈 {"18-24": 35.5, "25-34": 40.2, ...}
    gender: dict[str, float]  # 性別分佈 {"male": 45, "female": 55}
    locations: dict[str, float]  # 地區分佈
    interests: list[dict[str, float]]  # 興趣標籤與比例


class Campaign(BaseModel):
    """行銷活動"""
    id: str
    name: str
    brand: str
    brand_logo: str
    start_date: datetime
    end_date: datetime
    status: str  # planning, active, completed
    budget: float
    kol_ids: list[str]
    objectives: list[str]  # 活動目標
    target_audience: str


class CampaignPerformance(BaseModel):
    """Campaign 成效數據"""
    campaign_id: str
    total_reach: int
    total_impressions: int
    total_engagement: int
    engagement_rate: float
    sentiment_positive: float
    sentiment_neutral: float
    sentiment_negative: float
    top_performing_content: list[dict]
    roi_estimate: float
    brand_mention_increase: float  # 品牌提及增長率
    daily_metrics: list[dict]  # 每日數據趨勢


class KOLCampaignMetrics(BaseModel):
    """單一 KOL 在 Campaign 中的表現"""
    kol_id: str
    campaign_id: str
    posts_count: int
    total_reach: int
    total_engagement: int
    engagement_rate: float
    clicks: int
    conversions: int
    cost: float
    cpe: float  # Cost Per Engagement
    cpm: float  # Cost Per Mille
    content_performance: list[dict]


class BuzzTrend(BaseModel):
    """輿情趨勢"""
    keyword: str
    date: datetime
    volume: int
    sentiment: float
    related_keywords: list[str]
    source_breakdown: dict[str, int]  # 來源分佈


class BrandHealthMetrics(BaseModel):
    """品牌健康度指標"""
    brand_id: str
    date: datetime
    awareness_score: float
    sentiment_score: float
    share_of_voice: float
    competitor_comparison: dict[str, float]
    trending_topics: list[str]


class InfluenceNetwork(BaseModel):
    """影響力網絡關係"""
    kol_id: str
    connections: list[dict]  # {"kol_id": "xxx", "strength": 0.8, "type": "collaboration"}
    community_clusters: list[str]
    cross_platform_presence: dict[str, str]  # 跨平台帳號


class RecommendationResult(BaseModel):
    """KOL 推薦結果"""
    kol_id: str
    match_score: float
    match_reasons: list[str]
    predicted_performance: dict
    risk_factors: list[str]
    similar_successful_campaigns: list[str]
