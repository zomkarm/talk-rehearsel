import { User, ArrowLeft } from "lucide-react";

export default function ActorSelector({ actors, onSelect, onBack, onBackToRecordings }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Choose Your Role
        </h2>
        <p className="text-sm text-slate-500">
          Select which part you want to practice
        </p>
      </div>

      {/* Actor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actors.map((actor) => (
          <button
            key={actor.id}
            onClick={() => onSelect(actor)}
            className="
              group
              flex items-center gap-4
              p-4 rounded-xl
              bg-white/70 backdrop-blur
              border border-white/40
              shadow-sm
              transition
              hover:shadow-md
              hover:border-indigo-300
              hover:bg-indigo-50
            "
          >
            {/* Avatar */}
            <div
              className="
                w-10 h-10 rounded-full
                flex items-center justify-center
                bg-indigo-100 text-indigo-600
                group-hover:bg-indigo-200
                transition
              "
            >
              <User className="w-5 h-5" />
            </div>

            {/* Info */}
            <div className="text-left">
              <div className="font-medium text-slate-800">
                {actor.name}
              </div>
              <div className="text-xs text-slate-500">
                Practice this role
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <button
        onClick={onBackToRecordings}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Check Previous Recording
      </button>
    </div>
  );
}
