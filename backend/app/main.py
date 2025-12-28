"""
KOL 影響力儀表板 API
提供 KOL 數據、Campaign 成效、輿情趨勢等 API 端點
"""

import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from .mock_data import (
    ALL_KOLS,
    ALL_CAMPAIGNS,
    ALL_CAMPAIGN_PERFORMANCES,
    ALL_AUDIENCE_DATA,
    ALL_BUZZ_TRENDS,
    PLATFORM_DISTRIBUTION,
    CATEGORY_INSIGHTS,
    generate_kol_comparison,
)

app = FastAPI(
    title="KOL Influence Dashboard API",
    description="影響力數據專案 - 協助品牌精準媒合 KOL 並驗證行銷成效",
    version="0.1.0"
)

# CORS 設定 - 支援 Zeabur 部署
# 從環境變數取得允許的 origins，或使用預設值
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
# 如果是 production 且沒設定 ALLOWED_ORIGINS，允許所有 Zeabur 網域
if os.getenv("ZEABUR_ENVIRONMENT"):
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Dashboard Overview ====================

@app.get("/api/dashboard/overview")
async def get_dashboard_overview():
    """儀表板總覽數據"""
    total_reach = sum(k["followers"] for k in ALL_KOLS)
    active_campaigns = len([c for c in ALL_CAMPAIGNS if c["status"] == "active"])
    completed_campaigns = len([c for c in ALL_CAMPAIGNS if c["status"] == "completed"])

    # 計算總互動
    total_engagement = sum(p["total_engagement"] for p in ALL_CAMPAIGN_PERFORMANCES)

    # 平均互動率
    avg_engagement_rate = sum(k["engagement_rate"] for k in ALL_KOLS) / len(ALL_KOLS)

    # 平均 ROI
    completed_perfs = [p for p in ALL_CAMPAIGN_PERFORMANCES if p["status"] == "completed"]
    avg_roi = sum(p["roi_estimate"] for p in completed_perfs) / len(completed_perfs) if completed_perfs else 0

    return {
        "total_kols": len(ALL_KOLS),
        "total_reach": total_reach,
        "active_campaigns": active_campaigns,
        "completed_campaigns": completed_campaigns,
        "total_engagement": total_engagement,
        "avg_engagement_rate": round(avg_engagement_rate, 2),
        "avg_roi": round(avg_roi, 2),
        "platform_distribution": PLATFORM_DISTRIBUTION,
        "category_insights": CATEGORY_INSIGHTS,
        "top_kols": sorted(ALL_KOLS, key=lambda x: x["influence_score"], reverse=True)[:5]
    }


# ==================== KOL 相關 API ====================

@app.get("/api/kols")
async def get_kols(
    platform: Optional[str] = None,
    category: Optional[str] = None,
    min_followers: Optional[int] = None,
    max_followers: Optional[int] = None,
    min_engagement: Optional[float] = None,
    sort_by: str = "influence_score",
    order: str = "desc",
    limit: int = 50
):
    """取得 KOL 列表，支援篩選與排序"""
    kols = ALL_KOLS.copy()

    # 篩選
    if platform:
        kols = [k for k in kols if k["platform"] == platform]
    if category:
        kols = [k for k in kols if k["category"] == category]
    if min_followers:
        kols = [k for k in kols if k["followers"] >= min_followers]
    if max_followers:
        kols = [k for k in kols if k["followers"] <= max_followers]
    if min_engagement:
        kols = [k for k in kols if k["engagement_rate"] >= min_engagement]

    # 排序
    reverse = order == "desc"
    if sort_by in ["influence_score", "followers", "engagement_rate", "sentiment_score"]:
        kols.sort(key=lambda x: x[sort_by], reverse=reverse)

    return {
        "total": len(kols),
        "kols": kols[:limit]
    }


@app.get("/api/kols/{kol_id}")
async def get_kol_detail(kol_id: str):
    """取得單一 KOL 詳細資料"""
    kol = next((k for k in ALL_KOLS if k["id"] == kol_id), None)
    if not kol:
        return {"error": "KOL not found"}

    # 取得受眾數據
    audience = ALL_AUDIENCE_DATA.get(kol_id, {})

    # 取得參與的 Campaign
    participated_campaigns = [
        c for c in ALL_CAMPAIGNS if kol_id in c["kol_ids"]
    ]

    return {
        **kol,
        "audience_demographics": audience,
        "campaigns": participated_campaigns,
        "performance_history": {
            "months": ["7月", "8月", "9月", "10月", "11月", "12月"],
            "engagement_rates": [
                round(kol["engagement_rate"] * (0.85 + i * 0.05), 2)
                for i in range(6)
            ],
            "followers_growth": [
                int(kol["followers"] * (0.9 + i * 0.02))
                for i in range(6)
            ]
        }
    }


