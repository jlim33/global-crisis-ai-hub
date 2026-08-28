"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Radio,
  Search,
  Bookmark,
  Rss,
  RefreshCw,
  Languages,
  ShieldAlert,
  LifeBuoy
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AmbientSoundPlayer } from "./AmbientSoundPlayer";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  nextSyncSeconds: number;
  locale?: "ko" | "en";
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenBriefing: () => void;
  onOpenFeeds: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing,
  nextSyncSeconds,
  locale = "ko",
  bookmarkCount,
  onOpenBookmarks,
  onOpenBriefing,
  onOpenFeeds,
}: HeaderProps) {
  const isEn = locale === "en";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href={isEn ? "/en" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {isEn ? "CrisisPulse" : "글로벌 크라이시스 & AI 펄스"}
                </span>
                <span className="px-1.5 py-0.2 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80">
                  {isEn ? "Global Watch" : "지구 상황실"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                {isEn ? "Planetary Conflict, Climate Disasters & AI Solutions" : "전 세계 AI 군사 분쟁, 기후 재해 & 인도주의 AI 구호 허브"}
              </p>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isEn ? "Search Ukraine, Drones, Wildfire, UN Peace, AI..." : "우크라이나, 가자, 자율무기, 산불, UN 구호, 기후 검색..."}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-500 dark:focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Refresh Timer */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 text-xs font-mono transition-all"
            title={isEn ? "Refresh situation feeds" : "지금 즉시 새로고침"}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-500" : ""}`} />
            <span>{isRefreshing ? "Scanning..." : `${nextSyncSeconds}s`}</span>
          </button>

          {/* Ambient Continuous Audio Lounge */}
          <AmbientSoundPlayer locale={isEn ? "en" : "ko"} />

          {/* Planetary Situation Report Button */}
          <button
            onClick={onOpenBriefing}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            title={isEn ? "Planetary Situation Report" : "일일 지구 상황 리포트"}
          >
            <Radio className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span className="hidden sm:inline">{isEn ? "Situation Report" : "지구상황 리포트"}</span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-cyan-600 hover:border-cyan-300 transition-all shadow-xs"
            title={isEn ? "Saved reports" : "저장한 보고서"}
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Feed Manager */}
          <button
            onClick={onOpenFeeds}
            className="p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-cyan-600 hover:border-cyan-300 transition-all shadow-xs"
            title={isEn ? "Manage crisis feeds" : "피드 관리"}
          >
            <Rss className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <Link
            href={isEn ? "/" : "/en"}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
            title={isEn ? "Switch to Korean Edition" : "글로벌 영문 에디션으로 전환"}
          >
            <Languages className="w-3.5 h-3.5 text-cyan-600" />
            <span>{isEn ? "🇰🇷 KR" : "🇺🇸 Global"}</span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

        </div>
      </div>
    </header>
  );
}
