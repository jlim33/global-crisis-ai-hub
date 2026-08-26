"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, ShieldCheck, Flame, Radio, LifeBuoy, Sparkles, Globe2 } from "lucide-react";
import { CrisisTickerItem } from "@/lib/types";

const INITIAL_CRISIS_TICKER: CrisisTickerItem[] = [
  { id: "1", title: "Ukraine / Black Sea: Autonomous AI Drone Interceptions Reported", region: "Eastern Europe", type: "conflict", level: "critical", timeAgo: "12m ago" },
  { id: "2", title: "Amazon Basin: Satellite AI Detects 450+ Active Wildfire Thermal Hotspots", region: "South America", type: "disaster", level: "warning", timeAgo: "25m ago" },
  { id: "3", title: "Pacific Rim: Deep-Sea AI Tsunami Early Warning Network Fully Operational", region: "Asia-Pacific", type: "relief", level: "info", timeAgo: "40m ago" },
  { id: "4", title: "Red Sea & Gulf: AI Maritime Escort Systems Repel Unmanned Vessel Attacks", region: "Middle East", type: "conflict", level: "critical", timeAgo: "1h ago" },
  { id: "5", title: "Geneva UN Summit: 64 Nations Draft Global Treaty Banning Lethal Autonomous Weapons (LAWS)", region: "Global UN", type: "relief", level: "info", timeAgo: "2h ago" },
  { id: "6", title: "Sub-Saharan Africa: AI Crop Yield Prediction Prevents Critical Famine in 4 Drought Zones", region: "Horn of Africa", type: "relief", level: "info", timeAgo: "3h ago" },
];

export function CrisisTicker({ locale = "ko" }: { locale?: "ko" | "en" }) {
  const [tickerItems] = useState<CrisisTickerItem[]>(INITIAL_CRISIS_TICKER);
  const isEn = locale === "en";

  return (
    <div className="w-full bg-slate-950 text-white border-b border-slate-800 overflow-hidden py-2 px-4 flex items-center gap-3 text-xs">
      
      {/* Live Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-crimson-600/20 border border-crimson-500/40 text-crimson-400 font-extrabold tracking-wider uppercase shrink-0 shadow-sm animate-pulse-warning">
        <Radio className="w-3.5 h-3.5 text-crimson-500 fill-current" />
        <span>{isEn ? "Planetary Situation Room" : "지구 위기 상황실 펄스"}</span>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden flex-1 group">
        <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] gap-8">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="inline-flex items-center gap-2 text-slate-300 font-medium select-none"
            >
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase font-mono ${
                item.level === "critical"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : item.level === "warning"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              }`}>
                [{item.region}]
              </span>

              <span className="font-bold text-slate-200 text-xs">
                {item.title}
              </span>

              <span className="text-[10px] font-mono text-slate-400">
                {item.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
