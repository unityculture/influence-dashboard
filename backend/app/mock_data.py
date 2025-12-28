"""
模擬數據生成器
創建逼真的 KOL 與 Campaign 數據，用於 Prototype 展示
"""

import random
from datetime import datetime, timedelta

# KOL 名稱池（台灣常見的 KOL 風格命名）
KOL_NAMES = [
    "小安 AnnieLife", "阿滴英文", "千千進食中", "古娃娃WawaKu",
    "這群人TGOP", "蔡阿嘎", "理科太太", "館長成吉思汗",
    "HowHow", "黃阿瑪的後宮生活", "Joe是要對決", "欸你這週要幹嘛",
    "志祺七七", "啾啾鞋", "老高與小茉", "HOOK",
    "Joeman", "上班不要看", "反骨男孩", "小玉",
    "美食水水Mia", "穿搭日記Amber", "科技宅Eric", "旅行者Luna",
    "健身教練Max", "美妝達人Coco", "生活家居Nina", "親子日常Amy"
]

PLATFORMS = ["instagram", "youtube", "tiktok", "facebook"]

CATEGORIES = ["美妝", "時尚", "美食", "旅遊", "科技", "生活風格", "親子", "健身", "遊戲", "教育"]

BRAND_FIT_TAGS = [
    "年輕族群", "高消費力", "女性市場", "男性市場",
    "家庭取向", "都會風格", "環保意識", "科技愛好者",
    "美食饕客", "運動健身", "時尚潮流", "質感生活"
]

BRANDS = [
    {"name": "台灣大哥大", "logo": "🔵", "industry": "電信"},
    {"name": "全家便利商店", "logo": "🟢", "industry": "零售"},
    {"name": "蝦皮購物", "logo": "🟠", "industry": "電商"},
    {"name": "foodpanda", "logo": "🩷", "industry": "外送"},
    {"name": "ASUS 華碩", "logo": "🔷", "industry": "科技"},
    {"name": "統一超商", "logo": "🔴", "industry": "零售"},
    {"name": "Gogoro", "logo": "🟡", "industry": "交通"},
    {"name": "momo購物網", "logo": "🩵", "industry": "電商"},
]

CAMPAIGN_OBJECTIVES = [
    "品牌曝光", "產品推廣", "導購轉換", "品牌形象",
    "新品上市", "節慶活動", "會員招募", "App下載"
]


def generate_kol_profiles(count: int = 28) -> list[dict]:
    """生成 KOL Profile 數據"""
    kols = []

    for i, name in enumerate(KOL_NAMES[:count]):
        platform = random.choice(PLATFORMS)
        category = random.choice(CATEGORIES)
        followers = random.randint(10000, 5000000)

        # 根據粉絲數計算合理的互動數據
        base_engagement = 0.02 + random.random() * 0.08  # 2-10% 基礎互動率
        if followers > 1000000:
            base_engagement *= 0.6  # 大 KOL 互動率通常較低
        elif followers < 100000:
            base_engagement *= 1.3  # 小 KOL 互動率通常較高

        avg_likes = int(followers * base_engagement * (0.7 + random.random() * 0.3))
        avg_comments = int(avg_likes * (0.02 + random.random() * 0.05))
        avg_shares = int(avg_likes * (0.01 + random.random() * 0.03))

        # 計算各項分數
        influence_score = min(100, 30 + (followers / 50000) + random.random() * 20)
        sentiment_score = round(random.uniform(0.3, 0.95), 2)
        authenticity_score = round(random.uniform(60, 98), 1)
        audience_quality = round(random.uniform(55, 95), 1)

        # 價格區間
        if followers > 1000000:
            price_range = "NT$ 150,000 - 500,000"
        elif followers > 500000:
            price_range = "NT$ 80,000 - 150,000"
        elif followers > 100000:
            price_range = "NT$ 30,000 - 80,000"
        elif followers > 50000:
            price_range = "NT$ 10,000 - 30,000"
        else:
            price_range = "NT$ 3,000 - 10,000"

        kol = {
            "id": f"kol_{i+1:03d}",
            "name": name,
            "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={name}",
            "platform": platform,
            "category": category,
            "followers": followers,
            "engagement_rate": round(base_engagement * 100, 2),
            "avg_likes": avg_likes,
            "avg_comments": avg_comments,
            "avg_shares": avg_shares,
            "influence_score": round(influence_score, 1),
            "sentiment_score": sentiment_score,
            "authenticity_score": authenticity_score,
            "audience_quality_score": audience_quality,
            "tags": random.sample(CATEGORIES + ["幽默", "專業", "親民", "高質感", "創意"], 4),
            "price_range": price_range,
            "collaboration_count": random.randint(5, 80),
            "brand_fit_tags": random.sample(BRAND_FIT_TAGS, random.randint(3, 6))
        }
        kols.append(kol)

    return kols


