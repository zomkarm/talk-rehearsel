"use client";

import { useEffect, useState } from "react";

export default function SituationSelector({ onSelect }) {
  const [situations, setSituations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSituations() {
      try {
        const res = await fetch("/api/talkrehearsel/situations");
        const data = await res.json();
        setSituations(data.situations || []);
      } catch (err) {
        console.error("Failed to load situations", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSituations();
  }, []);

  if (loading) return <p>Loading situations...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select a Situation</h2>

      <div className="flex flex-col gap-3">
        {situations.map((s) => (
          <button
            key={s.id}
            className="px-4 py-3 border rounded hover:bg-gray-50 text-left"
            onClick={() => onSelect(s)}
          >
            <div className="font-medium">{s.title}</div>
            {s.description && (
              <div className="text-sm text-gray-500">{s.description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
