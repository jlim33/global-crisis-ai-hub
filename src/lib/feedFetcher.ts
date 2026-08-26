import Parser from "rss-parser";
import { NewsArticle, FeedSource, Category } from "./types";
import { DEFAULT_FEEDS } from "./defaultFeeds";
import { generateCrisisSummary, extractAffectedRegions } from "./aiSummarizer";
import fs from "fs";
import path from "path";
import os from "os";

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 CrisisPulse/1.0",
    "Accept": "application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8"
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"],
      ["dc:creator", "creator"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const CACHE_DIR = path.join(os.tmpdir(), "crisis-cache");
const CACHE_FILE = path.join(CACHE_DIR, "crisis-news-cache.json");
const FEEDS_FILE = path.join(CACHE_DIR, "crisis-feeds-config.json");

let inMemoryArticles: NewsArticle[] = [];
let lastSyncTime: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

function ensureCacheDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  } catch (e) {}
}

export function getSavedFeeds(): FeedSource[] {
  ensureCacheDir();
  try {
    if (fs.existsSync(FEEDS_FILE)) {
      const data = fs.readFileSync(FEEDS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Failed to read feeds file, using defaults:", e);
  }
  return DEFAULT_FEEDS;
}

export function saveFeeds(feeds: FeedSource[]) {
  ensureCacheDir();
  try {
    fs.writeFileSync(FEEDS_FILE, JSON.stringify(feeds, null, 2), "utf-8");
  } catch (e) {}
}

function loadCachedArticles(): NewsArticle[] {
  ensureCacheDir();
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return [];
}

function saveCachedArticles(articles: NewsArticle[]) {
  ensureCacheDir();
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(articles, null, 2), "utf-8");
  } catch (e) {}
}

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 150));
}

