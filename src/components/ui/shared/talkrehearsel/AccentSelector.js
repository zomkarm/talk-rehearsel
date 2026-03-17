"use client";

import { ArrowLeft, Mic } from "lucide-react";

const ACCENTS = [
  { code: "en-US", label: "American English" },
  { code: "en-GB", label: "British English" },
];

export default function AccentSelector({ onSelect, onBack }) {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Choose Accent
        </h2>
        <p className="text-slate-500 font-medium tracking-wide">
          Select the speaking style you want to practice with for this session.
        </p>
      </div>

      {/* Accent Grid - Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACCENTS.map((accent) => (
          <button
            key={accent.code}
            onClick={() => onSelect(accent.code)}
            className="
              group relative flex flex-col items-center gap-6
              rounded-[2.5rem] p-10 text-center
              bg-white border border-slate-200
              shadow-sm hover:shadow-xl hover:shadow-teal-500/5 
              hover:-translate-y-1 transition-all duration-300
            "
          >
            {/* Animated Icon Container */}
            <div className="
              w-16 h-16 rounded-[1.5rem]
              bg-slate-50 text-slate-400
              flex items-center justify-center
              group-hover:bg-teal-500 group-hover:text-white group-hover:rotate-6
              transition-all duration-500 shadow-inner
            ">
              <Mic className="w-7 h-7" strokeWidth={2.5} />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500 opacity-80">
                {accent.code}
              </div>
              <div className="text-lg font-black text-slate-800 tracking-tight">
                {accent.label}
              </div>
            </div>

            {/* Subtle Selection Indicator */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-slate-100 group-hover:bg-teal-500 transition-colors" />
          </button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="pt-10 border-t border-slate-100 flex justify-center">
        <button
          onClick={onBack}
          className="
            flex items-center gap-2 px-8 py-3 
            rounded-xl font-black text-xs uppercase tracking-widest 
            text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 
            transition-all duration-300
          "
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
          Back to Situations
        </button>
      </div>
    </div>
  );
}
