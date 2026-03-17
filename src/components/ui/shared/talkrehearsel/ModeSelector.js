"use client";

import { useEffect, useState } from "react";
import { Eye, Mic, ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";

export default function ModeSelector({ onSelect, onBack }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }
    fetchProfile();
  }, []);

  function handlePractice() {
    if (!profile) {
      toast.error("Please sign in to practice conversations");
      return;
    }
    onSelect("practice");
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Choose Your Mode
        </h2>
        <p className="text-slate-500 font-medium tracking-wide">
          Decide how you want to interact with this conversation session.
        </p>
      </div>

      {/* Mode Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* View Mode */}
        <button
          onClick={() => onSelect("view")}
          className="group relative text-left rounded-[3rem] p-10 bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden"
        >
          <div className="relative z-10 flex flex-col gap-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner">
              <Eye className="w-8 h-8" strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                View Conversation
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                Listen and follow the full scripted dialogue to understand flow and context.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors" />
        </button>

        {/* Practice Mode */}
        <button
          onClick={handlePractice}
          className="group relative text-left rounded-[3rem] p-10 bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden"
        >
          <div className="relative z-10 flex flex-col gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner">
              <Mic className="w-8 h-8" strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Practice Speaking
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                Record your voice and rehearse line by line with real-time feedback.
              </p>

              {!profile && (
                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg w-fit">
                  <Lock size={12} className="text-amber-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                    Sign in required
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors" />
        </button>
      </div>

      {/* Back */}
      <div className="pt-10 border-t border-slate-100 flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
          Change Accent
        </button>
      </div>
    </div>
  );
}