def generate_audience_demographics(kol_id: str, category: str) -> dict:
    """根據 KOL 類別生成合理的受眾結構"""

    # 基礎年齡分佈
    age_base = {
        "13-17": random.uniform(5, 15),
        "18-24": random.uniform(20, 35),
        "25-34": random.uniform(25, 40),
        "35-44": random.uniform(10, 25),
        "45-54": random.uniform(5, 15),
        "55+": random.uniform(2, 10)
    }

    # 根據類別調整
    if category == "親子":
        age_base["25-34"] += 15
        age_base["35-44"] += 10
        age_base["18-24"] -= 10
    elif category == "遊戲":
        age_base["13-17"] += 10
        age_base["18-24"] += 15
        age_base["35-44"] -= 10
    elif category in ["美妝", "時尚"]:
        age_base["18-24"] += 10
        age_base["25-34"] += 5

    # 正規化
    total = sum(age_base.values())
    age_groups = {k: round(v / total * 100, 1) for k, v in age_base.items()}

    # 性別分佈
    if category in ["美妝", "時尚", "親子"]:
        gender = {"female": round(random.uniform(65, 85), 1)}
        gender["male"] = round(100 - gender["female"], 1)
    elif category in ["遊戲", "科技", "健身"]:
        gender = {"male": round(random.uniform(60, 80), 1)}
        gender["female"] = round(100 - gender["male"], 1)
    else:
        gender = {"female": round(random.uniform(45, 55), 1)}
        gender["male"] = round(100 - gender["female"], 1)

    # 地區分佈（台灣）
    locations = {
        "台北市": round(random.uniform(20, 35), 1),
        "新北市": round(random.uniform(15, 25), 1),
        "台中市": round(random.uniform(10, 18), 1),
        "高雄市": round(random.uniform(8, 15), 1),
        "桃園市": round(random.uniform(6, 12), 1),
        "其他": 0
    }
    locations["其他"] = round(100 - sum(list(locations.values())[:-1]), 1)

    # 興趣標籤
    interest_pool = [
        "購物", "美食", "旅遊", "運動", "電影", "音樂",
        "攝影", "閱讀", "遊戲", "投資理財", "寵物", "烹飪"
    ]
    interests = [
        {"name": interest, "percentage": round(random.uniform(15, 65), 1)}
        for interest in random.sample(interest_pool, 6)
    ]
    interests.sort(key=lambda x: x["percentage"], reverse=True)

    return {
        "kol_id": kol_id,
        "age_groups": age_groups,
        "gender": gender,
        "locations": locations,
        "interests": interests
    }


def generate_campaigns(kols: list[dict], count: int = 6) -> list[dict]:
    """生成 Campaign 數據"""
    campaigns = []

    statuses = ["completed", "completed", "completed", "active", "active", "planning"]

    for i in range(count):
        brand = random.choice(BRANDS)
        status = statuses[i] if i < len(statuses) else random.choice(statuses)

        # 時間設定
        if status == "completed":
            start_date = datetime.now() - timedelta(days=random.randint(30, 120))
            end_date = start_date + timedelta(days=random.randint(14, 45))
        elif status == "active":
            start_date = datetime.now() - timedelta(days=random.randint(1, 14))
            end_date = datetime.now() + timedelta(days=random.randint(7, 30))
        else:
            start_date = datetime.now() + timedelta(days=random.randint(7, 30))
            end_date = start_date + timedelta(days=random.randint(14, 45))

        # 選擇 KOL
        selected_kols = random.sample(kols, random.randint(3, 8))

        campaign = {
            "id": f"camp_{i+1:03d}",
            "name": f"{brand['name']} {random.choice(['春季', '夏季', '秋季', '冬季', '年度', '週年慶'])}活動",
            "brand": brand["name"],
            "brand_logo": brand["logo"],
            "industry": brand["industry"],
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "status": status,
            "budget": random.randint(300000, 3000000),
            "kol_ids": [k["id"] for k in selected_kols],
            "kol_count": len(selected_kols),
            "objectives": random.sample(CAMPAIGN_OBJECTIVES, random.randint(2, 4)),
            "target_audience": random.choice(["18-35歲都會女性", "25-45歲科技愛好者", "全年齡家庭客群", "18-30歲年輕族群"])
        }
        campaigns.append(campaign)

    return campaigns


