"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Mic,
  PlayCircle,
  Users,
  ArrowLeft
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
    <main className="flex-1 h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-tl-xl overflow-y-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Talk Rehearsal
          </h1>
          <p className="text-sm text-slate-600">
            Practice real conversations with guided audio
          </p>
        </div>

        {state === "IDLE" && (
          <button
            onClick={ ()=> {
                router.push('/dashboard')
              }}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {state !== "IDLE" && (
          <button
            onClick={reset}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Step Indicator (Glass) */}
      <div className="flex items-center gap-6 rounded-xl px-6 py-4
                      bg-white/60 backdrop-blur-md border border-white/40 shadow-sm">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStepIndex;
          const isDone = index < activeStepIndex;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                isActive
                  ? "text-indigo-700"
                  : isDone
                  ? "text-slate-700"
                  : "text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              {step.label}
            </div>
          );
        })}
      </div>

      {/* Context Summary */}
      {(situation || accent || mode) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {situation && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-200 to-indigo-100 border border-indigo-200/50">
              <div className="text-xs text-indigo-600 mb-1">Situation</div>
              <div className="font-medium text-slate-800">
                {situation.title}
              </div>
            </div>
          )}

          {accent && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50">
              <div className="text-xs text-emerald-600 mb-1">Accent</div>
              <div className="font-medium text-slate-800">
                {accent}
              </div>
            </div>
          )}

          {mode && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/50">
              <div className="text-xs text-amber-600 mb-1">Mode</div>
              <div className="font-medium text-slate-800 capitalize">
                {mode}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Flow Container */}
      <div className="rounded-2xl p-6
                      bg-white/70 backdrop-blur-lg
                      border border-white/40
                      shadow-xl">

        {state === "IDLE" && (
          <SituationSelector
            onSelect={(s) => {
              setSituation(s);
              setState("ACCENT_SELECTED");
            }}
          />
        )}

        {state === "ACCENT_SELECTED" && (
          <AccentSelector
            onSelect={(a) => {
              setAccent(a);
              setState("MODE_SELECTED");
            }}
            onBack={reset}
          />
        )}

        {state === "MODE_SELECTED" && (
          <ModeSelector
            onSelect={(m) => {
              setMode(m);
              setState(m === "view" ? "VIEWING" : "ACTOR_SELECTED");
            }}
            onBack={() => setState("ACCENT_SELECTED")}
          />
        )}

        {state === "VIEWING" && fullSituation && (
          <ConversationView
            situation={fullSituation}
            accent={accent}
            onBack={() => setState("MODE_SELECTED")}
          />
        )}

        {state === "ACTOR_SELECTED" && fullSituation && (
          <ActorSelector
            actors={fullSituation.actors}
            onSelect={(actor) => {
              setSelectedActor(actor);
              setState("PRACTICING");
            }}
            onBack={() => setState("MODE_SELECTED")}
          />
        )}

        {state === "PRACTICING" && fullSituation && (
          <PracticeView
            situation={fullSituation}
            accent={accent}
            selectedActor={selectedActor}
            onBack={() => setState("MODE_SELECTED")}
          />
        )}
      </div>
    </main>
  );
}
