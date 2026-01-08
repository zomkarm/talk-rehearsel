"use client";

import { ArrowLeft, Mic } from "lucide-react";

const ACCENTS = [
  { code: "en-US", label: "American English" },
  { code: "en-GB", label: "British English" },
];

export default function AccentSelector({ onSelect, onBack }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Choose Accent
        </h2>
        <p className="text-sm text-slate-600">
          Select the speaking style you want to practice with
        </p>
      </div>

      {/* Accent Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ACCENTS.map((accent) => (
          <button
            key={accent.code}
            onClick={() => onSelect(accent.code)}
            className="
              group flex flex-col items-center gap-2
              rounded-xl p-5 text-left
              bg-white/70 backdrop-blur-md
              border border-white/40
              shadow-sm
              hover:shadow-md hover:border-indigo-300
              transition
            "
          >
            <div className="
              w-10 h-10 rounded-lg
              bg-indigo-100 text-indigo-600
              flex items-center justify-center
              group-hover:bg-indigo-600 group-hover:text-white
              transition
            ">
              <Mic className="w-5 h-5" />
            </div>

            <div className="text-center">
              <div className="font-medium text-slate-800">
                {accent.code}
              </div>
              <div className="text-xs text-slate-500">
                {accent.label}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  );
}
