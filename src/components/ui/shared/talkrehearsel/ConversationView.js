"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  ArrowLeft,
  Volume2
} from "lucide-react";
import Portal from '@/components/ui/shared/Portal'

export default function ConversationView({ situation, accent, onBack }) {
  const lines = [...situation.lines].sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  /* -----------------------------
     Core audio loader
  ----------------------------- */
  function loadAndPlay(index) {
    const line = lines[index];
    if (!line) return;

    const voice = line.voices.find(v => v.accent === accent);
    if (!voice?.audio_src) {
      setCurrentIndex(i => i + 1);
      return;
    }

    audioRef.current?.pause();

    const audio = new Audio(voice.audio_src);
    audioRef.current = audio;

    audio.onended = () => {
      if (index + 1 < lines.length) {
        setCurrentIndex(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.play().catch(() => {});
  }

  /* -----------------------------
     Controls
  ----------------------------- */
  function play() {
    setIsPlaying(true);
  }

  function pause() {
    audioRef.current?.pause();
    setIsPlaying(false);
  }

  function stop() {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsPlaying(false);
    setCurrentIndex(0);
  }

  function next() {
    if (currentIndex + 1 < lines.length) {
      setCurrentIndex(i => i + 1);
      setIsPlaying(true);
    }
  }

  function prev() {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setIsPlaying(true);
    }
  }

  /* -----------------------------
     Auto-play driver
  ----------------------------- */
  useEffect(() => {
    if (!isPlaying) return;
    loadAndPlay(currentIndex);
  }, [currentIndex, isPlaying]);

  /* -----------------------------
     Cleanup
  ----------------------------- */
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

return (
  <div className="space-y-10">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {situation.title}
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
            <Volume2 className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[11px] font-black uppercase tracking-widest text-teal-700">
              {accent} Accent
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={3} />
        Exit Viewer
      </button>
    </div>

    {/* Floating Studio Controls */}
{/* Portaled Floating Controls */}
<Portal>
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-6">
    <div className="flex items-center gap-4 p-3 bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <button
        onClick={prev}
        disabled={currentIndex === 0}
        className="p-3 rounded-full text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
      >
        <SkipBack className="w-5 h-5" fill="currentColor" />
      </button>

      {!isPlaying ? (
        <button
          onClick={play}
          className="p-5 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all"
        >
          <Play className="w-6 h-6" fill="currentColor" />
        </button>
      ) : (
        <button
          onClick={pause}
          className="p-5 rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all"
        >
          <Pause className="w-6 h-6" fill="currentColor" />
        </button>
      )}

      <button
        onClick={stop}
        className="p-3 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <Square className="w-5 h-5" fill="currentColor" />
      </button>

      <button
        onClick={next}
        disabled={currentIndex === lines.length - 1}
        className="p-3 rounded-full text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
      >
        <SkipForward className="w-5 h-5" fill="currentColor" />
      </button>

      {/* Mini Session Info - Optional for Portal context */}
      <div className="hidden md:flex flex-col border-l border-white/10 pl-4 pr-2">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Playing</span>
        <span className="text-[10px] font-bold text-white truncate max-w-[100px]">{situation.title}</span>
      </div>
    </div>
  </div>
</Portal>

    {/* Conversation Timeline */}
    <div className="max-w-3xl mx-auto space-y-6">
      {lines.map((line, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={line.id}
            className={`
              relative group rounded-[2rem] p-8 border transition-all duration-500
              ${isActive 
                ? "bg-white border-indigo-200 shadow-xl shadow-indigo-100/50 scale-105 z-10" 
                : "bg-slate-50/50 border-transparent opacity-60 hover:opacity-100"
              }
            `}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                  {line.actor.name}
                </span>
                {isActive && (
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce delay-75" />
                    <div className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce delay-150" />
                  </div>
                )}
              </div>
              <p className={`text-lg font-bold leading-relaxed ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                "{line.text}"
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}