def generate_campaign_performance(campaign: dict, kols: list[dict]) -> dict:
    """生成 Campaign 成效數據"""

    # 計算總觸及（根據參與 KOL 的粉絲數）
    campaign_kols = [k for k in kols if k["id"] in campaign["kol_ids"]]
    total_followers = sum(k["followers"] for k in campaign_kols)

    # 觸及通常是粉絲數的 30-80%
    reach_rate = random.uniform(0.3, 0.8)
    total_reach = int(total_followers * reach_rate)

    # 曝光次數（通常是觸及的 2-5 倍）
    total_impressions = int(total_reach * random.uniform(2, 5))

    # 互動數
    avg_engagement_rate = sum(k["engagement_rate"] for k in campaign_kols) / len(campaign_kols)
    total_engagement = int(total_reach * avg_engagement_rate / 100)

    # 情緒分析
    sentiment_positive = round(random.uniform(55, 85), 1)
    sentiment_neutral = round(random.uniform(10, 30), 1)
    sentiment_negative = round(100 - sentiment_positive - sentiment_neutral, 1)

    # 每日數據（過去 30 天）
    daily_metrics = []
    base_daily_reach = total_reach // 30
    for day in range(30):
        date = datetime.now() - timedelta(days=29-day)
        # 加入一些波動
        multiplier = 1 + random.uniform(-0.4, 0.6)
        # 活動期間數據較高
        if 10 <= day <= 20:
            multiplier *= 1.5

        daily_metrics.append({
            "date": date.strftime("%Y-%m-%d"),
            "reach": int(base_daily_reach * multiplier),
            "engagement": int(base_daily_reach * multiplier * avg_engagement_rate / 100),
            "impressions": int(base_daily_reach * multiplier * random.uniform(2, 4)),
            "sentiment": round(random.uniform(0.5, 0.9), 2)
        })

    # 最佳表現內容
    top_content = [
        {
            "kol_name": random.choice(campaign_kols)["name"],
            "type": random.choice(["Reels", "貼文", "限動", "影片"]),
            "engagement": random.randint(5000, 50000),
            "reach": random.randint(50000, 500000)
        }
        for _ in range(5)
    ]
    top_content.sort(key=lambda x: x["engagement"], reverse=True)

    return {
        "campaign_id": campaign["id"],
        "campaign_name": campaign["name"],
        "brand": campaign["brand"],
        "status": campaign["status"],
        "total_reach": total_reach,
        "total_impressions": total_impressions,
        "total_engagement": total_engagement,
        "engagement_rate": round(total_engagement / total_reach * 100, 2) if total_reach > 0 else 0,
        "sentiment_positive": sentiment_positive,
        "sentiment_neutral": sentiment_neutral,
        "sentiment_negative": sentiment_negative,
        "top_performing_content": top_content,
        "roi_estimate": round(random.uniform(1.5, 5.5), 2),
        "brand_mention_increase": round(random.uniform(15, 150), 1),
        "daily_metrics": daily_metrics,
        "budget": campaign["budget"],
        "cost_per_engagement": round(campaign["budget"] / total_engagement, 2) if total_engagement > 0 else 0,
        "cost_per_reach": round(campaign["budget"] / total_reach * 1000, 2) if total_reach > 0 else 0
    }


