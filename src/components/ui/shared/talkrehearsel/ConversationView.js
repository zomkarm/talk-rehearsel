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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            {situation.title}
          </h2>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Volume2 className="w-4 h-4" />
            Accent: {accent}
          </p>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Controls */}
      <div
        className="
          sticky top-0 z-10
          rounded-xl p-4
          bg-white
          border border-gray-100
          shadow-sm
          flex items-center justify-center gap-3
        "
      >
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg border disabled:opacity-40"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {!isPlaying ? (
          <button
            onClick={play}
            className="p-3 rounded-full bg-emerald-600 text-white shadow"
          >
            <Play className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={pause}
            className="p-3 rounded-full bg-amber-500 text-white shadow"
          >
            <Pause className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={stop}
          className="p-2 rounded-lg border"
        >
          <Square className="w-5 h-5" />
        </button>

        <button
          onClick={next}
          disabled={currentIndex === lines.length - 1}
          className="p-2 rounded-lg border disabled:opacity-40"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Conversation Timeline */}
      <div className="space-y-4">
        {lines.map((line, index) => {
          const isActive = index === currentIndex && isPlaying;

          return (
            <div
              key={line.id}
              className={`
                rounded-xl p-4 border transition
                ${
                  isActive
                    ? "bg-indigo-50 border-indigo-400 shadow-sm"
                    : "bg-white"
                }
              `}
            >
              <div className="text-xs text-slate-500 mb-1">
                {line.actor.name}
              </div>
              <p className="text-slate-800">{line.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
