"use client";

import { useEffect, useState } from "react";

import SituationSelector from "@/components/ui/shared/talkrehearsel/SituationSelector";
import AccentSelector from "@/components/ui/shared/talkrehearsel/AccentSelector";
import ModeSelector from "@/components/ui/shared/talkrehearsel/ModeSelector";
import ConversationView from "@/components/ui/shared/talkrehearsel/ConversationView";
import PracticeView from "@/components/ui/shared/talkrehearsel/PracticeView";
import ActorSelector from "@/components/ui/shared/talkrehearsel/ActorSelector";

export default function TalkRehearselClient() {
  const [state, setState] = useState("IDLE");

  const [situation, setSituation] = useState(null);       // light object
  const [fullSituation, setFullSituation] = useState(null); // fetched data

  const [accent, setAccent] = useState(null);
  const [mode, setMode] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);


  /** Reset everything */
  function reset() {
    setState("IDLE");
    setSituation(null);
    setFullSituation(null);
    setAccent(null);
    setMode(null);
  }

  /** Fetch full situation when selected */
  useEffect(() => {
    if (!situation?.id) return;

    async function loadSituation() {
      try {
        const res = await fetch(
          `/api/talkrehearsel/situation/${situation.id}`
        );
        const data = await res.json();
        setFullSituation(data.situation);
      } catch (err) {
        console.error("Failed to load situation", err);
      }
    }

    loadSituation();
  }, [situation]);

  return (
    <div className="h-screen w-screen bg-gray-50 flex justify-center items-center">
      {/* App Container */}
      <div className="w-full h-full max-w-5xl bg-white shadow-xl flex flex-col">
        
        {/* App Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <h1 className="text-lg font-semibold">TalkRehearsel</h1>

          {state !== "IDLE" && (
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Reset
            </button>
          )}
        </div>

        {/* App Body */}
        <div className="flex-1 overflow-y-auto p-6">
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

          {state === "PRACTICING" && fullSituation && (
            <PracticeView
              situation={fullSituation}
              accent={accent}
              selectedActor={selectedActor}
              onBack={() => setState("MODE_SELECTED")}
            />
          )}

          {state === "ACTOR_SELECTED" && (
            <ActorSelector
              actors={fullSituation.actors}
              onSelect={(actor) => {
                setSelectedActor(actor);
                setState("PRACTICING");
              }}
              onBack={() => setState("MODE_SELECTED")}
            />
          )}

        </div>
      </div>
    </div>
  );
}