@app.get("/api/kols/compare")
async def compare_kols(kol_ids: str = Query(..., description="逗號分隔的 KOL ID")):
    """比較多個 KOL"""
    ids = kol_ids.split(",")
    return generate_kol_comparison(ALL_KOLS, ids)


@app.get("/api/kols/{kol_id}/audience")
async def get_kol_audience(kol_id: str):
    """取得 KOL 受眾分析"""
    audience = ALL_AUDIENCE_DATA.get(kol_id)
    if not audience:
        return {"error": "Audience data not found"}
    return audience


# ==================== Campaign 相關 API ====================

@app.get("/api/campaigns")
async def get_campaigns(
    status: Optional[str] = None,
    brand: Optional[str] = None
):
    """取得 Campaign 列表"""
    campaigns = ALL_CAMPAIGNS.copy()

    if status:
        campaigns = [c for c in campaigns if c["status"] == status]
    if brand:
        campaigns = [c for c in campaigns if c["brand"] == brand]

    return {
        "total": len(campaigns),
        "campaigns": campaigns
    }


@app.get("/api/campaigns/{campaign_id}")
async def get_campaign_detail(campaign_id: str):
    """取得單一 Campaign 詳細資料"""
    campaign = next((c for c in ALL_CAMPAIGNS if c["id"] == campaign_id), None)
    if not campaign:
        return {"error": "Campaign not found"}

    performance = next(
        (p for p in ALL_CAMPAIGN_PERFORMANCES if p["campaign_id"] == campaign_id),
        None
    )

    # 取得參與的 KOL 詳細資料
    kols = [k for k in ALL_KOLS if k["id"] in campaign["kol_ids"]]

    return {
        **campaign,
        "performance": performance,
        "kols": kols
    }


@app.get("/api/campaigns/{campaign_id}/performance")
async def get_campaign_performance(campaign_id: str):
    """取得 Campaign 成效數據"""
    performance = next(
        (p for p in ALL_CAMPAIGN_PERFORMANCES if p["campaign_id"] == campaign_id),
        None
    )
    if not performance:
        return {"error": "Performance data not found"}
    return performance


# ==================== 輿情與趨勢 API ====================

@app.get("/api/buzz/trends")
async def get_buzz_trends(
    keyword: Optional[str] = None,
    days: int = 30
):
    """取得輿情趨勢"""
    trends = ALL_BUZZ_TRENDS.copy()

    if keyword:
        trends = [t for t in trends if t["keyword"] == keyword]

    return {
        "trends": trends[-days * 5:] if len(trends) > days * 5 else trends,
        "keywords": list(set(t["keyword"] for t in ALL_BUZZ_TRENDS))
    }


@app.get("/api/insights/platform")
async def get_platform_insights():
    """取得平台洞察"""
    return PLATFORM_DISTRIBUTION


@app.get("/api/insights/category")
async def get_category_insights():
    """取得類別洞察"""
    return CATEGORY_INSIGHTS


# ==================== 推薦系統 API ====================

@app.get("/api/recommend")
async def recommend_kols(
    category: Optional[str] = None,
    budget: Optional[int] = None,
    target_audience: Optional[str] = None,
    objective: Optional[str] = None,
    limit: int = 5
):
    """KOL 推薦"""
    kols = ALL_KOLS.copy()

    # 簡單的推薦邏輯
    if category:
        # 優先同類別，但也包含相關類別
        kols.sort(key=lambda x: (x["category"] == category, x["influence_score"]), reverse=True)

    # 根據預算篩選
    if budget:
        if budget < 50000:
            kols = [k for k in kols if k["followers"] < 100000]
        elif budget < 150000:
            kols = [k for k in kols if 50000 < k["followers"] < 500000]

    # 取得最佳推薦
    recommendations = []
    for kol in kols[:limit]:
        match_reasons = []
        if category and kol["category"] == category:
            match_reasons.append(f"類別匹配：{category}")
        if kol["engagement_rate"] > 5:
            match_reasons.append("高互動率")
        if kol["sentiment_score"] > 0.7:
            match_reasons.append("正面形象")
        if kol["authenticity_score"] > 80:
            match_reasons.append("高真實性")

        recommendations.append({
            **kol,
            "match_score": round(70 + len(match_reasons) * 7.5, 1),
            "match_reasons": match_reasons,
            "predicted_reach": int(kol["followers"] * 0.6),
            "predicted_engagement": int(kol["followers"] * kol["engagement_rate"] / 100)
        })

    return {"recommendations": recommendations}


