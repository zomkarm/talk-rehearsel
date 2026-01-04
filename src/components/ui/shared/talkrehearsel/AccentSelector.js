export default function AccentSelector({ onSelect, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose Accent</h2>

      <div className="flex gap-2">
        {["en-IN", "en-US", "en-GB"].map((a) => (
          <button
            key={a}
            className="px-3 py-2 border rounded"
            onClick={() => onSelect(a)}
          >
            {a}
          </button>
        ))}
      </div>

      <button className="mt-4 text-sm underline" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
