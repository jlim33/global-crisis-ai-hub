"use client";

import React from "react";
import { Sparkles, AlertTriangle, Clock, ArrowUpRight, Flame, ShieldAlert, MapPin, Radio } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface HeroFeaturedProps {
  articles: NewsArticle[];
  locale?: "ko" | "en";
  onSelectArticle: (article: NewsArticle) => void;
}

export function HeroFeatured({ articles, locale = "ko", onSelectArticle }: HeroFeaturedProps) {
  if (!articles || articles.length === 0) return null;

  const isEn = locale === "en";
  const mainStory = articles[0];
  const sideStories = articles.slice(1, 4);

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

  const isCritical = mainStory.aiSummary?.threatLevel?.includes("1") || mainStory.aiSummary?.threatLevel?.includes("Critical");

  return (
    <div className="w-full my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Lead Crisis */}
        <div
          onClick={() => onSelectArticle(mainStory)}
          className="lg:col-span-7 group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-rose-50/40 to-cyan-50/50 dark:from-slate-900 dark:via-slate-900/60 dark:to-cyan-950/30 border border-rose-100 dark:border-slate-800 hover:border-crimson-400 dark:hover:border-cyan-500 transition-all duration-300 shadow-command hover:shadow-command-hover cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-crimson-600 to-rose-600 text-white shadow-md shadow-crimson-500/25">
                <Radio className="w-3.5 h-3.5 fill-current animate-pulse" />
                {isEn ? "Priority Global Alert" : "지구 위기 최우선 헤드라인"}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
                {mainStory.source}
              </span>

              {mainStory.regions && mainStory.regions.length > 0 && (
                <span className="font-mono text-xs font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-800/60 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {mainStory.regions[0]}
                </span>
              )}

              <span className="text-xs text-slate-400 font-mono ml-auto">
                {formatTime(mainStory.pubDate)}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white group-hover:text-crimson-600 dark:group-hover:text-cyan-400 transition-colors leading-tight mb-4 tracking-tight">
              {mainStory.title}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed mb-6 font-medium">
              {mainStory.aiSummary?.whyItMatters || mainStory.contentSnippet}
            </p>
          </div>

          <div className="pt-4 border-t border-rose-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black border ${
                isCritical
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300"
                  : "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300"
              }`}>
                <ShieldAlert className="w-3.5 h-3.5" />
                {mainStory.aiSummary?.threatLevel || (isEn ? "Level 2: Severe Alert ⚠️" : "2단계: 심각한 분쟁/재난 ⚠️")}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {mainStory.readTimeMinutes} {isEn ? "min read" : "분 분량"}
              </span>
            </div>

            <span className="flex items-center gap-1 text-xs font-black text-crimson-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
              {isEn ? "View Situation Briefing" : "상황실 브리핑 보기"} <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Side Movers */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {sideStories.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectArticle(story)}
              className="group p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-command hover:shadow-command-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                      {story.source}
                    </span>
                    {story.regions && story.regions.length > 0 && (
                      <span className="font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 px-1.5 py-0.2 rounded border border-cyan-200">
                        {story.regions[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {formatTime(story.pubDate)}
                  </span>
                </div>

                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2 leading-snug tracking-tight">
                  {story.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {story.category}
                </span>
                <span className="flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 transition-colors">
                  {isEn ? "AI Takeaway" : "AI 핵심 요약"} <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
