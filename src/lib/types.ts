export type Category =
  // Korean Categories
  | "전체 상황실"
  | "AI 군사 & 자율무기"
  | "지정학적 분쟁 & 사이버전"
  | "기후위기 & 자연재해"
  | "AI 재난예측 & 구호기술"
  | "글로벌 평화 & 인도적 지원"
  | "에너지 & 식량 안보"
  // English Categories
  | "All Situation Room"
  | "AI Warfare & Autonomous Systems"
  | "Geopolitical Conflicts & Cyber"
  | "Climate Crisis & Disasters"
  | "AI Relief & Prediction Tech"
  | "Global Peace & Human Aid"
  | "Energy & Food Security";

export type ThreatLevel =
  | "Level 1: Critical Emergency 🚨"
  | "Level 2: Severe Alert ⚠️"
  | "Level 3: Moderate Risk ⚡"
  | "Level 4: Relief in Progress 🕊️"
  | "1단계: 최고 비상 위기 🚨"
  | "2단계: 심각한 분쟁/재난 ⚠️"
  | "3단계: 주시 및 경계 ⚡"
  | "4단계: 구호 및 복구 진행 🕊️";

export type AIRoleImpact =
  | "Autonomous Weaponry Risk ⚔️"
  | "AI Humanitarian Rescue & Disaster Prediction 🌐"
  | "Dual-Use Cyber & Space Tech 🛰️"
  | "Policy & Global Governance 📜"
  | "자율무기/군사적 위험 ⚔️"
  | "AI 인도주의 구호 & 조기경보 🌐"
  | "사이버/우주 듀얼유즈 기술 🛰️"
  | "글로벌 규범 및 평화 정책 📜";

export interface AISummary {
  tldr: string[];
  whyItMatters: string;
  threatLevel: ThreatLevel;
  aiRole: AIRoleImpact;
  affectedRegions: string[]; // e.g. ["Ukraine", "Gaza", "Pacific Basin", "Arctic"]
  humanitarianAction: string; // Actionable call or relief update
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  avatarColor: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface PeaceAlertState {
  userVote: "peace" | "alert" | null;
  peaceCount: number; // 🕊️ Peace & Relief votes
  alertCount: number; // 🚨 Emergency Alert votes
}

export interface CrisisTickerItem {
  id: string;
  title: string;
  region: string;
  type: "conflict" | "disaster" | "relief" | "tech";
  level: "critical" | "warning" | "info";
  timeAgo: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceUrl?: string;
  pubDate: string;
  timestamp: number;
  category: Category;
  lang?: "ko" | "en";
  contentSnippet: string;
  fullContent?: string;
  author?: string;
  imageUrl?: string;
  readTimeMinutes: number;
  aiSummary?: AISummary;
  peaceVotes?: number;
  alertVotes?: number;
  commentsCount?: number;
  regions: string[];
  tags: string[];
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: Category;
  enabled: boolean;
  isCustom?: boolean;
  type: "rss" | "atom" | "json";
  lang?: "ko" | "en";
  icon?: string;
}

export interface SyncResponse {
  articles: NewsArticle[];
  total: number;
  updatedAt: string;
  sourcesStatus: { [feedId: string]: { count: number; error?: string } };
}
