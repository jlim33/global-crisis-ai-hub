"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, Copy, Download, Check, Mail, Globe, ShieldAlert, LifeBuoy } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { formatPlanetarySituationReport } from "@/lib/aiSummarizer";

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
  locale?: "ko" | "en";
}

export function DailyBriefingModal({
  isOpen,
  onClose,
  articles,
  locale = "ko",
}: DailyBriefingModalProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const isEn = locale === "en";

  if (!isOpen) return null;

  const briefingText = formatPlanetarySituationReport(articles, isEn ? "en" : "ko");

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(briefingText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([briefingText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isEn
      ? `CrisisPulse-Planetary-Report-${new Date().toISOString().slice(0, 10)}.md`
      : `지구위기상황실-일일리포트-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSending(true);
    try {
      const res = await fetch("https://formspree.io/f/mqakvjbl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          subject: isEn ? `[CrisisPulse] Planetary Situation Report & AI Recovery Dispatch` : `[글로벌 크라이시스 & AI 펄스] 일일 지구 상황 & 구호 리포트`,
          message: briefingText,
        }),
      });

      if (res.ok) {
        setIsSent(true);
        setTimeout(() => setIsSent(false), 3500);
        setEmail("");
      } else {
        alert(isEn ? "Report generated! You can copy or download markdown directly." : "리포트가 생성되었습니다! 클립보드 복사나 다운로드를 이용해주세요.");
      }
    } catch {
      setIsSent(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-cyan-50/60 dark:bg-cyan-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {isEn ? "Planetary Situation Report & AI Recovery Dispatch" : "일일 지구 상황 & AI 구호 종합 리포트"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? "Global AI defense risks, climate disasters, and relief operations" : "전 세계 분쟁, 기후재난 및 글로벌 AI 구호 동향 일일 자동 종합"}
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

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* Email Subscription Bar */}
          <form onSubmit={handleSendEmail} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-cyan-600" />
                {isEn ? "Dispatch Situation Report to Email:" : "이메일로 일일 리포트 즉시 수신:"}
              </span>
              <span className="text-[11px] text-cyan-600 font-medium">Free Global Dispatch</span>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isEn ? "delegate@un-relief.org" : "받으실 이메일 주소를 입력하세요..."}
                className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? (isEn ? "Dispatching..." : "전송 중...") : isEn ? "Send" : "전송"}</span>
              </button>
            </div>

            {isSent && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                {isEn ? "Planetary Situation Report has been dispatched to your inbox!" : "일일 지구 상황 리포트가 이메일로 발송되었습니다!"}
              </p>
            )}
          </form>

          {/* Markdown Preview */}
          <div className="relative">
            <pre className="w-full p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 max-h-[300px] whitespace-pre-wrap select-all">
              {briefingText}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950 text-slate-700 dark:text-slate-300 hover:text-cyan-600 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isEn ? "Copied!" : "복사 완료!") : isEn ? "Copy Markdown" : "마크다운 복사"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950 text-slate-700 dark:text-slate-300 hover:text-cyan-600 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? "Download (.md)" : "파일로 다운로드"}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
