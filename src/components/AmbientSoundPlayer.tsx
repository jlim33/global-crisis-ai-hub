"use client";

import React, { useState } from "react";
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Sparkles,
  Coffee,
  CloudRain,
  Shuffle,
  Repeat,
  ChevronUp,
  ChevronDown,
  Globe
} from "lucide-react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { AudioTrack } from "@/lib/audioTracks";

export function AmbientSoundPlayer({ locale = "ko" }: { locale?: "ko" | "en" }) {
  const {
    isPlaying,
    isLoading,
    currentTrack,
    tracks,
    volume,
    isMuted,
    isShuffle,
    autoAdvance,
    playTrack,
    togglePlay,
    setVolume,
    toggleMute,
    selectNextTrack,
    selectPrevTrack,
    toggleShuffle,
    toggleAutoAdvance,
  } = useAmbientAudio();

  const [isExpanded, setIsExpanded] = useState(false);
  const isEn = locale === "en";

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "classical":
        return <Music className="w-3.5 h-3.5 text-blue-400" />;
      case "ambient":
        return <Coffee className="w-3.5 h-3.5 text-amber-400" />;
      case "meditation":
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case "nature":
        return <CloudRain className="w-3.5 h-3.5 text-teal-400" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      
      {/* Mini Player Capsule */}
      <div className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-xs backdrop-blur-md">
        
        {/* Previous Track */}
        <button
          onClick={selectPrevTrack}
          className="p-1 rounded-lg text-slate-400 hover:text-blue-400 transition-colors hidden sm:block"
          title={isEn ? "Previous song" : "이전 곡"}
        >
          <SkipBack className="w-3 h-3" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
            isPlaying
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-105"
              : "bg-slate-800 text-slate-300 border border-slate-700 hover:text-blue-400"
          }`}
          title={isPlaying ? (isEn ? "Pause Audio" : "BGM 일시정지") : (isEn ? "Play Audio Lounge" : "상황실 BGM 재생")}
        >
          {isLoading ? (
            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Next Track */}
        <button
          onClick={selectNextTrack}
          className="p-1 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"
          title={isEn ? "Next song" : "다음 곡"}
        >
          <SkipForward className="w-3 h-3" />
        </button>

        {/* Track Title */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 cursor-pointer select-none max-w-[120px] sm:max-w-[170px]"
        >
          <span className="hidden sm:inline">
            {getCategoryIcon(currentTrack.category)}
          </span>
          <div className="truncate">
            <p className="text-[11px] font-bold text-slate-200 truncate">
              {currentTrack.title}
            </p>
            <p className="text-[9px] text-blue-400 font-semibold truncate flex items-center gap-1">
              {isPlaying ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isEn ? "Continuous Play" : "연속 자동 재생 중"}</span>
                </>
              ) : isEn ? "Situation Room Audio" : "평화 힐링 BGM"}
            </p>
          </div>
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Sound Lounge Modal */}
      {isExpanded && (
        <div className="absolute right-0 top-12 z-50 w-72 sm:w-84 p-4 rounded-3xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-950 text-blue-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">
                  {isEn ? "Planetary Audio Lounge" : "글로벌 평화 사운드 라운지"}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {isEn ? "Continuous Ambient & Classical Stream" : "클래식, 528Hz 평화 주파수 전곡 연속 재생"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs text-slate-400 hover:text-slate-200 font-bold"
            >
              ✕
            </button>
          </div>

          {/* Autoplay & Shuffle Toggle */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-800/60 border border-slate-700 mb-3 text-xs">
            <button
              onClick={toggleAutoAdvance}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all text-[11px] ${
                autoAdvance
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              <Repeat className="w-3 h-3" />
              <span>{isEn ? "Autoplay Next" : "다음 곡 자동 재생"}</span>
            </button>

            <button
              onClick={toggleShuffle}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all text-[11px] ${
                isShuffle
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              <Shuffle className="w-3 h-3" />
              <span>{isEn ? "Shuffle" : "셔플"}</span>
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-800 border border-slate-700 mb-3">
            <button
              onClick={selectPrevTrack}
              className="p-1 rounded-lg text-slate-400 hover:text-blue-400"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={togglePlay}
              className="p-1 rounded-lg text-blue-400 hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={selectNextTrack}
              className="p-1 rounded-lg text-slate-400 hover:text-blue-400"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1 rounded-lg text-slate-400 hover:text-blue-400 ml-1"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-slate-700 accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Track List */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {tracks.map((track) => {
              const isSelected = track.id === currentTrack.id;
              return (
                <button
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={`w-full p-2 rounded-2xl text-left transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-blue-950/60 border border-blue-600 text-blue-200 shadow-xs"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getCategoryIcon(track.category)}
                    <div className="truncate">
                      <p className="text-[11px] font-bold truncate">{track.title}</p>
                      <p className="text-[9px] text-slate-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                    {track.categoryLabel}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