# ==================== 數據故事 API ====================

@app.get("/api/stories/overview")
async def get_data_stories():
    """
    取得數據故事與洞察

    業務場景說明（參考 meetingnote.md）：
    1. KOL Profile 建立 - 透過輿情數據計算影響力分數
    2. Campaign 成效驗證 - 不涉及購買轉換，專注表層指標
    3. 內外部影響力評估 - MGM 互相導流分析
    """

    # 計算關鍵洞察
    top_kol = max(ALL_KOLS, key=lambda x: x["influence_score"])
    best_sentiment_kol = max(ALL_KOLS, key=lambda x: x["sentiment_score"])
    best_engagement_kol = max(ALL_KOLS, key=lambda x: x["engagement_rate"])
    best_campaign = max(ALL_CAMPAIGN_PERFORMANCES, key=lambda x: x["roi_estimate"])

    # 平台趨勢
    ig_kols = [k for k in ALL_KOLS if k["platform"] == "instagram"]
    yt_kols = [k for k in ALL_KOLS if k["platform"] == "youtube"]
    tiktok_kols = [k for k in ALL_KOLS if k["platform"] == "tiktok"]

    # 輿情數據統計
    total_buzz_volume = sum(t["volume"] for t in ALL_BUZZ_TRENDS)
    avg_sentiment = sum(t["sentiment"] for t in ALL_BUZZ_TRENDS) / len(ALL_BUZZ_TRENDS) if ALL_BUZZ_TRENDS else 0

    # 關鍵字熱度排行
    keyword_volumes = {}
    for trend in ALL_BUZZ_TRENDS:
        keyword_volumes[trend["keyword"]] = keyword_volumes.get(trend["keyword"], 0) + trend["volume"]
    top_keyword = max(keyword_volumes.items(), key=lambda x: x[1]) if keyword_volumes else ("", 0)

    stories = [
        {
            "id": "story_1",
            "title": "輿情聲量領袖",
            "type": "buzz",
            "icon": "volume",
            "category": "輿情分析",
            "content": f"本月輿情總聲量達 {total_buzz_volume:,} 則，關鍵字「{top_keyword[0]}」最受關注",
            "insight": "透過 Q-Search 輿情數據，追蹤社群討論熱度，即時掌握市場動態",
            "metric": total_buzz_volume,
            "metric_label": "總聲量數",
            "data_source": "Q-Search 輿情資料"
        },
        {
            "id": "story_2",
            "title": "情緒指數觀測",
            "type": "sentiment",
            "icon": "heart",
            "category": "輿情分析",
            "content": f"整體輿情情緒指數為 {round(avg_sentiment * 100, 1)}%，{best_sentiment_kol['name']} 擁有最佳正面形象 ({round(best_sentiment_kol['sentiment_score'] * 100, 1)}%)",
            "insight": "情緒分析協助品牌事前評估 KOL 形象風險，降低合作風險",
            "metric": round(avg_sentiment * 100, 1),
            "metric_label": "正面情緒佔比 %",
            "data_source": "社群留言情緒分析"
        },
        {
            "id": "story_3",
            "title": "影響力指數排行",
            "type": "influence",
            "icon": "crown",
            "category": "KOL 分析",
            "content": f"{top_kol['name']} 以 {top_kol['influence_score']} 分領先，結合粉絲數、互動率與情緒分數計算",
            "insight": "數據驅動的 KOL 評估模型，協助品牌精準媒合最適合的創作者",
            "metric": top_kol["influence_score"],
            "metric_label": "影響力指數",
            "data_source": "綜合評估模型"
        },
        {
            "id": "story_4",
            "title": "互動效率之星",
            "type": "engagement",
            "icon": "zap",
            "category": "KOL 分析",
            "content": f"{best_engagement_kol['name']} 擁有 {best_engagement_kol['engagement_rate']}% 的超高互動率",
            "insight": "高互動率代表更真實的粉絲連結，適合深度品牌溝通",
            "metric": best_engagement_kol["engagement_rate"],
            "metric_label": "互動率 %",
            "data_source": "社群平台數據"
        },
        {
            "id": "story_5",
            "title": "Campaign 成效追蹤",
            "type": "campaign",
            "icon": "trending-up",
            "category": "成效驗證",
            "content": f"{best_campaign['campaign_name']} 達成 {best_campaign['total_reach']:,} 觸及，ROI 估算 {best_campaign['roi_estimate']}x",
            "insight": "Campaign 儀表板即時追蹤活動成效，驗證 KOL 影響力實際效益",
            "metric": best_campaign["roi_estimate"],
            "metric_label": "ROI 倍數",
            "data_source": "Campaign 追蹤碼"
        },
        {
            "id": "story_6",
            "title": "平台生態分佈",
            "type": "platform",
            "icon": "bar-chart",
            "category": "市場洞察",
            "content": f"Instagram {len(ig_kols)} 位、YouTube {len(yt_kols)} 位、TikTok {len(tiktok_kols)} 位 KOL 建檔",
            "insight": "多平台佈局能觸及不同受眾群體，建議根據品牌目標選擇平台組合",
            "data": {
                "instagram": len(ig_kols),
                "youtube": len(yt_kols),
                "tiktok": len(tiktok_kols),
                "facebook": len([k for k in ALL_KOLS if k["platform"] == "facebook"])
            },
            "data_source": "KOL 資料庫"
        },
        {
            "id": "story_7",
            "title": "受眾品質評估",
            "type": "audience",
            "icon": "users",
            "category": "深度分析",
            "content": f"平均受眾品質分數達 {round(sum(k['audience_quality_score'] for k in ALL_KOLS) / len(ALL_KOLS), 1)} 分（滿分 100）",
            "insight": "高品質受眾能提升 Campaign 轉換潛力，適合品牌長期經營",
            "metric": round(sum(k['audience_quality_score'] for k in ALL_KOLS) / len(ALL_KOLS), 1),
            "metric_label": "平均受眾品質",
            "data_source": "受眾分析模型"
        },
        {
            "id": "story_8",
            "title": "品牌適配推薦",
            "type": "recommendation",
            "icon": "target",
            "category": "智慧推薦",
            "content": "根據品牌標籤與 KOL 屬性分析，系統可自動推薦最適配的創作者組合",
            "insight": "AI 驅動的媒合系統，為品牌省時省力找到對的 KOL",
            "metric": len(ALL_KOLS),
            "metric_label": "可推薦 KOL 數",
            "data_source": "智慧推薦引擎"
        }
    ]

    # 分類整理故事
    categories = {
        "輿情分析": [s for s in stories if s.get("category") == "輿情分析"],
        "KOL 分析": [s for s in stories if s.get("category") == "KOL 分析"],
        "成效驗證": [s for s in stories if s.get("category") == "成效驗證"],
        "市場洞察": [s for s in stories if s.get("category") == "市場洞察"],
        "深度分析": [s for s in stories if s.get("category") == "深度分析"],
        "智慧推薦": [s for s in stories if s.get("category") == "智慧推薦"],
    }

    return {
        "stories": stories,
        "categories": categories,
        "key_metrics": {
            "total_kols": len(ALL_KOLS),
            "total_reach": sum(k["followers"] for k in ALL_KOLS),
            "avg_engagement": round(sum(k["engagement_rate"] for k in ALL_KOLS) / len(ALL_KOLS), 2),
            "avg_sentiment": round(avg_sentiment * 100, 1),
            "active_campaigns": len([c for c in ALL_CAMPAIGNS if c["status"] == "active"]),
            "total_buzz_volume": total_buzz_volume,
            "total_campaign_engagement": sum(p["total_engagement"] for p in ALL_CAMPAIGN_PERFORMANCES)
        },
        "data_sources": [
            {"name": "Q-Search 輿情系統", "type": "輿情數據", "description": "社群留言、貼文、關鍵字聲量"},
            {"name": "社群平台 API", "type": "KOL 數據", "description": "粉絲數、互動數據"},
            {"name": "Campaign 追蹤", "type": "成效數據", "description": "專屬碼、UTM 追蹤"},
            {"name": "12CN 會員系統", "type": "會員數據", "description": "MGM 導流、會員標籤"}
        ]
    }


@app.get("/")
async def root():
    """API 首頁"""
    return {
        "name": "KOL Influence Dashboard API",
        "version": "0.1.0",
        "description": "影響力數據專案 - Prototype",
        "endpoints": {
            "dashboard": "/api/dashboard/overview",
            "kols": "/api/kols",
            "campaigns": "/api/campaigns",
            "buzz": "/api/buzz/trends",
            "stories": "/api/stories/overview",
            "recommend": "/api/recommend"
        }
    }