function sanitizeSnippet(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function autoRefineCategory(title: string, snippet: string, defaultCat: Category, lang: "ko" | "en"): Category {
  const text = (title + " " + snippet).toLowerCase();

  if (lang === "en") {
    if (text.includes("drone") || text.includes("autonomous weapon") || text.includes("military ai") || text.includes("lethal ai")) {
      return "AI Warfare & Autonomous Systems";
    }
    if (text.includes("climate") || text.includes("wildfire") || text.includes("flood") || text.includes("earthquake") || text.includes("typhoon") || text.includes("hurricane")) {
      return "Climate Crisis & Disasters";
    }
    if (text.includes("rescue") || text.includes("early warning") || text.includes("satellite prediction") || text.includes("disaster ai")) {
      return "AI Relief & Prediction Tech";
    }
    if (text.includes("peace") || text.includes("un aid") || text.includes("humanitarian") || text.includes("refugee") || text.includes("ceasefire")) {
      return "Global Peace & Human Aid";
    }
    if (text.includes("food") || text.includes("grain") || text.includes("grid") || text.includes("energy") || text.includes("water shortage")) {
      return "Energy & Food Security";
    }
    if (text.includes("cyber") || text.includes("taiwan") || text.includes("ukraine") || text.includes("middle east") || text.includes("missile")) {
      return "Geopolitical Conflicts & Cyber";
    }
    return defaultCat;
  }

  // Korean Category Classification
  if (text.includes("드론") || text.includes("자율 무기") || text.includes("군사 ai") || text.includes("살상 무기")) {
    return "AI 군사 & 자율무기";
  }
  if (text.includes("기후") || text.includes("산불") || text.includes("홍수") || text.includes("지진") || text.includes("태풍") || text.includes("가뭄")) {
    return "기후위기 & 자연재해";
  }
  if (text.includes("재난 예측") || text.includes("구호 기술") || text.includes("조기 경보") || text.includes("위성 ai") || text.includes("구조 로봇")) {
    return "AI 재난예측 & 구호기술";
  }
  if (text.includes("평화") || text.includes("구호") || text.includes("난민") || text.includes("인도주의") || text.includes("휴전") || text.includes("un")) {
    return "글로벌 평화 & 인도적 지원";
  }
  if (text.includes("식량") || text.includes("에너지") || text.includes("전력망") || text.includes("가뭄") || text.includes("곡물")) {
    return "에너지 & 식량 안보";
  }
  if (text.includes("사이버전") || text.includes("해킹") || text.includes("미사일") || text.includes("우크라이나") || text.includes("중동") || text.includes("대만")) {
    return "지정학적 분쟁 & 사이버전";
  }

  return defaultCat;
}

function extractTags(title: string, snippet: string, category: Category, regions: string[]): string[] {
  const text = (title + " " + snippet).toLowerCase();
  const tags: Set<string> = new Set();

  tags.add(category);
  regions.forEach(r => tags.add(r));

  const keywords = [
    "AI Warfare", "ClimateCrisis", "UN Relief", "Autonomous Drones", "CyberDefense",
    "EarlyWarning", "Disaster AI", "GlobalPeace", "평화", "재난구호", "군사AI", "기후위기"
  ];

  for (const kw of keywords) {
    if (new RegExp(`\\b${kw}\\b`, "i").test(text)) {
      tags.add(kw);
    }
  }

  return Array.from(tags).slice(0, 4);
}

async function fetchFeed(feed: FeedSource): Promise<NewsArticle[]> {
  try {
    const feedData = await parser.parseURL(feed.url);
    const articles: NewsArticle[] = [];
    const lang = feed.lang || (feed.id.includes("kr") || feed.id.includes("yonhap") ? "ko" : "en");

    for (const item of feedData.items || []) {
      if (!item.title || !item.link) continue;

      const title = item.title.trim();
      const rawItem = item as any;
      const snippet = sanitizeSnippet(
        rawItem.contentSnippet || rawItem.summary || rawItem.content || rawItem["content:encoded"] || ""
      );

      const pubDateObj = rawItem.pubDate || rawItem.isoDate ? new Date(rawItem.pubDate || rawItem.isoDate!) : new Date();
      const pubDate = isNaN(pubDateObj.getTime()) ? new Date().toISOString() : pubDateObj.toISOString();
      const timestamp = isNaN(pubDateObj.getTime()) ? Date.now() : pubDateObj.getTime();

      let imageUrl = "";
      if (rawItem.enclosure?.url && (rawItem.enclosure?.type?.startsWith("image/") || typeof rawItem.enclosure?.url === "string")) {
        imageUrl = rawItem.enclosure.url;
      } else if (rawItem.mediaContent?.$?.url) {
        imageUrl = rawItem.mediaContent.$.url;
      } else if (rawItem.mediaThumbnail?.$?.url) {
        imageUrl = rawItem.mediaThumbnail.$.url;
      }

      const id = Buffer.from(item.link).toString("base64url").slice(0, 32);

      const category = autoRefineCategory(title, snippet, feed.category, lang);
      const readTimeMinutes = estimateReadTime(snippet || title);
      const regions = extractAffectedRegions(title, snippet);
      const tags = extractTags(title, snippet, category, regions);

      const aiSummary = generateCrisisSummary(title, snippet, category, lang);

      articles.push({
        id,
        title,
        link: item.link,
        source: feed.name,
        sourceUrl: feed.url,
        pubDate,
        timestamp,
        category,
        lang,
        contentSnippet: snippet.slice(0, 400),
        fullContent: snippet,
        author: rawItem.creator || rawItem.author || feed.name,
        imageUrl: imageUrl || undefined,
        readTimeMinutes,
        aiSummary,
        peaceVotes: Math.floor(Math.random() * 20) + 12,
        alertVotes: Math.floor(Math.random() * 15) + 5,
        commentsCount: 0,
        regions,
        tags
      });
    }

    return articles;
  } catch (err: any) {
    console.warn(`[FeedFetcher] Error fetching "${feed.name}":`, err.message || err);
    return [];
  }
}

export async function syncAllFeeds(force = false): Promise<{
  articles: NewsArticle[];
  sourcesStatus: { [id: string]: { count: number; error?: string } };
}> {
  const now = Date.now();

  if (!force && inMemoryArticles.length > 0 && now - lastSyncTime < CACHE_TTL_MS) {
    return {
      articles: inMemoryArticles,
      sourcesStatus: {}
    };
  }

  if (!force && inMemoryArticles.length === 0) {
    const diskArticles = loadCachedArticles();
    if (diskArticles.length > 0) {
      inMemoryArticles = diskArticles;
      lastSyncTime = now;
      return {
        articles: inMemoryArticles,
        sourcesStatus: {}
      };
    }
  }

  const feeds = getSavedFeeds().filter(f => f.enabled !== false);
  const sourcesStatus: { [id: string]: { count: number; error?: string } } = {};
  const allFetched: NewsArticle[] = [];

  const chunkSize = 5;
  for (let i = 0; i < feeds.length; i += chunkSize) {
    const chunk = feeds.slice(i, i + chunkSize);
    const results = await Promise.allSettled(chunk.map(f => fetchFeed(f)));

    results.forEach((res, index) => {
      const feed = chunk[index];
      if (res.status === "fulfilled") {
        sourcesStatus[feed.id] = { count: res.value.length };
        allFetched.push(...res.value);
      } else {
        sourcesStatus[feed.id] = { count: 0, error: res.reason?.message || "Failed to fetch" };
      }
    });
  }

  const combinedMap = new Map<string, NewsArticle>();
  for (const art of inMemoryArticles) {
    combinedMap.set(art.link, art);
  }
  for (const art of allFetched) {
    combinedMap.set(art.link, art);
  }

  const finalArticles = Array.from(combinedMap.values()).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  if (finalArticles.length > 0) {
    inMemoryArticles = finalArticles.slice(0, 400);
    lastSyncTime = now;
    saveCachedArticles(inMemoryArticles);
  }

  return {
    articles: inMemoryArticles,
    sourcesStatus
  };
}

export async function getNewsArticles(options?: {
  category?: Category;
  lang?: "ko" | "en";
  search?: string;
  source?: string;
  sortBy?: "latest" | "popular" | "readTime";
  limit?: number;
  offset?: number;
}): Promise<{ articles: NewsArticle[]; total: number; updatedAt: string }> {
  if (inMemoryArticles.length === 0) {
    await syncAllFeeds(false);
  }

  let filtered = [...inMemoryArticles];

  if (options?.lang) {
    filtered = filtered.filter(a => (a.lang || "ko") === options.lang);
  }

  if (options?.category && options.category !== "전체 상황실" && options.category !== "All Situation Room") {
    filtered = filtered.filter(a => a.category === options.category);
  }

  if (options?.source) {
    filtered = filtered.filter(a => a.source === options.source);
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.contentSnippet.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.regions.some(r => r.toLowerCase().includes(q)) ||
        a.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (options?.sortBy === "readTime") {
    filtered.sort((a, b) => a.readTimeMinutes - b.readTimeMinutes);
  } else if (options?.sortBy === "popular") {
    filtered.sort((a, b) => ((b.peaceVotes || 0) + (b.alertVotes || 0)) - ((a.peaceVotes || 0) + (a.alertVotes || 0)));
  } else {
    filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  const total = filtered.length;
  const offset = options?.offset || 0;
  const limit = options?.limit || 50;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    articles: paginated,
    total,
    updatedAt: new Date(lastSyncTime || Date.now()).toISOString()
  };
}
