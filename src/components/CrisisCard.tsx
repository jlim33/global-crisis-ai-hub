"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  HeartHandshake,
  Clock,
  Bookmark,
  Share2,
  Check,
  ExternalLink,
  MessageSquare,
  Volume2,
  Sparkles,
  LifeBuoy,
  AlertTriangle,
  Radio,
  MapPin
} from "lucide-react";
import { NewsArticle, PeaceAlertState } from "@/lib/types";
import {
  getArticlePeaceAlert,
  toggleArticlePeaceAlert,
  getArticleComments
} from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface CrisisCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  locale?: "ko" | "en";
  viewMode?: "grid" | "list";
  onToggleBookmark: (art: NewsArticle) => void;
  onOpenReader: (art: NewsArticle) => void;
  onPlayAudio?: (text: string, lang?: "en" | "ko") => void;
}

export function CrisisCard({
  article,
  isBookmarked,
  locale = "ko",
  onToggleBookmark,
  onOpenReader,
  onPlayAudio,
}: CrisisCardProps) {
  const [copied, setCopied] = useState(false);
  const [peaceAlert, setPeaceAlert] = useState<PeaceAlertState>({
    userVote: null,
    peaceCount: article.peaceVotes || 18,
    alertCount: article.alertVotes || 12,
  });
  const [commentCount, setCommentCount] = useState(0);
  const isEn = locale === "en";

  useEffect(() => {
    setPeaceAlert(
      getArticlePeaceAlert(
        article.id,
        article.peaceVotes || 18,
        article.alertVotes || 12
      )
    );
    const comments = getArticleComments(article.id);
    setCommentCount(comments.length);
  }, [article.id, article.peaceVotes, article.alertVotes]);

  const handlePeaceVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleArticlePeaceAlert(
      article.id,
      "peace",
      article.peaceVotes || 18,
      article.alertVotes || 12
    );
    setPeaceAlert({ ...updated });
  };

  const handleAlertVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleArticlePeaceAlert(
      article.id,
      "alert",
      article.peaceVotes || 18,
      article.alertVotes || 12
    );
    setPeaceAlert({ ...updated });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      if (isEn) {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
      }
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko });
    } catch {
      return isEn ? "Just now" : "방금 전";
    }
  };

  const totalVotes = peaceAlert.peaceCount + peaceAlert.alertCount;
  const peaceRatio = totalVotes > 0 ? Math.round((peaceAlert.peaceCount / totalVotes) * 100) : 60;

  const isCritical = article.aiSummary?.threatLevel?.includes("1") || article.aiSummary?.threatLevel?.includes("Critical");

  return (
    <div
      onClick={() => onOpenReader(article)}
      className="group relative rounded-3xl p-5 sm:p-6 bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-crimson-400 dark:hover:border-cyan-500/80 transition-all duration-300 shadow-command hover:shadow-command-hover cursor-pointer flex flex-col justify-between backdrop-blur-md"
    >
      <div>
        {/* Source & Threat Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {article.source}
            </span>

            {/* Affected Region */}
            {article.regions && article.regions.length > 0 && (
              <span className="font-mono text-[10px] font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-800/60 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                {article.regions[0]}
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {formatTime(article.pubDate)}
          </span>
        </div>

        {/* Threat Level Badge */}
        {article.aiSummary?.threatLevel && (
          <div className="mb-2.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide ${
              isCritical
                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
            }`}>
              {article.aiSummary.threatLevel}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2 mb-3 tracking-tight">
          {article.title}
        </h3>

        {/* Snippet */}
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 font-medium">
          {article.contentSnippet}
        </p>

        {/* AI Dual-Role Diagnostic Pill */}
        {article.aiSummary?.tldr && article.aiSummary.tldr.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-50/80 to-slate-50 dark:from-slate-850 dark:to-cyan-950/20 border border-cyan-200/70 dark:border-cyan-800/40 mb-4 text-xs text-slate-900 dark:text-slate-200">
            <div className="flex items-center justify-between gap-1.5 font-bold text-[10px] uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                {isEn ? "Planetary Intelligence" : "AI 상황실 핵심 진단"}
              </span>
              <span className="text-rose-700 dark:text-rose-400 font-mono font-bold">
                {article.aiSummary.aiRole}
              </span>
            </div>
            <p className="line-clamp-2 leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
              {article.aiSummary.tldr[0]}
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {article.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
          <span className="text-[11px] text-slate-400 font-mono ml-auto flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {article.readTimeMinutes} {isEn ? "min read" : "분"}
          </span>
        </div>
      </div>

      {/* Peace 🕊️ vs Alert 🚨 Voting Gauge Bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <button
            onClick={handlePeaceVote}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
              peaceAlert.userVote === "peace"
                ? "bg-cyan-600 text-white shadow-xs"
                : "text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 border border-cyan-200 dark:border-cyan-800"
            }`}
            title={isEn ? "Support Peace & Relief" : "평화/구호 지지 투표"}
          >
            <span>🕊️ {isEn ? "Peace & Aid" : "평화/구호"}</span>
            <span className="font-mono text-[10px]">({peaceAlert.peaceCount})</span>
          </button>

          <span className="text-[10px] font-mono font-bold text-slate-400">
            {peaceRatio}% Peace Support
          </span>

          <button
            onClick={handleAlertVote}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
              peaceAlert.userVote === "alert"
                ? "bg-crimson-600 text-white shadow-xs"
                : "text-crimson-700 dark:text-crimson-400 bg-crimson-50 dark:bg-crimson-950/40 hover:bg-crimson-100 border border-crimson-200 dark:border-crimson-800"
            }`}
            title={isEn ? "Flag Urgent Crisis Alert" : "비상 경보 투표"}
          >
            <span>🚨 {isEn ? "Alert" : "비상경보"}</span>
            <span className="font-mono text-[10px]">({peaceAlert.alertCount})</span>
          </button>
        </div>

        {/* Gauge Bar */}
        <div className="w-full h-1.5 rounded-full bg-crimson-200 dark:bg-crimson-950 overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${peaceRatio}%` }}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenReader(article);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950 text-slate-600 dark:text-slate-400 hover:text-cyan-600 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-all"
            title={isEn ? "Open Global Discussion" : "토론 보기"}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
            <span>{commentCount}</span>
          </button>

          <div className="flex items-center gap-1">
            {onPlayAudio && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const textToRead = `${article.title}. ${article.aiSummary?.whyItMatters || article.contentSnippet}`;
                  onPlayAudio(textToRead, isEn ? "en" : "ko");
                }}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-cyan-600 transition-all"
                title={isEn ? "Audio dispatch (US Voice)" : "AI 상황 브리핑 듣기"}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-cyan-600 transition-all"
              title={isEn ? "Share link" : "링크 복사"}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cyan-500" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(article);
              }}
              className={`p-1.5 rounded-xl border transition-all ${
                isBookmarked
                  ? "bg-cyan-600 border-cyan-500 text-white shadow-sm"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-cyan-600"
              }`}
              title={isBookmarked ? (isEn ? "Remove bookmark" : "북마크 해제") : (isEn ? "Bookmark report" : "보고서 저장")}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>

            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-cyan-600 transition-all"
              title={isEn ? "Official dispatch source" : "원문 기사"}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
