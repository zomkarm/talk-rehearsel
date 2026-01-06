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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Select a Situation
        </h2>
        <p className="text-sm text-slate-600">
          Choose a real-life scenario to practice
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search situations..."
          value={query}
          onChange={(e) => {
            setPage(1);
            setQuery(e.target.value);
          }}
          className="
            w-full pl-9 pr-4 py-2
            rounded-lg border
            bg-white/80 backdrop-blur
            focus:outline-none focus:ring-2 focus:ring-indigo-300
          "
        />
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-slate-600">Loading situations…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {situations.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="
                group w-full text-left
                rounded-xl p-5
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
                    w-10 h-10 rounded-lg
                    bg-indigo-100 text-indigo-600
                    flex items-center justify-center
                    group-hover:bg-indigo-600 group-hover:text-white
                    transition
                  "
                >
                  <BookOpen className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="font-medium text-slate-800">
                    {s.title}
                  </div>
                  {s.description && (
                    <div className="text-sm text-slate-500 mt-1">
                      {s.description}
                    </div>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 mt-1" />
              </div>
            </button>
          ))}

          {situations.length === 0 && (
            <p className="text-sm text-slate-500">
              No situations found.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-1 text-sm disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-1 text-sm disabled:opacity-40"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
