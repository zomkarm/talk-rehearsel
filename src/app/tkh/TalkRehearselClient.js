"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Mic,
  PlayCircle,
  Users,
  ArrowLeft,
  CheckCircle2, Circle, ChevronRight, Layout, Globe, Activity, Settings2
} from "lucide-react";
import { useRouter } from 'next/navigation'

import SituationSelector from "@/components/ui/shared/talkrehearsel/SituationSelector";
import AccentSelector from "@/components/ui/shared/talkrehearsel/AccentSelector";
import ModeSelector from "@/components/ui/shared/talkrehearsel/ModeSelector";
import ConversationView from "@/components/ui/shared/talkrehearsel/ConversationView";
import PracticeView from "@/components/ui/shared/talkrehearsel/PracticeView";
import ActorSelector from "@/components/ui/shared/talkrehearsel/ActorSelector";

const STEPS = [
  { key: "IDLE", label: "Situation", icon: BookOpen },
  { key: "ACCENT_SELECTED", label: "Accent", icon: Mic },
  { key: "MODE_SELECTED", label: "Mode", icon: PlayCircle },
  { key: "ACTOR_SELECTED", label: "Actor", icon: Users },
];

export default function TalkRehearselClient() {
  const [state, setState] = useState("IDLE");

  const [situation, setSituation] = useState(null);
  const [fullSituation, setFullSituation] = useState(null);

  const [accent, setAccent] = useState(null);
  const [mode, setMode] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const router = useRouter()

  function reset() {
    setState("IDLE");
    setSituation(null);
    setFullSituation(null);
    setAccent(null);
    setMode(null);
    setSelectedActor(null);
  }

  useEffect(() => {
    if (!situation?.id) return;

    async function loadSituation() {
      const res = await fetch(`/api/talkrehearsel/situation/${situation.id}`);
      const data = await res.json();
      setFullSituation(data.situation);
    }

    loadSituation();
  }, [situation]);

  const activeStepIndex = STEPS.findIndex(s => s.key === state);

  return (
    <main className="flex-1 min-h-screen bg-gradient-to-br from-indigo-50 to-teal-50 p-6 lg:p-12 overflow-y-auto relative">
      
      {/* Subtle Atmospheric Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-50/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* ================= Header ================= */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              <div className="w-1.5 h-10 bg-gradient-to-t from-indigo-600 via-teal-400 to-teal-300 rounded-full" />
              Talk Rehearsal
            </h1>
            <p className="text-slate-500 font-semibold text-xs ml-5 uppercase tracking-widest opacity-80">
              Practice real conversations
            </p>
          </div>

          <button
            onClick={state === "IDLE" ? () => router.push('/user/dashboard') : reset}
            className="group flex items-center gap-3 px-8 py-3 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
            {state === "IDLE" ? "Exit" : "Reset Session"}
          </button>
        </section>

        {/* ================= Step Indicator ================= */}
        <nav className="flex items-center justify-between gap-2 p-2 bg-white/60 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-x-auto no-scrollbar">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStepIndex;
            const isDone = index < activeStepIndex;

            return (
              <div key={step.key} className="flex items-center flex-1 min-w-fit">
                <div className={`flex items-center gap-3 px-6 py-3 rounded-[1.8rem] transition-all duration-500 ${
                  isActive ? "bg-white shadow-lg shadow-indigo-100 scale-105" : ""
                }`}>
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                    isActive ? "bg-indigo-600 text-white rotate-6 shadow-indigo-200 shadow-lg" : isDone ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {isDone ? <CheckCircle2 size={18} strokeWidth={3} /> : <Icon size={18} strokeWidth={isActive ? 3 : 2} />}
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-tighter ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="h-px w-full bg-slate-200/60 mx-4 hidden lg:block" />
                )}
              </div>
            );
          })}
        </nav>

        {/* ================= Main Content Area ================= */}
        <div className="grid grid-cols-1 gap-8">
          {/* Context Summary Bar */}
          {(situation || accent || mode) && (
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Situation', val: situation?.title, color: 'bg-indigo-600', text: 'text-indigo-600' },
                { label: 'Accent', val: accent, color: 'bg-teal-500', text: 'text-teal-600' },
                { label: 'Mode', val: mode, color: 'bg-amber-500', text: 'text-amber-600' }
              ].map((item, i) => item.val && (
                <div key={i} className="flex items-center gap-4 px-6 py-4 bg-white/80 border border-white rounded-[2rem] shadow-sm">
                  <div className={`w-1.5 h-10 rounded-full ${item.color}`} />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-0.5">{item.label}</p>
                    <p className="font-extrabold text-slate-800 capitalize leading-none">{item.val}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Main Flow Container */}
          <section className="rounded-xl bg-white border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.04)] p-6 md:p-8 relative transition-all duration-700">
            <div className="relative z-10 h-full">
              {state === "IDLE" && (
                <SituationSelector onSelect={(s) => { setSituation(s); setState("ACCENT_SELECTED"); }} />
              )}

              {state === "ACCENT_SELECTED" && (
                <AccentSelector onSelect={(a) => { setAccent(a); setState("MODE_SELECTED"); }} onBack={reset} />
              )}

              {state === "MODE_SELECTED" && (
                <ModeSelector onSelect={(m) => { setMode(m); setState(m === "view" ? "VIEWING" : "ACTOR_SELECTED"); }} onBack={() => setState("ACCENT_SELECTED")} />
              )}

              {state === "VIEWING" && fullSituation && (
                <ConversationView situation={fullSituation} accent={accent} onBack={() => setState("MODE_SELECTED")} />
              )}

              {state === "ACTOR_SELECTED" && fullSituation && (
                <ActorSelector actors={fullSituation.actors} onSelect={(actor) => { setSelectedActor(actor); setState("PRACTICING"); }} onBack={() => setState("MODE_SELECTED")} onBackToRecordings={() => router.push('/user/recordings')} />
              )}

              {state === "PRACTICING" && fullSituation && (
                <PracticeView situation={fullSituation} accent={accent} selectedActor={selectedActor} onBack={() => setState("MODE_SELECTED")} onBackToRecordings={() => router.push('/user/recordings')} />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
