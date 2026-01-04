export default function ConversationView({ situation, accent, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {situation.title} ({accent})
      </h2>

      <div className="space-y-4">
        {situation.lines.map((line) => {
          const voice = line.voices.find(v => v.accent === accent);

          return (
            <div key={line.id} className="p-3 rounded bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">
                {line.actor.name}
              </div>

              <p className="mb-2">{line.text}</p>

              {voice && (
                <audio controls src={voice.audio_src} />
              )}
            </div>
          );
        })}
      </div>

      <button className="mt-6 underline" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
