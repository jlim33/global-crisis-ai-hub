"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Bookmark,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Share2,
  Check,
  ShieldAlert,
  HeartHandshake,
  MapPin,
  LifeBuoy,
  Radio,
  AlertTriangle
} from "lucide-react";
import { NewsArticle, AISummary, PeaceAlertState } from "@/lib/types";
import {
  getStoredApiKey,
  getArticlePeaceAlert,
  toggleArticlePeaceAlert
} from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { CrisisComments } from "./CrisisComments";

interface ArticleModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  locale?: "ko" | "en";
  onToggleBookmark: (article: NewsArticle) => void;
  isPlayingAudio: boolean;
  isPausedAudio: boolean;
  onSpeak: (text: string, lang?: "en" | "ko") => void;
  onPauseAudio: () => void;
  onResumeAudio: () => void;
  onStopAudio: () => void;
}

export function ArticleModal({
  article,
  isOpen,
  onClose,
  isBookmarked,
  locale = "ko",
  onToggleBookmark,
  isPlayingAudio,
  isPausedAudio,
  onSpeak,
  onPauseAudio,
  onResumeAudio,
  onStopAudio,
}: ArticleModalProps) {
  const [copied, setCopied] = useState(false);
  const [customSummary, setCustomSummary] = useState<AISummary | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [peaceAlert, setPeaceAlert] = useState<PeaceAlertState>({
    userVote: null,
    peaceCount: 18,
    alertCount: 12,
  });

  const isEn = locale === "en" || article?.lang === "en";

  useEffect(() => {
    if (article) {
      setPeaceAlert(
        getArticlePeaceAlert(
          article.id,
          article.peaceVotes || 18,
          article.alertVotes || 12
        )
      );
      setCustomSummary(null);
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const currentSummary = customSummary || article.aiSummary;

  const handlePeaceVote = () => {
    const updated = toggleArticlePeaceAlert(
      article.id,
      "peace",
      article.peaceVotes || 18,
      article.alertVotes || 12
    );
    setPeaceAlert({ ...updated });
  };

  const handleAlertVote = () => {
    const updated = toggleArticlePeaceAlert(
      article.id,
      "alert",
      article.peaceVotes || 18,
      article.alertVotes || 12
    );
    setPeaceAlert({ ...updated });
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeepAIAnalysis = async () => {
    try {
      setIsGeneratingAI(true);
      const userKey = getStoredApiKey();
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          content: article.fullContent || article.contentSnippet,
          category: article.category,
          apiKey: userKey,
          lang: isEn ? "en" : "ko",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setCustomSummary(data.summary);
        }
      }
    } catch (err) {
      console.error("Deep summary error:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const textToRead = isEn
    ? `${article.title}. Situation Update: ${currentSummary?.tldr?.join(". ") || article.contentSnippet}. Strategic and Humanitarian Impact: ${currentSummary?.whyItMatters || ""}`
    : `${article.title}. 핵심 상황: ${currentSummary?.tldr?.join(". ") || article.contentSnippet}. 안보 및 구호 시사점: ${currentSummary?.whyItMatters || ""}`;

  let formattedDate = isEn ? "Just now" : "방금 전";
  try {
    if (isEn) {
      formattedDate = formatDistanceToNow(new Date(article.pubDate), { addSuffix: true });
    } else {
      formattedDate = formatDistanceToNow(new Date(article.pubDate), { addSuffix: true, locale: ko });
    }
  } catch {}

  const isCritical = currentSummary?.threatLevel?.includes("1") || currentSummary?.threatLevel?.includes("Critical");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      
      {/* Container */}
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {article.source}
            </span>
            {article.regions && article.regions.length > 0 && (
              <span className="font-mono text-xs font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-800/60 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {article.regions[0]}
              </span>
            )}
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              {formattedDate}
            </span>
          </div>

          {/* Actions & Peace/Alert Voting */}
          <div className="flex items-center gap-2">
            
            {/* Peace vs Alert Button Group */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={handlePeaceVote}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  peaceAlert.userVote === "peace"
                    ? "bg-cyan-600 text-white shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:text-cyan-600"
                }`}
                title={isEn ? "Support Peace & Relief" : "평화/구호 지지"}
              >
                <span>🕊️</span>
                <span>{peaceAlert.peaceCount}</span>
              </button>
              <button
                onClick={handleAlertVote}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  peaceAlert.userVote === "alert"
                    ? "bg-crimson-600 text-white shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:text-crimson-600"
                }`}
                title={isEn ? "Flag Urgent Crisis Alert" : "비상 경보"}
              >
                <span>🚨</span>
                <span>{peaceAlert.alertCount}</span>
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-cyan-600 transition-all"
              title={isEn ? "Share link" : "링크 공유"}
            >
              {copied ? <Check className="w-4 h-4 text-cyan-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? "bg-cyan-600 border-cyan-500 text-white shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-cyan-600"
              }`}
              title={isEn ? (isBookmarked ? "Remove bookmark" : "Save report") : (isBookmarked ? "북마크 해제" : "보고서 저장")}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              title={isEn ? "Close (Esc)" : "창 닫기 (Esc)"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto space-y-6">
          
          {/* Title & Byline */}
          <div>
            <div className="mb-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                isCritical
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300"
              }`}>
                <ShieldAlert className="w-4 h-4" />
                {currentSummary?.threatLevel || (isEn ? "Level 2: Severe Alert ⚠️" : "2단계: 심각한 분쟁/재난 ⚠️")}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-3 tracking-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              {article.author && (
                <span>{isEn ? "Reporter:" : "취재/출처:"} <strong className="text-slate-800 dark:text-slate-200">{article.author}</strong></span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTimeMinutes} {isEn ? "min read" : "분 분량"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                {article.category}
              </span>
            </div>
          </div>

          {/* US Native Voice Audio Briefing Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 via-slate-50 to-rose-50 dark:from-cyan-950/40 dark:via-slate-900 dark:to-rose-950/30 border border-cyan-200/70 dark:border-cyan-800/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {isEn ? "Situation Audio Dispatch (US Native Broadcast Voice)" : "지구 상황실 긴급 음성 브리핑 (Audio)"}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isPlayingAudio
                    ? isPausedAudio
                      ? (isEn ? "Situation audio paused." : "음성 브리핑이 일시 정지되었습니다.")
                      : (isEn ? "Broadcasting urgent crisis update with US native voice..." : "전문 브로드캐스트 톤으로 긴급 상황을 낭독 중입니다...")
                    : (isEn ? "Listen to full AI crisis takeaway in native American voice" : "상황 요약과 인도주의적 시사점을 음성으로 청취하세요")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isPlayingAudio ? (
                <button
                  onClick={() => onSpeak(textToRead, isEn ? "en" : "ko")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isEn ? "Listen" : "듣기"}</span>
                </button>
              ) : (
                <>
                  {isPausedAudio ? (
                    <button
                      onClick={onResumeAudio}
                      className="p-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                      title={isEn ? "Resume" : "이어듣기"}
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={onPauseAudio}
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                      title={isEn ? "Pause" : "일시정지"}
                    >
                      <Pause className="w-4 h-4 fill-current" />
                    </button>
                  )}
                  <button
                    onClick={onStopAudio}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs"
                    title={isEn ? "Stop audio" : "재생 중단"}
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AI Situation Room Deep Analysis Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/40 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-black text-sm text-cyan-950 dark:text-cyan-300 tracking-wider">
                  {isEn ? "AI Situation Room Intelligence Breakdown" : "AI 전 지구 상황실 긴급 진단"}
                </span>
              </div>

              <button
                onClick={handleDeepAIAnalysis}
                disabled={isGeneratingAI}
                className="px-3 py-1 rounded-xl bg-cyan-100 dark:bg-cyan-600/20 hover:bg-cyan-200 dark:hover:bg-cyan-600/30 border border-cyan-200 dark:border-cyan-500/30 text-[11px] font-semibold text-cyan-800 dark:text-cyan-300 transition-all flex items-center gap-1.5"
                title={isEn ? "Regenerate AI analysis" : "AI 상황 재진단"}
              >
                <Sparkles className={`w-3 h-3 ${isGeneratingAI ? "animate-spin" : ""}`} />
                <span>{isGeneratingAI ? (isEn ? "Analyzing..." : "분석 중...") : (isEn ? "Re-diagnose" : "재진단")}</span>
              </button>
            </div>

            {/* Bullets */}
            {currentSummary?.tldr && currentSummary.tldr.length > 0 && (
              <ul className="space-y-2.5 mb-5 text-sm text-slate-800 dark:text-slate-200">
                {currentSummary.tldr.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-600 text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Strategic Impact Box */}
            {currentSummary?.whyItMatters && (
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-cyan-100 dark:border-cyan-800/30 text-xs shadow-sm mb-4">
                <span className="font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 block mb-1 text-[11px]">
                  💡 {isEn ? "STRATEGIC & HUMANITARIAN IMPLICATIONS" : "안보 및 인도주의적 시사점"}
                </span>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  {currentSummary.whyItMatters}
                </p>
              </div>
            )}

            {/* AI Dual-Role & Action */}
            <div className="pt-4 border-t border-cyan-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{isEn ? "AI Dual-Role:" : "AI 기술 영향:"}</span>
                <span className="font-black text-rose-800 dark:text-rose-300 px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                  {currentSummary?.aiRole || (isEn ? "Dual-Use Tech 🛰️" : "듀얼유즈 기술 🛰️")}
                </span>
              </div>

              {currentSummary?.affectedRegions && currentSummary.affectedRegions.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isEn ? "Affected Hotspots:" : "주요 영향지역:"}</span>
                  {currentSummary.affectedRegions.map((reg, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-bold border border-slate-200 dark:border-slate-700">
                      {reg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full Report Preview */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isEn ? "Official Field Report Preview" : "현장 상황 보고서 요약"}
            </h3>
            <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
              {article.fullContent || article.contentSnippet}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                #{tag}
              </span>
            ))}
          </div>

          {/* Citizen & Expert Comments Section */}
          <CrisisComments articleId={article.id} locale={isEn ? "en" : "ko"} />

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            {isEn ? "Close" : "닫기"}
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <span>{isEn ? `Read Full Official Report on ${article.source}` : `${article.source} 공식 원문 보고서 보기`}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
