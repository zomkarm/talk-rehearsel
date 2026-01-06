"use client";

import { useEffect, useState } from "react";
import { Eye, Mic, ArrowLeft } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Choose Mode
        </h2>
        <p className="text-sm text-slate-600">
          Decide how you want to interact with this conversation
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* View Mode */}
        <button
          onClick={() => onSelect("view")}
          className="
            group text-left
            rounded-xl p-6
            bg-white/70 backdrop-blur-md
            border border-white/40
            shadow-sm
            hover:shadow-md hover:border-indigo-300
            transition
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                w-12 h-12 rounded-lg
                bg-indigo-100 text-indigo-600
                flex items-center justify-center
                group-hover:bg-indigo-600 group-hover:text-white
                transition
              "
            >
              <Eye className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="font-medium text-slate-800">
                View Conversation
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Listen and follow the full scripted dialogue
              </p>
            </div>
          </div>
        </button>

        {/* Practice Mode */}
        <button
          onClick={handlePractice}
          className="
            group text-left
            rounded-xl p-6
            bg-white/70 backdrop-blur-md
            border border-white/40
            shadow-sm
            hover:shadow-md hover:border-emerald-300
            transition
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                w-12 h-12 rounded-lg
                bg-emerald-100 text-emerald-600
                flex items-center justify-center
                group-hover:bg-emerald-600 group-hover:text-white
                transition
              "
            >
              <Mic className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="font-medium text-slate-800">
                Practice Speaking
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Record your voice and rehearse line by line
              </p>

              {!profile && (
                <div className="mt-2 text-xs text-amber-600">
                  Sign in required
                </div>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  );
}