def generate_buzz_trends(days: int = 30) -> list[dict]:
    """生成輿情趨勢數據"""
    keywords = ["品牌名稱", "產品關鍵字", "活動Hashtag", "代言人", "競品"]
    trends = []

    for keyword in keywords:
        base_volume = random.randint(500, 5000)
        for day in range(days):
            date = datetime.now() - timedelta(days=days-1-day)
            # 模擬趨勢波動
            multiplier = 1 + random.uniform(-0.3, 0.5)
            if 15 <= day <= 22:  # 活動高峰期
                multiplier *= 2

            trends.append({
                "keyword": keyword,
                "date": date.strftime("%Y-%m-%d"),
                "volume": int(base_volume * multiplier),
                "sentiment": round(random.uniform(0.4, 0.9), 2),
                "source_breakdown": {
                    "instagram": random.randint(20, 40),
                    "facebook": random.randint(15, 30),
                    "youtube": random.randint(10, 25),
                    "ptt": random.randint(5, 15),
                    "news": random.randint(5, 15)
                }
            })

    return trends


def generate_kol_comparison(kols: list[dict], kol_ids: list[str]) -> list[dict]:
    """生成 KOL 比較數據"""
    comparison_kols = [k for k in kols if k["id"] in kol_ids]

    return [
        {
            "id": k["id"],
            "name": k["name"],
            "avatar": k["avatar"],
            "platform": k["platform"],
            "followers": k["followers"],
            "engagement_rate": k["engagement_rate"],
            "influence_score": k["influence_score"],
            "sentiment_score": k["sentiment_score"],
            "authenticity_score": k["authenticity_score"],
            "audience_quality_score": k["audience_quality_score"],
            "price_range": k["price_range"],
            "brand_fit_tags": k["brand_fit_tags"],
            "radar_data": {
                "影響力": k["influence_score"],
                "互動率": min(100, k["engagement_rate"] * 10),
                "情緒正面": k["sentiment_score"] * 100,
                "真實性": k["authenticity_score"],
                "受眾品質": k["audience_quality_score"]
            }
        }
        for k in comparison_kols
    ]


def generate_platform_distribution(kols: list[dict]) -> dict:
    """生成平台分佈數據"""
    platform_stats = {}

    for platform in PLATFORMS:
        platform_kols = [k for k in kols if k["platform"] == platform]
        if platform_kols:
            platform_stats[platform] = {
                "count": len(platform_kols),
                "total_followers": sum(k["followers"] for k in platform_kols),
                "avg_engagement": round(sum(k["engagement_rate"] for k in platform_kols) / len(platform_kols), 2),
                "avg_influence": round(sum(k["influence_score"] for k in platform_kols) / len(platform_kols), 1)
            }

    return platform_stats


def generate_category_insights(kols: list[dict]) -> list[dict]:
    """生成類別洞察"""
    category_stats = {}

    for category in CATEGORIES:
        cat_kols = [k for k in kols if k["category"] == category]
        if cat_kols:
            category_stats[category] = {
                "category": category,
                "kol_count": len(cat_kols),
                "total_reach": sum(k["followers"] for k in cat_kols),
                "avg_engagement": round(sum(k["engagement_rate"] for k in cat_kols) / len(cat_kols), 2),
                "avg_influence": round(sum(k["influence_score"] for k in cat_kols) / len(cat_kols), 1),
                "top_kol": max(cat_kols, key=lambda x: x["influence_score"])["name"]
            }

    return list(category_stats.values())


# 初始化所有數據
ALL_KOLS = generate_kol_profiles(28)
ALL_CAMPAIGNS = generate_campaigns(ALL_KOLS, 6)
ALL_CAMPAIGN_PERFORMANCES = [generate_campaign_performance(c, ALL_KOLS) for c in ALL_CAMPAIGNS]
ALL_AUDIENCE_DATA = {k["id"]: generate_audience_demographics(k["id"], k["category"]) for k in ALL_KOLS}
ALL_BUZZ_TRENDS = generate_buzz_trends(30)
PLATFORM_DISTRIBUTION = generate_platform_distribution(ALL_KOLS)
CATEGORY_INSIGHTS = generate_category_insights(ALL_KOLS)
