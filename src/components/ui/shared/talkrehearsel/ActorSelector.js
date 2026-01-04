export default function ActorSelector({ actors, onSelect, onBack }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Choose Your Role</h2>

      <div className="flex gap-3">
        {actors.map((actor) => (
          <button
            key={actor.id}
            onClick={() => onSelect(actor)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            {actor.name}
          </button>
        ))}
      </div>

      <button className="text-sm underline" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
