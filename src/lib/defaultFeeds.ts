import { FeedSource } from "./types";

export const DEFAULT_FEEDS: FeedSource[] = [
  // 1. 국내 주요 국제 분쟁 & 기후재난 미디어 (Korean Feeds)
  {
    id: "yonhap-global-conflict",
    name: "연합뉴스 국제 안보 & 분쟁",
    url: "https://www.yna.co.kr/rss/international.xml",
    category: "지정학적 분쟁 & 사이버전",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "ShieldAlert"
  },
  {
    id: "hankyoreh-peace-climate",
    name: "한겨레 지구 & 기후위기",
    url: "https://www.hani.co.kr/rss/international/",
    category: "기후위기 & 자연재해",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "CloudRain"
  },
  {
    id: "khan-world-aid",
    name: "경향신문 국제 구호 & 평화",
    url: "https://www.khan.co.kr/rss/rssdata/world_news.xml",
    category: "글로벌 평화 & 인도적 지원",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "HeartHandshake"
  },
  {
    id: "aitimes-defense",
    name: "AI타임스 국방 & 기후테크",
    url: "https://www.aitimes.com/rss/allArticle.xml",
    category: "AI 재난예측 & 구호기술",
    enabled: true,
    type: "rss",
    lang: "ko",
    icon: "Sparkles"
  },

  // 2. 글로벌 티어 1 기구 및 미디어 (Global English Feeds)
  {
    id: "un-news-global",
    name: "UN News (United Nations)",
    url: "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
    category: "Global Peace & Human Aid",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Globe"
  },
  {
    id: "reliefweb-disasters",
    name: "ReliefWeb Humanitarian Portal (UN OCHA)",
    url: "https://reliefweb.int/updates/rss.xml",
    category: "Climate Crisis & Disasters",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "LifeBuoy"
  },
  {
    id: "defense-news-ai",
    name: "Defense News - Military AI & Cyber",
    url: "https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml",
    category: "AI Warfare & Autonomous Systems",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Crosshair"
  },
  {
    id: "nature-climate-earth",
    name: "Nature - Climate Change & Earth",
    url: "https://www.nature.com/nclimate.rss",
    category: "Climate Crisis & Disasters",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Leaf"
  },
  {
    id: "reuters-world-conflict",
    name: "Reuters World & Geopolitics",
    url: "https://www.reutersagency.com/feed/?taxonomy=markets&post_type=best",
    category: "Geopolitical Conflicts & Cyber",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "ShieldAlert"
  },
  {
    id: "weforum-global-risks",
    name: "World Economic Forum (WEF) Planetary Tech",
    url: "https://www.weforum.org/agenda/feed",
    category: "AI Relief & Prediction Tech",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Sparkles"
  },
  {
    id: "techcrunch-ai-good",
    name: "TechCrunch AI & Climate Tech",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "AI Relief & Prediction Tech",
    enabled: true,
    type: "rss",
    lang: "en",
    icon: "Cpu"
  }
];
