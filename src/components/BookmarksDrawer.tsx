"use client";

import React from "react";
import { X, Bookmark, Trash2, ArrowRight, Download, ShieldAlert } from "lucide-react";
import { NewsArticle } from "@/lib/types";

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: NewsArticle[];
  locale?: "ko" | "en";
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (article: NewsArticle) => void;
}

export function BookmarksDrawer({
  isOpen,
  onClose,
  bookmarks,
  locale = "ko",
  onSelectArticle,
  onRemoveBookmark,
}: BookmarksDrawerProps) {
  if (!isOpen) return null;

  const isEn = locale === "en";

  const exportBookmarksJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CrisisPulse-Saved-Reports-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                <Bookmark className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {isEn ? "Saved Crisis Reports" : "저장한 상황 보고서"}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {bookmarks.length} {isEn ? "items saved" : "개 보관됨"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            {bookmarks.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p className="font-bold mb-1">{isEn ? "No saved reports yet" : "저장된 보고서가 없습니다"}</p>
                <p>{isEn ? "Click the bookmark icon on any card to save it here." : "보고서 카드의 북마크 아이콘을 눌러 저장해보세요."}</p>
              </div>
            ) : (
              bookmarks.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    onSelectArticle(art);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-400 transition-all cursor-pointer group flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {art.source}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(art);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                      title={isEn ? "Remove" : "삭제"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 line-clamp-2">
                    {art.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{art.category}</span>
                    <span className="flex items-center gap-1 text-cyan-600 font-bold">
                      {isEn ? "Read" : "보기"} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {bookmarks.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <button
                onClick={exportBookmarksJSON}
                className="w-full py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isEn ? "Export Reports (JSON)" : "보고서 내보내기 (JSON)"}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
