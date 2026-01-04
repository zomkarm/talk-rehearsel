export default function ModeSelector({ onSelect, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose Mode</h2>

      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-gray-800 text-white rounded"
          onClick={() => onSelect("view")}
        >
          View Conversation
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => onSelect("practice")}
        >
          Practice
        </button>
      </div>

      <button className="mt-4 text-sm underline" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
