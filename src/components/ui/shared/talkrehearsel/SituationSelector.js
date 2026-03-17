"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Search,
  ChevronLeft
} from "lucide-react";

export default function SituationSelector({ onSelect }) {
  const [situations, setSituations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");

  const LIMIT = 6;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSituations() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/talkrehearsel/situations?page=${page}&limit=${LIMIT}&q=${query}`,
          { signal: controller.signal }
        );
        const data = await res.json();

        setSituations(data.situations || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load situations", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSituations();
    return () => controller.abort();
  }, [page, query]);

return (
  <div className="space-y-10">
    {/* Header - Centered and Bold */}
    <div className="text-center space-y-3">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">
        Select a Situation
      </h2>
      <p className="text-slate-500 font-medium tracking-wide">
        Choose a real-life scenario to refine your communication skills.
      </p>
    </div>

    {/* Search - Ultra Minimal & Refined */}
    <div className="max-w-xl mx-auto relative group">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
      <input
        type="text"
        placeholder="Search for scenarios (e.g. Interview, Conflict...)"
        value={query}
        onChange={(e) => {
          setPage(1);
          setQuery(e.target.value);
        }}
        className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
      />
    </div>

    {/* List - Professional Cards */}
    {loading ? (
      <div className="flex flex-col items-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading situations…</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {situations.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="group relative w-full text-left rounded-[2rem] p-6 bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-3 transition-all duration-500 shadow-inner">
                <BookOpen className="w-6 h-6" strokeWidth={2.5} />
              </div>

              <div className="flex-1">
                <div className="font-black text-slate-800 tracking-tight text-lg leading-tight">
                  {s.title}
                </div>
                {s.description && (
                  <p className="text-sm text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                )}
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ChevronRight className="w-5 h-5 text-indigo-600" strokeWidth={3} />
              </div>
            </div>
          </button>
        ))}

        {situations.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">No scenarios match your search.</p>
          </div>
        )}
      </div>
    )}

    {/* Pagination - Minimalist Labels */}
    {totalPages > 1 && (
      <div className="flex items-center justify-between pt-10 border-t border-slate-100">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          Prev
        </button>

        <div className="flex gap-2">
           <span className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest">
            Page {page} / {totalPages}
          </span>
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
        >
          Next
          <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    )}
  </div>
);
}
