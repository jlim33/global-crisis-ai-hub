"use client";

import React, { useState } from "react";
import { X, Rss, Plus, RefreshCw } from "lucide-react";
import { FeedSource, Category } from "@/lib/types";

interface FeedManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeds: FeedSource[];
  locale?: "ko" | "en";
  onToggleFeed: (feedId: string) => void;
  onAddCustomFeed: (feed: Partial<FeedSource>) => void;
  onResetFeeds: () => void;
}

export function FeedManagerModal({
  isOpen,
  onClose,
  feeds,
  locale = "ko",
  onToggleFeed,
  onAddCustomFeed,
  onResetFeeds,
}: FeedManagerModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Category>(locale === "en" ? "AI Warfare & Autonomous Systems" : "AI 군사 & 자율무기");
  const isEn = locale === "en";

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    onAddCustomFeed({
      id: "custom-" + Date.now(),
      name: name.trim(),
      url: url.trim(),
      category,
      enabled: true,
      isCustom: true,
      type: "rss",
      lang: isEn ? "en" : "ko",
    });

    setName("");
    setUrl("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {isEn ? "Crisis & Disaster Intelligence Feeds" : "위기 및 재난 인텔리전스 피드 관리"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? "Customize UN, defense AI, and climate observation RSS feeds" : "UN 기구, 국방 AI 연구, 기후 관측소 RSS 소스를 관리하세요"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
          
          {/* Add Custom Feed Form */}
          <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/40 space-y-3">
            <h4 className="text-xs font-black uppercase text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              {isEn ? "Add Custom Emergency Source" : "맞춤 긴급 피드 소스 등록"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? "Source Name (e.g. Red Cross Relief)" : "기관/미디어 이름 (예: 국제적십자)"}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500"
              >
                {isEn ? (
                  <>
                    <option value="AI Warfare & Autonomous Systems">AI Warfare & Autonomous Systems</option>
                    <option value="Geopolitical Conflicts & Cyber">Geopolitical Conflicts & Cyber</option>
                    <option value="Climate Crisis & Disasters">Climate Crisis & Disasters</option>
                    <option value="AI Relief & Prediction Tech">AI Relief & Prediction Tech</option>
                    <option value="Global Peace & Human Aid">Global Peace & Human Aid</option>
                    <option value="Energy & Food Security">Energy & Food Security</option>
                  </>
                ) : (
                  <>
                    <option value="AI 군사 & 자율무기">AI 군사 & 자율무기</option>
                    <option value="지정학적 분쟁 & 사이버전">지정학적 분쟁 & 사이버전</option>
                    <option value="기후위기 & 자연재해">기후위기 & 자연재해</option>
                    <option value="AI 재난예측 & 구호기술">AI 재난예측 & 구호기술</option>
                    <option value="글로벌 평화 & 인도적 지원">글로벌 평화 & 인도적 지원</option>
                    <option value="에너지 & 식량 안보">에너지 & 식량 안보</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://reliefweb.int/rss.xml"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shrink-0 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? "Add Source" : "소스 추가"}</span>
              </button>
            </div>
          </form>

          {/* Feeds List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>{isEn ? "Monitored Intelligence Sources" : "모니터링 피드 목록"} ({feeds.length})</span>
              <button
                onClick={onResetFeeds}
                className="flex items-center gap-1 text-[11px] text-cyan-600 hover:text-cyan-700 font-bold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isEn ? "Reset Defaults" : "기본값 초기화"}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {feeds.map((feed) => (
                <div
                  key={feed.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={feed.enabled !== false}
                      onChange={() => onToggleFeed(feed.id)}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {feed.name}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold shrink-0">
                          {feed.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate font-mono">
                        {feed.url}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    feed.enabled !== false
                      ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {feed.enabled !== false ? (isEn ? "Active" : "활성") : (isEn ? "Disabled" : "비활성")}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
